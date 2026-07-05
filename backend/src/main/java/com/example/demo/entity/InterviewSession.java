package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "interviews")
public class InterviewSession {
    @Id
    private String id;
    private String studentId;
    private String type; // Technical, HR, Behavioral
    private List<QnAPair> qaPairs;
    private int technicalScore;
    private int communicationScore;
    private int overallScore;
    private String feedback;
    private String readinessStatus; // e.g., "Ready for Product Companies"
    private LocalDateTime sessionDate;

    @Data
    public static class QnAPair {
        private String question;
        private String studentAnswer;
        private String aiFeedback;
    }
}
