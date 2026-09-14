package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StudentViewController {

    @GetMapping({"/", "/index"})
    public String viewIndexPage() {
        return "index";
    }
}