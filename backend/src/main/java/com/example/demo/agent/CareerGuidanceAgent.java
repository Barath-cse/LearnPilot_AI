package com.example.demo.agent;

import com.example.demo.entity.CareerRecommendation;
import org.springframework.stereotype.Component;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CareerGuidanceAgent {

    private final com.example.demo.llm.GrokLlmService grokLlmService;
    private final ObjectMapper objectMapper = new ObjectMapper()
        .configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public CareerRecommendation generateRecommendations(String studentId, String currentGoal, List<String> currentSkills) {
        String systemPrompt = "You are a senior career advisor and placement expert. The student's current goal is: " + currentGoal + ". Their current skills are: " + String.join(", ", currentSkills) + ". Generate a personalized career recommendation. Respond strictly in valid JSON format: { \"recommendedCareer\": \"string\", \"futureSkills\": [\"string\"], \"recommendedProjects\": [{ \"title\": \"string\", \"description\": \"string\", \"techStack\": [\"string\"] }], \"certifications\": [\"string\"], \"salaryInsights\": \"string\" }";
        
        String response = grokLlmService.generateResponse(systemPrompt, "Provide career guidance for me.");
        
        CareerRecommendation rec = new CareerRecommendation();
        rec.setStudentId(studentId);
        try {
            String cleanedResponse = response.trim();
            if (cleanedResponse.contains("```json")) {
                cleanedResponse = cleanedResponse.substring(cleanedResponse.indexOf("```json") + 7);
            }
            if (cleanedResponse.contains("```")) {
                cleanedResponse = cleanedResponse.substring(0, cleanedResponse.lastIndexOf("```"));
            }
            
            int startIdx = cleanedResponse.indexOf("{");
            int endIdx = cleanedResponse.lastIndexOf("}");
            if (startIdx >= 0 && endIdx >= startIdx) {
                cleanedResponse = cleanedResponse.substring(startIdx, endIdx + 1);
            }
            
            CareerRecommendation parsed = objectMapper.readValue(cleanedResponse.trim(), CareerRecommendation.class);
            parsed.setStudentId(studentId);
            return parsed;
        } catch (Exception e) {
            // Fallback
            rec.setRecommendedCareer(currentGoal != null ? currentGoal : "Java Backend Developer");
            rec.setFutureSkills(List.of("Spring Boot", "Docker", "AWS"));
            rec.setSalaryInsights("Average entry-level salary: $85,000 - $110,000.");
            return rec;
        }
    }
}
