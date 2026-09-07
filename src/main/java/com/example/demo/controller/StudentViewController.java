package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StudentViewController {

    @GetMapping("/students")
    public String viewStudentsPage() {
        return "students"; // Trỏ đến file students.html trong templates
    }
}