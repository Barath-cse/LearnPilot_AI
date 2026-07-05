package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "career_recommendations")
public class CareerRecommendation {
    @Id
    private String id;
    private String studentId;
    private String recommendedCareer;
    private List<String> futureSkills;
    private List<ProjectRecommendation> recommendedProjects;
    private List<String> certifications;
    private String salaryInsights;
    
    @Data
    public static class ProjectRecommendation {
        private String title;
        private String description;
        private List<String> techStack;
    }
}
