package com.example.demo.workflow;

import lombok.Data;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

/**
 * Represents the shared state in our LangGraph workflow.
 * All agents read from and write to this state.
 */
@Data
public class AgentState {
    private String studentId;
    private String currentGoal;
    private String userMessage;
    
    // Memory and History
    private List<String> conversationHistory = new ArrayList<>();
    private List<String> weakTopics = new ArrayList<>();
    
    // Routing flag set by the Coordinator (Personal Tutor)
    private String nextAgent; 
    
    // Agent Outputs
    private Map<String, Object> agentOutputs = new HashMap<>();
    
    public void addHistory(String message) {
        this.conversationHistory.add(message);
    }
}
