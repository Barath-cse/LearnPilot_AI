package com.example.demo.controller;

import com.example.demo.entity.InterviewSession;
import com.example.demo.service.InterviewService;
import lombok.RequiredArgsConstructor;
import com.example.demo.llm.GrokLlmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/interviews")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final GrokLlmService grokLlmService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> payload) {
        String type = (String) payload.getOrDefault("type", "Technical");
        String level = (String) payload.getOrDefault("level", "Medium");
        String message = (String) payload.getOrDefault("message", "");
        
        String systemPrompt = "You are an expert Placement Agent conducting a " + type + " mock interview at a " + level + " difficulty level. "
                + "Keep your responses short, conversational, and direct as an interviewer. "
                + "Ask one question at a time. If the user answers, give a brief 1-sentence feedback and ask the next question. "
                + "Do not use markdown formatting. Make sure the technical depth matches the " + level + " difficulty.";
        
        String response = grokLlmService.generateResponse(systemPrompt, message);
        return ResponseEntity.ok(Map.of("reply", response));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<Map<String, Integer>> evaluate(@RequestBody Map<String, Object> payload) {
        String history = (String) payload.getOrDefault("history", "");
        String type = (String) payload.getOrDefault("type", "Technical");
        
        String systemPrompt = "You are an expert Placement Agent evaluator. Review the following " + type + " mock interview transcript between the AI and the user. "
                + "Grade the user's answers on a scale of 0 to 100 based on correctness, clarity, and technical depth. "
                + "Return ONLY a JSON object with a single key 'score' and integer value. For example: {\"score\": 85}. Do not include any other text.";
        
        String response = grokLlmService.generateResponse(systemPrompt, history);
        int score = 75; // default
        try {
            // Extract numbers from the response in case there's extra text
            String digits = response.replaceAll("[^0-9]", "");
            if (!digits.isEmpty()) {
                score = Integer.parseInt(digits);
                if (score > 100) score = 100;
            }
        } catch (Exception e) {
            // fallback to default
        }
        
        return ResponseEntity.ok(Map.of("score", score));
    }

    @PostMapping("/start")
    public ResponseEntity<InterviewSession> startInterview(@RequestParam String studentId, @RequestParam String type) {
        return ResponseEntity.ok(interviewService.startInterview(studentId, type));
    }

    @PostMapping("/submit")
    public ResponseEntity<InterviewSession> submitInterview(@RequestBody InterviewSession session) {
        return ResponseEntity.ok(interviewService.submitInterview(session));
    }

    @GetMapping("/history")
    public ResponseEntity<List<InterviewSession>> getHistory(@RequestParam String studentId) {
        return ResponseEntity.ok(interviewService.getStudentInterviews(studentId));
    }
}
