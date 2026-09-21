package com.example.demo.controller;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Student;
import com.example.demo.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // API lấy danh sách sinh viên (GET)
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAll();
    }

    // API lấy sinh viên theo ID (GET)
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable UUID id) {
        return studentService.getById(id);
    }

    // API tìm kiếm sinh viên theo tên (GET)
    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam String keyword) {
        return studentService.search(keyword);
    }

    // API Thêm sinh viên (POST - Xanh lá)
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.save(student);
    }

    // API Cập nhật sinh viên (PUT - Vàng cam)
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable UUID id, @RequestBody Student student) {
        student.setId(id);
        return studentService.save(student);
    }

    // API Xóa sinh viên (DELETE - Đỏ)
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable UUID id) {
        studentService.delete(id);
    }
}