package com.example.demo.controller;

import com.example.demo.entity.Quiz;
import com.example.demo.entity.QuizResult;
import com.example.demo.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/quiz")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/generate")
    public ResponseEntity<Quiz> generateQuiz(@RequestParam String topic, @RequestParam String difficulty) {
        return ResponseEntity.ok(quizService.generateQuiz(topic, difficulty));
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizResult> submitQuiz(@RequestBody QuizResult result) {
        return ResponseEntity.ok(quizService.submitQuiz(result));
    }
}
