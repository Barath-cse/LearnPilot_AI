package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "coding_submissions")
public class CodingSubmission {
    @Id
    private String id;
    private String studentId;
    private String problemId;
    private String language;
    private String code;
    private String status; // PENDING, REVIEWED
    private String feedback; // Markdown feedback from AI Agent
    private int score;
    private LocalDateTime submittedAt;
}
