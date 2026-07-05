package com.example.demo.llm;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GrokLlmService {

    @Value("${grok.api.key:mock}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GROK_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public String generateResponse(String systemPrompt, String userPrompt) {
        if ("mock".equals(apiKey) || apiKey.isBlank() || apiKey.contains("YOUR_")) {
            log.warn("Grok API key not configured. Falling back to structured mock response based on career goal.");
            return generateMockResponse(userPrompt);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.1-8b-instant");
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
            ));
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GROK_API_URL, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            log.error("Error communicating with AI API: {}", e.getMessage());
        }
        return generateMockResponse(userPrompt);
    }

    private String generateMockResponse(String userPrompt) {
        // Fallback that still responds dynamically to the career goal in the prompt
        String goal = "Software Developer";
        if (userPrompt.toLowerCase().contains("frontend")) goal = "Frontend Developer";
        else if (userPrompt.toLowerCase().contains("backend")) goal = "Backend Developer";
        else if (userPrompt.toLowerCase().contains("data sci")) goal = "Data Scientist";

        return String.format("{\"recommendedCareer\": \"%s\", \"topics\": [\"Advanced %s Concepts\", \"System Design for %s\"], \"skills\": [\"React\", \"Node.js\", \"MongoDB\"]}", goal, goal, goal);
    }
}
