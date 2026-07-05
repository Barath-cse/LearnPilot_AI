package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "roadmaps")
public class Roadmap {
    @Id
    private String id;
    private String career;
    private List<String> skills;
    private List<Topic> topics;
    private List<String> projects;
    private List<String> certifications;

    @Data
    public static class Topic {
        private String topicId;
        private String title;
        private String description;
        private String content; // Could be markdown or structured text
        private int estimatedHours;
        private int sequence;
    }
}
