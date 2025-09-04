import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NavBar } from "../../shared/nav-bar/nav-bar";
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-teacher',
  imports: [FormsModule, ReactiveFormsModule, NgIf, NavBar],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css'
})
export class Teacher implements OnInit{

  showAddStudent = false;
  showStudentTable = true;
  showViewStudent = false;
  isEditMode = false;
  editIndex = -1;

  searchText: string = '';

  // Modal properties
  showDeleteModal = false;
  studentToDelete: any = null;
  deleteIndex = -1;

  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 1;

  studentForm: FormGroup;
  selectedStudent: any = { name: '', email: '', department: '' };
  studentList: any[] = [];

  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  teacherService = inject(ApiService)
  router = inject(Router);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.fetchStudents();
  }

  constructor() {
    this.studentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      department: new FormControl('', Validators.required)
    });
  }

  onLogOut() {
    this.router.navigate(['/']);
  }

  toggleAddStudent() {
    if (!this.showAddStudent) {
      this.showAddStudent = true;
      this.showStudentTable = false;
      this.showViewStudent = false;
      this.isEditMode = false;
      this.editIndex = -1;
      this.resetForm();
    } else {
      this.showAddStudent = false;
      this.showStudentTable = true;
    }
  }

  resetForm() {
    this.studentForm.reset();
  }

  // Server-side sorting
  setSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.fetchStudents(); 
  }

  fetchStudents() {
    // Build server query params
    const params: any = {
      _page: this.currentPage,
      _limit: this.pageSize,
    };

    // Server-side sorting
    if (this.sortColumn) {
      params._sort = this.sortColumn;
      params._order = this.sortDirection;
    }

    // Server-side filtering
    if (this.searchText && this.searchText.trim() !== '') {
      params.q = this.searchText.trim(); 
    }

    this.teacherService.getTeacher(params).subscribe({
      next: (response) => {
        this.studentList = response.body || [];
        const totalItemsHeader = response.headers.get('X-Total-Count');
        this.totalItems = totalItemsHeader ? parseInt(totalItemsHeader, 10) : this.studentList.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error: (err) => {
        console.log("Unable to fetch the data");
        this.toastr.error("Something went wrong. Please try again later.", "Error");
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.fetchStudents();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchStudents();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchStudents();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSubmit() {
    if (this.studentForm.invalid) {
      this.toastr.warning("Please fill all fields before submitting.", "Warning");
      return;
    }

    if (this.isEditMode && this.editIndex >= 0) {
      const studentId = this.studentList[this.editIndex].id;
      this.teacherService.updateTeacher(studentId, this.studentForm.value).subscribe({
        next: () => {
          this.toastr.success("Student Updated Successfully.", "Success");
          this.fetchStudents();
          this.isEditMode = false;
          this.editIndex = -1;
          this.showAddStudent = false;
          this.showStudentTable = true;
          this.resetForm();
        },
        error: () => {
          this.toastr.error("Something went wrong. Please try again later.", "Error");
        }
      });
    } else {
        this.teacherService.addTeacher(this.studentForm.value).subscribe({
        next: () => {
          this.toastr.success("Added new student successfully!!!", "Success");
          this.fetchStudents();
          this.showAddStudent = false;
          this.showStudentTable = true;
          this.resetForm();
        },
        error: () => {
          this.toastr.error("Something went wrong. Please try again later.", "Error");
        }
      });
    }
  }

  onEdit(student: any, index: number) {
    this.isEditMode = true;
    this.editIndex = index;

    this.studentForm.patchValue({
      name: student.name,
      email: student.email,
      department: student.department
    });

    this.showAddStudent = true;
    this.showStudentTable = false;
    this.showViewStudent = false;
  }

  onDelete(index: number) {
    this.deleteIndex = index;
    this.studentToDelete = this.studentList[index];
    this.showDeleteModal = true;
  }

  confirmDelete() {
    const studentId = this.studentList[this.deleteIndex].id;
    this.teacherService.deleteTeacher(studentId).subscribe({
      next: () => {
        this.toastr.success("Student deleted successfully!!!", "Success");
        if (this.studentList.length === 1 && this.currentPage > 1) this.currentPage--;
        this.fetchStudents();
        this.closeDeleteModal();
      },
      error: () => {
        this.toastr.error("Something went wrong. Please try again later.", "Error");
        this.closeDeleteModal();
      }
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.studentToDelete = null;
    this.deleteIndex = -1;
  }

  onView(student: any) {
    this.selectedStudent = { ...student };
    this.showViewStudent = true;
    this.showStudentTable = false;
    this.showAddStudent = false;    
  }

  closeViewStudent() {
    this.showViewStudent = false;
    this.showAddStudent = false;
    this.showStudentTable = true;
  }
}