package com.example.demo.agent;

import com.example.demo.workflow.AgentState;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class PersonalTutorAgent {

    /**
     * Acts as the Router / Coordinator node in the LangGraph.
     * Evaluates the current AgentState (user intent, weak topics, current goal)
     * and decides which specialized agent should execute next.
     */
    public AgentState coordinate(AgentState state) {
        log.info("Personal Tutor analyzing state to determine intent...");
        
        String input = state.getUserMessage();
        
        // Simulating LLM Intent Classification
        if (input != null) {
            String lowerInput = input.toLowerCase();
            if (lowerInput.contains("code") || lowerInput.contains("review") || lowerInput.contains("bug")) {
                state.setNextAgent("CodingMentorAgent");
            } else if (lowerInput.contains("quiz") || lowerInput.contains("test")) {
                state.setNextAgent("QuizGeneratorAgent");
            } else if (lowerInput.contains("interview") || lowerInput.contains("placement")) {
                state.setNextAgent("PlacementAgent");
            } else if (lowerInput.contains("career") || lowerInput.contains("roadmap") || lowerInput.contains("job")) {
                state.setNextAgent("CareerGuidanceAgent");
            } else {
                state.setNextAgent("END");
            }
        } else {
            // Default behavior if triggered autonomously without user input
            if (!state.getWeakTopics().isEmpty()) {
                log.info("Detected weak topics. Routing to QuizGeneratorAgent for adaptive revision.");
                state.setNextAgent("QuizGeneratorAgent");
            } else {
                state.setNextAgent("END");
            }
        }
        
        return state;
    }
}
