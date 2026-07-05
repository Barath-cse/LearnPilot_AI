package com.example.demo.repository;

import com.example.demo.entity.LearningProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    Optional<LearningProgress> findByStudentId(String studentId);
}
