package com.example.demo.agent;

import com.example.demo.entity.InterviewSession;
import org.springframework.stereotype.Component;

@Component
public class PlacementAgent {

    public InterviewSession evaluateInterview(InterviewSession session) {
        // Mock evaluation logic by AI Agent
        
        // Analyze responses for technical accuracy and communication style
        for (InterviewSession.QnAPair qa : session.getQaPairs()) {
            if (qa.getStudentAnswer() != null && !qa.getStudentAnswer().isEmpty()) {
                qa.setAiFeedback("Good attempt. Consider structuring your answer using the STAR method.");
            } else {
                qa.setAiFeedback("No answer provided.");
            }
        }
        
        session.setTechnicalScore(82);
        session.setCommunicationScore(78);
        session.setOverallScore(80);
        session.setReadinessStatus("Ready for Service Companies, Needs practice for Product Companies");
        session.setFeedback("Your technical knowledge is solid, but communication needs slightly more structure.");
        
        return session;
    }
}
