package com.example.demo.service;

import com.example.demo.agent.PlacementAgent;
import com.example.demo.entity.InterviewSession;
import com.example.demo.repository.InterviewRepository;
import com.example.demo.llm.GrokLlmService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final PlacementAgent placementAgent;
    private final GrokLlmService grokLlmService;

    public InterviewSession startInterview(String studentId, String type) {
        InterviewSession session = new InterviewSession();
        session.setStudentId(studentId);
        session.setType(type);
        session.setSessionDate(LocalDateTime.now());
        
        String prompt = "You are an expert technical interviewer. Generate 3 " + type + " interview questions for a candidate. Output strictly a JSON array of strings. Do not include markdown or other text. Example: [\"Question 1?\", \"Question 2?\"]";
        String response = grokLlmService.generateResponse(prompt, "Generate interview questions");
        
        List<InterviewSession.QnAPair> qaPairs = new ArrayList<>();
        try {
            String cleanedResponse = response.trim();
            if (cleanedResponse.contains("[")) {
                cleanedResponse = cleanedResponse.substring(cleanedResponse.indexOf("["), cleanedResponse.lastIndexOf("]") + 1);
            }
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            List<String> questions = mapper.readValue(cleanedResponse, new com.fasterxml.jackson.core.type.TypeReference<List<String>>(){});
            
            for (String q : questions) {
                InterviewSession.QnAPair pair = new InterviewSession.QnAPair();
                pair.setQuestion(q);
                qaPairs.add(pair);
            }
        } catch (Exception e) {
            System.err.println("Failed to parse interview questions: " + response);
            InterviewSession.QnAPair q1 = new InterviewSession.QnAPair();
            q1.setQuestion("Explain how a HashMap works internally in Java.");
            qaPairs.add(q1);
        }
        
        session.setQaPairs(qaPairs);
        return interviewRepository.save(session);
    }

    public InterviewSession submitInterview(InterviewSession session) {
        // AI Evaluates the completed interview
        InterviewSession evaluatedSession = placementAgent.evaluateInterview(session);
        return interviewRepository.save(evaluatedSession);
    }

    public List<InterviewSession> getStudentInterviews(String studentId) {
        return interviewRepository.findByStudentId(studentId);
    }
}
