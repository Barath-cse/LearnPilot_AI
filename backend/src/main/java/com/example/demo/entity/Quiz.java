package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String topic;
    private String difficulty; // Beginner, Intermediate, Advanced
    private List<Question> questions;

    @Data
    public static class Question {
        private String id;
        private String text;
        private List<String> options;
        private int correctOptionIndex;
        private String explanation;
        private String subTopic; // e.g., "Collections", "Streams" (used to detect weak areas)
    }
}
