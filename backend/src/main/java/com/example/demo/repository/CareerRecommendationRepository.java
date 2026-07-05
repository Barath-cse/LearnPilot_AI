package com.example.demo.repository;

import com.example.demo.entity.CareerRecommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CareerRecommendationRepository extends MongoRepository<CareerRecommendation, String> {
    Optional<CareerRecommendation> findByStudentId(String studentId);
}
