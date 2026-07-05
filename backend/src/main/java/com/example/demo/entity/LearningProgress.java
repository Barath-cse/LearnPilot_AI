package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "learning_progress")
public class LearningProgress {
    @Id
    private String id;
    private String studentId;
    private String roadmapId;
    private List<String> completedTopicIds;
    private List<String> weakTopics;
    private List<String> bookmarkedTopicIds;
    private int completionPercentage;
}
