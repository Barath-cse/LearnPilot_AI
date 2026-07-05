package com.example.demo.agent;

import com.example.demo.entity.QuizResult;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class QuizGeneratorAgent {

    public QuizResult evaluateQuiz(QuizResult result) {
        // In real app, LangGraph checks answers, deduces sub-topics failed, 
        // and generates adaptive learning recommendations.
        
        // Mock evaluation (finding weak topics based on score)
        if (result.getScore() < (result.getTotalQuestions() * 0.7)) {
            result.setWeakTopics(List.of("Collections", "Streams"));
        } else {
            result.setWeakTopics(List.of());
        }
        
        return result;
    }
}
