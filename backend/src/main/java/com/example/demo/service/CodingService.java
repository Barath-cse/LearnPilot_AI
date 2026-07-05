package com.example.demo.service;

import com.example.demo.agent.CodingMentorAgent;
import com.example.demo.entity.CodingProblem;
import com.example.demo.entity.CodingSubmission;
import com.example.demo.repository.CodingProblemRepository;
import com.example.demo.repository.CodingSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CodingService {

    private final CodingProblemRepository problemRepository;
    private final CodingSubmissionRepository submissionRepository;
    private final CodingMentorAgent mentorAgent;

    public List<CodingProblem> getAllProblems() {
        List<CodingProblem> problems = problemRepository.findAll();
        if (problems.isEmpty()) {
            return List.of(createMockProblem());
        }
        return problems;
    }

    public CodingProblem getProblem(String id) {
        return problemRepository.findById(id).orElseGet(this::createMockProblem);
    }

    public CodingSubmission submitCode(CodingSubmission submission) {
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus("PENDING");
        
        // Save initial pending state
        CodingSubmission savedSubmission = submissionRepository.save(submission);
        
        // Invoke AI Agent for code review
        CodingSubmission reviewedSubmission = mentorAgent.reviewCode(savedSubmission);
        
        // Save and return reviewed state
        return submissionRepository.save(reviewedSubmission);
    }

    private CodingProblem createMockProblem() {
        CodingProblem p = new CodingProblem();
        p.setId("p1");
        p.setTitle("Two Sum");
        p.setDescription("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.");
        p.setDifficulty("Easy");
        p.setTags(List.of("Array", "Hash Table"));
        p.setInitialCode("class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}");
        return problemRepository.save(p);
    }
}
