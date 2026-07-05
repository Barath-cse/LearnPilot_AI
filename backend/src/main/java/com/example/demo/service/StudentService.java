package com.example.demo.service;

import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public Student registerStudent(Student student) {
        return studentRepository.findByEmail(student.getEmail())
                .orElseGet(() -> studentRepository.save(student));
    }

    public Student getStudentProfile(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found with email: " + email));
    }

    public Student updateStudentProfile(String email, Student updatedStudent) {
        Student existingStudent = getStudentProfile(email);
        
        if (updatedStudent.getName() != null) existingStudent.setName(updatedStudent.getName());
        if (updatedStudent.getDepartment() != null) existingStudent.setDepartment(updatedStudent.getDepartment());
        if (updatedStudent.getCareerGoal() != null) existingStudent.setCareerGoal(updatedStudent.getCareerGoal());
        if (updatedStudent.getSkills() != null) existingStudent.setSkills(updatedStudent.getSkills());
        
        return studentRepository.save(existingStudent);
    }
}
