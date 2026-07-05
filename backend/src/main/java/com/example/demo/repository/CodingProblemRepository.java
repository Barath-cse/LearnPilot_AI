package com.example.demo.repository;

import com.example.demo.entity.CodingProblem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingProblemRepository extends MongoRepository<CodingProblem, String> {
    List<CodingProblem> findByTagsIn(List<String> tags);
}
