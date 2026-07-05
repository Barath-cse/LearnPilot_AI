package com.example.demo.memory;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "agent_memory")
public class AgentMemory {
    
    @Id
    private String studentId;
    
    private List<MemoryContext> shortTermMemory = new ArrayList<>();
    
    // ChromaDB document IDs for retrieval
    private List<String> longTermMemoryIds = new ArrayList<>();

    @Data
    public static class MemoryContext {
        private String sourceAgent; // e.g., "CodingMentorAgent"
        private String content;     // e.g., "Student struggled with O(n) complexity on HashMap."
        private long timestamp;
    }
}
