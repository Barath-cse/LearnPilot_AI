package com.example.demo.controller;

import com.example.demo.entity.Student;
import com.example.demo.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping("/register")
    public ResponseEntity<Student> register(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.registerStudent(student));
    }

    // For now, we simulate authentication by passing email as a query param or path variable.
    // In later phases, this will be extracted from JWT.
    @GetMapping("/profile")
    public ResponseEntity<Student> getProfile(@RequestParam String email) {
        return studentService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<Student> updateProfile(@RequestParam String email, @RequestBody Student student) {
        return ResponseEntity.ok(studentService.updateStudentProfile(email, student));
    }
}
