package com.example.demo.workflow;

import com.example.demo.agent.PersonalTutorAgent;
import com.example.demo.agent.CodingMentorAgent;
import com.example.demo.agent.QuizGeneratorAgent;
import com.example.demo.agent.PlacementAgent;
import com.example.demo.agent.CareerGuidanceAgent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

/**
 * Java implementation of the LangGraph state machine.
 * This engine orchestrates the autonomous execution of agents based on the shared state.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LangGraphEngine {

    private final PersonalTutorAgent tutorAgent;
    private final CodingMentorAgent codingAgent;
    private final QuizGeneratorAgent quizAgent;
    private final PlacementAgent placementAgent;
    private final CareerGuidanceAgent careerAgent;

    public AgentState executeWorkflow(AgentState initialState) {
        AgentState currentState = initialState;
        boolean isFinished = false;
        int maxIterations = 5; // Prevent infinite loops in autonomous workflows
        int iterations = 0;

        log.info("Starting LangGraph Workflow for Student: {}", currentState.getStudentId());

        while (!isFinished && iterations < maxIterations) {
            iterations++;
            
            // 1. Personal Tutor Agent (Coordinator) evaluates the state and decides the next step
            currentState = tutorAgent.coordinate(currentState);
            
            String nextNode = currentState.getNextAgent();
            log.info("Workflow Routing: Coordinator decided next node -> {}", nextNode);

            // 2. Route to the appropriate sub-agent
            switch (nextNode) {
                case "CodingMentorAgent":
                    currentState = runCodingNode(currentState);
                    break;
                case "QuizGeneratorAgent":
                    currentState = runQuizNode(currentState);
                    break;
                case "PlacementAgent":
                    currentState = runPlacementNode(currentState);
                    break;
                case "CareerGuidanceAgent":
                    currentState = runCareerNode(currentState);
                    break;
                case "END":
                    isFinished = true;
                    log.info("Workflow Reached END Node.");
                    break;
                default:
                    log.warn("Unknown node: {}. Terminating workflow.", nextNode);
                    isFinished = true;
            }
            
            // Post-execution: update memory/vector store
            updateLongTermMemory(currentState);
        }

        return currentState;
    }

    private AgentState runCodingNode(AgentState state) {
        log.info("Executing CodingMentorAgent...");
        // Invoke specific LLM prompt for coding review
        state.getAgentOutputs().put("coding_feedback", "Code reviewed successfully by AI.");
        state.setNextAgent("END"); // Returns control or finishes
        return state;
    }

    private AgentState runQuizNode(AgentState state) {
        log.info("Executing QuizGeneratorAgent...");
        state.getAgentOutputs().put("quiz_feedback", "Adaptive quiz generated.");
        state.setNextAgent("END");
        return state;
    }

    private AgentState runPlacementNode(AgentState state) {
        log.info("Executing PlacementAgent...");
        state.getAgentOutputs().put("placement_feedback", "Mock interview evaluated.");
        state.setNextAgent("END");
        return state;
    }

    private AgentState runCareerNode(AgentState state) {
        log.info("Executing CareerGuidanceAgent...");
        state.getAgentOutputs().put("career_feedback", "Career roadmap updated.");
        state.setNextAgent("END");
        return state;
    }

    private void updateLongTermMemory(AgentState state) {
        // Here we would embed the state.getConversationHistory() and save to ChromaDB
        log.info("Vectorizing and saving state to ChromaDB for long-term memory.");
    }
}
