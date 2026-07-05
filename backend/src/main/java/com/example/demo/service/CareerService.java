package com.example.demo.service;

import com.example.demo.agent.CareerGuidanceAgent;
import com.example.demo.entity.CareerRecommendation;
import com.example.demo.entity.Student;
import com.example.demo.repository.CareerRecommendationRepository;
import com.example.demo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CareerService {

    private final CareerRecommendationRepository careerRepository;
    private final StudentRepository studentRepository;
    private final CareerGuidanceAgent careerAgent;

    public CareerRecommendation getRecommendations(String studentId) {
        // If exists, return it. Otherwise, generate it.
        return careerRepository.findByStudentId(studentId)
                .orElseGet(() -> generateAndSaveRecommendation(studentId));
    }

    private CareerRecommendation generateAndSaveRecommendation(String studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        
        String goal = studentOpt.map(Student::getCareerGoal).orElse("Backend Developer");
        java.util.List<String> skills = studentOpt.map(Student::getSkills).orElse(java.util.List.of());
        
        CareerRecommendation rec = careerAgent.generateRecommendations(studentId, goal, skills);
        return careerRepository.save(rec);
    }
}
