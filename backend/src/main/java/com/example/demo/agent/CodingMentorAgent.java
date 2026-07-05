package com.example.demo.agent;

import com.example.demo.entity.CodingSubmission;
import com.example.demo.entity.CodingProblem;
import com.example.demo.repository.CodingProblemRepository;
import com.example.demo.llm.GrokLlmService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CodingMentorAgent {

    private final GrokLlmService grokLlmService;
    private final CodingProblemRepository problemRepository;

    public CodingSubmission reviewCode(CodingSubmission submission) {
        CodingProblem problem = problemRepository.findById(submission.getProblemId()).orElse(null);
        String problemTitle = problem != null ? problem.getTitle() : "Unknown Problem";
        String problemDesc = problem != null ? problem.getDescription() : "No description available.";

        String systemPrompt = "You are an expert Senior Software Engineer and Coding Mentor. Review the following code submitted by a student for the problem '" + problemTitle + "'. "
                + "Problem Description: " + problemDesc + "\n\n"
                + "Provide a detailed code review in Markdown format. Start with a brief summary, then list positives, and finally suggestions for improvement (like time/space complexity or edge cases). "
                + "AT THE VERY END of your response, on a new line, output exactly 'SCORE: X' where X is an integer from 0 to 100 based on correctness and quality.";

        String userPrompt = "Language: " + submission.getLanguage() + "\nCode:\n" + submission.getCode();

        String review = grokLlmService.generateResponse(systemPrompt, userPrompt);
        
        int score = 50; // default
        try {
            if (review.contains("SCORE:")) {
                String scoreStr = review.substring(review.lastIndexOf("SCORE:") + 6).trim();
                score = Integer.parseInt(scoreStr.replaceAll("[^0-9]", ""));
            }
        } catch (Exception e) {
            System.err.println("Failed to parse score from review.");
        }

        submission.setStatus("REVIEWED");
        submission.setScore(score);
        submission.setFeedback(review);
        
        return submission;
    }
}
