package com.example.demo.controller;

import com.example.demo.entity.CodingProblem;
import com.example.demo.entity.CodingSubmission;
import com.example.demo.service.CodingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/coding")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CodingController {

    private final CodingService codingService;

    @GetMapping("/problems")
    public ResponseEntity<List<CodingProblem>> getAllProblems() {
        return ResponseEntity.ok(codingService.getAllProblems());
    }

    @GetMapping("/problems/{id}")
    public ResponseEntity<CodingProblem> getProblem(@PathVariable String id) {
        return ResponseEntity.ok(codingService.getProblem(id));
    }

    @PostMapping("/submit")
    public ResponseEntity<CodingSubmission> submitCode(@RequestBody CodingSubmission submission) {
        return ResponseEntity.ok(codingService.submitCode(submission));
    }
}
