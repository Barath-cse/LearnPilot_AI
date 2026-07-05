package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "coding_problems")
public class CodingProblem {
    @Id
    private String id;
    private String title;
    private String description;
    private String difficulty; // Easy, Medium, Hard
    private List<String> tags;
    private String initialCode;
}
