package com.example.demo.controller;

import com.example.demo.entity.LearningProgress;
import com.example.demo.entity.Roadmap;
import com.example.demo.llm.GrokLlmService;
import com.example.demo.service.LearningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/learning")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LearningController {

    private final LearningService learningService;
    private final GrokLlmService grokLlmService;

    @GetMapping("/roadmap")
    public ResponseEntity<Roadmap> getRoadmap(@RequestParam String careerGoal) {
        return ResponseEntity.ok(learningService.getRoadmapForStudent(careerGoal));
    }

    @PostMapping("/generate-roadmap")
    public ResponseEntity<Map<String, Object>> generateCustomRoadmap(@RequestBody Map<String, String> body) {
        String topic = body.getOrDefault("topic", "Python");

        String systemPrompt = "You are an expert curriculum designer and software engineering mentor. " +
            "Generate a structured learning roadmap for the topic: \"" + topic + "\". " +
            "Respond ONLY with a valid JSON object in this exact format: " +
            "{\"topic\": \"string\", \"description\": \"string\", \"steps\": [" +
            "{\"id\": \"s1\", \"title\": \"string\", \"description\": \"string\", \"estimatedHours\": number, \"resources\": [\"string\"]}," +
            "{\"id\": \"s2\", ...}" +
            "]} " +
            "Include 5-7 steps ordered from beginner to advanced. No markdown, no explanation, pure JSON only.";

        String raw = grokLlmService.generateResponse(systemPrompt, "Generate roadmap for: " + topic);

        try {
            // Strip markdown fences if present
            if (raw.contains("```json")) raw = raw.substring(raw.indexOf("```json") + 7, raw.lastIndexOf("```")).trim();
            else if (raw.contains("```")) raw = raw.substring(raw.indexOf("```") + 3, raw.lastIndexOf("```")).trim();

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map<String, Object> result = mapper.readValue(raw, Map.class);

            // Validate it has the correct structure with steps
            if (!result.containsKey("steps") || result.get("steps") == null) {
                return ResponseEntity.ok(buildFallbackRoadmap(topic));
            }
            // Ensure topic is set
            if (!result.containsKey("topic") || result.get("topic") == null) {
                result.put("topic", topic);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(buildFallbackRoadmap(topic));
        }
    }

    private Map<String, Object> buildFallbackRoadmap(String topic) {
        String t = topic.trim();
        List<Map<String, Object>> steps = new ArrayList<>();
        String[][] defaults = {
            {"s1", "Introduction to " + t, "Understand what " + t + " is, why it's used, and set up your environment.", "2"},
            {"s2", t + " Core Syntax", "Learn the basic syntax, data types, variables, and operators.", "4"},
            {"s3", t + " Control Flow", "Master conditionals, loops, and functions in " + t + ".", "4"},
            {"s4", "Working with Data in " + t, "Manipulate data structures like arrays, lists, objects, or tables.", "5"},
            {"s5", "Intermediate " + t + " Concepts", "Explore intermediate features such as modules, error handling, and best practices.", "6"},
            {"s6", "Real-World " + t + " Projects", "Build 2-3 hands-on projects to apply your knowledge.", "8"},
            {"s7", "Advanced " + t + " Patterns", "Dive into advanced patterns, performance optimization, and industry standards.", "6"},
        };
        for (String[] row : defaults) {
            steps.add(Map.of("id", row[0], "title", row[1], "description", row[2],
                "estimatedHours", Integer.parseInt(row[3]),
                "resources", List.of("Official " + t + " Documentation", "Practice on LeetCode / HackerRank")));
        }
        return Map.of("topic", t, "description", "A comprehensive learning path for " + t + " from beginner to advanced.", "steps", steps);
    }

    @GetMapping("/progress")
    public ResponseEntity<LearningProgress> getProgress(@RequestParam String studentId) {
        return ResponseEntity.ok(learningService.getProgress(studentId));
    }

    @PostMapping("/progress/complete/{topicId}")
    public ResponseEntity<LearningProgress> markTopicCompleted(@RequestParam String studentId, @PathVariable String topicId) {
        return ResponseEntity.ok(learningService.markTopicCompleted(studentId, topicId));
    }
}
