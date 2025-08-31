import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from './search-filter-pipe';

@Component({
  selector: 'app-student',
  imports: [RouterLink, FormsModule, CommonModule, SearchFilterPipe],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class Student implements OnInit {

  showAddStudent = false;
  showStudentTable = true;
  showViewStudent = false;
  isEditMode = false;
  editIndex = -1;

  searchText: any;

  // Modal properties
  showDeleteModal = false;
  studentToDelete: any = null;
  deleteIndex = -1;

  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 1;

  students: any = {
    name: '',
    email: '',
    department: ''
  }

  selectedStudent: any = {
    name: '',
    email: '',
    department: ''
  }

  studentList: any[] = [];

  router = inject(Router);
  http = inject(HttpClient);
  toastr = inject(ToastrService);

  apiUrl: string = "https://my-json-api-i00y.onrender.com/students";

  onLogOut() {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.fetchStudents();
  }

  toggleAddStudent() {
    if (!this.showAddStudent) {
      this.showAddStudent = true;
      this.showStudentTable = false;
      this.showViewStudent = false;
      this.isEditMode = false;
      this.editIndex = -1;
      this.resetForm();
    }
    else {
      this.showAddStudent = false;
      this.showStudentTable = true;  
    }
  }

  resetForm() {
    this.students = {
      name: '',
      email: '',
      department: ''
    };
  }

  fetchStudents() {
    this.http.get<any[]>(`${this.apiUrl}?_page=${this.currentPage}&_limit=${this.pageSize}`, { observe: 'response' }).subscribe({
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
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onSubmit() {
    if (!this.students.name || !this.students.email || !this.students.department) {
      this.toastr.warning("Please fill all fields before submitting.", "Warning");
      return;
    }
    if (this.isEditMode && this.editIndex >= 0) {
      const studentId = this.studentList[this.editIndex].id;
      this.http.put(`${this.apiUrl}/${studentId}`, this.students).subscribe({
        next: () => {
          this.toastr.success("Student Updated Successfully.", "Success");
          this.fetchStudents();
          this.isEditMode = false;
          this.editIndex = -1;
          this.showAddStudent = false;
          this.showStudentTable = true;
          this.resetForm();
        },
        error: (err) => {
          console.log("Unable to update the student");
          this.toastr.error("Something went wrong. Please try again later.", "Error");
        }
      });
    } else {
      this.http.post(this.apiUrl, this.students).subscribe({
        next: (data) => {
          this.toastr.success("Added new student successfully!!!", "Success");
          this.fetchStudents();
          this.showAddStudent = false;
          this.showStudentTable = true;
          this.resetForm();
        },
        error: (err) => {
          console.log("Unable to add new student");
          this.toastr.error("Something went wrong. Please try again later.", "Error");
        }
      });
    }   
  }
  
  onEdit(student: any, index: number) {
    this.isEditMode = true;
    this.editIndex = index;
    this.students = { ...student };
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
    this.http.delete(`${this.apiUrl}/${studentId}`).subscribe({
      next: () => {
        this.toastr.success("Student deleted successfully!!!", "Success");
        // Adjust current page if necessary
        if (this.studentList.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }
        this.fetchStudents();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.log("Unable to delete the data");
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