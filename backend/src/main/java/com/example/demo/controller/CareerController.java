package com.example.demo.controller;

import com.example.demo.entity.CareerRecommendation;
import com.example.demo.service.CareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/career")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CareerController {

    private final CareerService careerService;

    @GetMapping("/recommendations")
    public ResponseEntity<CareerRecommendation> getRecommendations(@RequestParam String studentId) {
        return ResponseEntity.ok(careerService.getRecommendations(studentId));
    }
}
