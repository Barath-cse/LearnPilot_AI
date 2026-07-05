package com.example.demo.service;

import com.example.demo.entity.LearningProgress;
import com.example.demo.entity.Roadmap;
import com.example.demo.repository.LearningProgressRepository;
import com.example.demo.repository.RoadmapRepository;
import com.example.demo.llm.GrokLlmService;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LearningService {

    private final RoadmapRepository roadmapRepository;
    private final LearningProgressRepository learningProgressRepository;
    private final GrokLlmService grokLlmService;
    private final ObjectMapper objectMapper = new ObjectMapper()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public Roadmap getRoadmapForStudent(String careerGoal) {
        // In a real scenario, this would dynamically generate if not exists, 
        // calling the Personal Tutor Agent or Career Guidance Agent.
        return roadmapRepository.findByCareer(careerGoal)
                .orElseGet(() -> createMockRoadmap(careerGoal));
    }

    public LearningProgress getProgress(String studentId) {
        return learningProgressRepository.findByStudentId(studentId)
                .orElseGet(() -> {
                    LearningProgress p = new LearningProgress();
                    p.setStudentId(studentId);
                    p.setCompletedTopicIds(new ArrayList<>());
                    p.setWeakTopics(new ArrayList<>());
                    p.setBookmarkedTopicIds(new ArrayList<>());
                    p.setCompletionPercentage(0);
                    return learningProgressRepository.save(p);
                });
    }

    public LearningProgress markTopicCompleted(String studentId, String topicId) {
        LearningProgress progress = getProgress(studentId);
        if (!progress.getCompletedTopicIds().contains(topicId)) {
            progress.getCompletedTopicIds().add(topicId);
            // Re-calculate completion percentage logic would go here
            return learningProgressRepository.save(progress);
        }
        return progress;
    }

    private Roadmap createMockRoadmap(String career) {
        Roadmap r = new Roadmap();
        r.setCareer(career);

        String systemPrompt = "Generate a structured learning roadmap for the career goal: '" + career + "'. "
                + "Return ONLY a valid JSON object with the following structure: "
                + "{ \"skills\": [\"Skill 1\", \"Skill 2\", \"Skill 3\"], "
                + "\"topics\": [ { \"topicId\": \"t1\", \"title\": \"Topic Title\", \"description\": \"Short desc\", \"content\": \"Detailed content\", \"estimatedHours\": 5, \"sequence\": 1 } ] } "
                + "Do not use markdown formatting or text before or after the JSON.";

        String response = grokLlmService.generateResponse(systemPrompt, "Generate Roadmap");

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

            Roadmap generated = objectMapper.readValue(cleanedResponse.trim(), Roadmap.class);
            r.setSkills(generated.getSkills() != null ? generated.getSkills() : List.of("General Skill"));
            
            if (generated.getTopics() != null) {
                for (Roadmap.Topic t : generated.getTopics()) {
                    if (t.getTopicId() == null) t.setTopicId(UUID.randomUUID().toString());
                }
                r.setTopics(generated.getTopics());
            } else {
                r.setTopics(new ArrayList<>());
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to parse roadmap AI response: " + response);
            // Fallback
            r.setSkills(List.of("Java", "Spring Boot", "REST APIs"));
            Roadmap.Topic t1 = new Roadmap.Topic();
            t1.setTopicId("t1");
            t1.setTitle("Introduction to " + career);
            t1.setDescription("Learn the basics.");
            t1.setContent("This is a fallback topic due to an AI parsing error.");
            t1.setEstimatedHours(2);
            t1.setSequence(1);
            r.setTopics(List.of(t1));
        }

        return roadmapRepository.save(r);
    }
}
