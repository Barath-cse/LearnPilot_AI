package com.example.demo.repository;

import com.example.demo.entity.InterviewSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends MongoRepository<InterviewSession, String> {
    List<InterviewSession> findByStudentId(String studentId);
}
