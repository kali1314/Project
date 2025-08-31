import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterPipe } from './search-filter-pipe';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-teacher',
  imports: [RouterLink, FormsModule, CommonModule ,SearchFilterPipe, NgxPaginationModule],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css'
})
export class Teacher implements OnInit{

  showAddStudent = false;
  showStudentTable = true;
  showViewStudent = false;
  isEditMode = false;
  editIndex = -1;

  page: number = 1;

  searchText: any;

  // Modal properties
  showDeleteModal = false;
  studentToDelete: any = null;
  deleteIndex = -1;

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

  resetForm() {
    this.students = {
      name: '',
      email: '',
      department: ''
    };
  }

  studentList: any[] = [];

  router = inject(Router);
  http = inject(HttpClient);
  toastr = inject(ToastrService);

  apiUrl: string = "https://my-json-api-i00y.onrender.com/teachers";

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

  fetchStudents() {
    this.http.get<any[]>(this.apiUrl).subscribe({next: (data) => {
      this.studentList = data;
    }, error: (err) => {
      console.log("Unable to fetch the data");
      this.toastr.error("Something went wrong. Please try again later.", "Error");
    }})
  }

  onSubmit() {
    if (!this.students.name || !this.students.email || !this.students.department) {
      this.toastr.warning("Please fill all fields before submitting.", "Warning");
      return;
    }
    if (this.isEditMode && this.editIndex >= 0) {
      const studentId = this.studentList[this.editIndex].id;
      this.http.put(`${this.apiUrl}/${studentId}`, this.students).subscribe({next: () => {
        this.toastr.success("Teacher Updated Successfully.", "Success");
        this.fetchStudents();
        this.isEditMode = false;
        this.editIndex = -1;
        this.showAddStudent = false;
        this.showStudentTable = true;
        this.resetForm();
      }, error: (err) => {
        console.log("Unable to update the student");
        this.toastr.error("Something went wrong. Please try again later.", "Error");
      }})
    } 
    else {
      this.http.post(this.apiUrl, this.students).subscribe({next: (data) => {
        this.toastr.success("Added new teacher successfully!!!", "Success");
        this.fetchStudents();
        this.showAddStudent = false;
        this.showStudentTable = true;
        this.resetForm();
      }, error: (err) => {
        console.log("Unable to add new student");
        this.toastr.error("Something went wrong. Please try again later.", "Error");
      }})
    }   
  }
  
  onEdit(student: any, index: number) {
    this.isEditMode = true;
    this.editIndex = index;

    this.students = { ...student};

    this.showAddStudent = true;
    this.showStudentTable = false;
    this.showViewStudent = false;
  }

  // Updated delete method - opens modal instead of confirm
  onDelete(index: number) {
    this.deleteIndex = index;
    this.studentToDelete = this.studentList[index];
    this.showDeleteModal = true;
  }

  // Confirm delete from modal
  confirmDelete() {
    const studentId = this.studentList[this.deleteIndex].id;
    this.http.delete(`${this.apiUrl}/${studentId}`).subscribe({next: () => {
      this.toastr.success("Student deleted successfully!!!", "Success");
      this.fetchStudents();
      this.closeDeleteModal();
    }, error: (err) => {
      console.log("Unable to delete the data");
      this.toastr.error("Something went wrong. Please try again later.", "Error");
      this.closeDeleteModal();
    }})
  }

  // Close delete modal
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.studentToDelete = null;
    this.deleteIndex = -1;
  }

  onView(student: any) {
    this.selectedStudent = { ...student};
    this.showViewStudent = true;
    this.showStudentTable = false;
    this.showAddStudent = false;    
  }

  closeViewStudent() {
    this.showViewStudent = !this.showViewStudent;
    this.showAddStudent = false;
    this.showStudentTable = true;
  }  
}