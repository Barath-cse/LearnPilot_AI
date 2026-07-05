package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "quiz_results")
public class QuizResult {
    @Id
    private String id;
    private String studentId;
    private String quizId;
    private String topic;
    private int score;
    private int totalQuestions;
    private List<String> weakTopics;
    private Map<String, Integer> studentAnswers; // Question ID -> Selected Option Index
    private LocalDateTime date;
}
