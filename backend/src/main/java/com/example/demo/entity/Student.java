package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Data
@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String department;
    private String careerGoal;
    private List<String> skills;
    private Map<String, Object> progress;
    private String roadmapId;
}
