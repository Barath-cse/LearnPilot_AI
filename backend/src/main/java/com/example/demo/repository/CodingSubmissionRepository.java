package com.example.demo.repository;

import com.example.demo.entity.CodingSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingSubmissionRepository extends MongoRepository<CodingSubmission, String> {
    List<CodingSubmission> findByStudentId(String studentId);
}
