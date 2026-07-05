package com.example.demo.service;

import com.example.demo.agent.QuizGeneratorAgent;
import com.example.demo.entity.Quiz;
import com.example.demo.entity.QuizResult;
import com.example.demo.repository.QuizRepository;
import com.example.demo.repository.QuizResultRepository;
import com.example.demo.llm.GrokLlmService;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizResultRepository quizResultRepository;
    private final QuizGeneratorAgent quizAgent;
    private final GrokLlmService grokLlmService;
    private final ObjectMapper objectMapper = new ObjectMapper()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public Quiz generateQuiz(String topic, String difficulty) {
        return createMockQuiz(topic, difficulty);
    }

    public QuizResult submitQuiz(QuizResult result) {
        result.setDate(LocalDateTime.now());
        
        // Let the AI Agent evaluate weak topics
        QuizResult evaluatedResult = quizAgent.evaluateQuiz(result);
        
        // Save and return
        return quizResultRepository.save(evaluatedResult);
    }

    private Quiz createMockQuiz(String topic, String difficulty) {
        Quiz q = new Quiz();
        q.setId(UUID.randomUUID().toString());
        q.setTopic(topic);
        q.setDifficulty(difficulty);

        int numQuestions = difficulty.equalsIgnoreCase("Easy") ? 5 : difficulty.equalsIgnoreCase("Hard") ? 10 : 7;
        
        int maxRetries = 3;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            String uniqueSeed = UUID.randomUUID().toString();
            String systemPrompt = "You are an expert technical interviewer. Generate a completely unique and highly diverse JSON array of " + numQuestions + " multiple choice questions about '" + topic + "' at a '" + difficulty + "' difficulty level. "
                    + "Do not repeat standard or common questions. Ensure questions test different edge cases, concepts, and practical scenarios. "
                    + "Use this unique seed to randomize your selection of topics and questions: " + uniqueSeed + ". "
                    + "Each object must have exactly these keys: 'text' (string), 'options' (array of 4 strings), 'correctOptionIndex' (integer 0-3), 'explanation' (string), and 'subTopic' (string). "
                    + "CRITICAL INSTRUCTION: Output ONLY a valid JSON array. No markdown, no backticks, no conversational text before or after the array. Ensure all internal strings are properly escaped.";
                    
            String response = grokLlmService.generateResponse(systemPrompt, "Generate quiz.");
            
            try {
                // Clean markdown if AI includes it
                String cleanedResponse = response.trim();
                if (cleanedResponse.contains("```json")) {
                    cleanedResponse = cleanedResponse.substring(cleanedResponse.indexOf("```json") + 7);
                }
                if (cleanedResponse.contains("```")) {
                    cleanedResponse = cleanedResponse.substring(0, cleanedResponse.lastIndexOf("```"));
                }
                
                // Also find the first [ and last ] in case there's still text
                int startIdx = cleanedResponse.indexOf("[");
                int endIdx = cleanedResponse.lastIndexOf("]");
                if (startIdx >= 0 && endIdx >= startIdx) {
                    cleanedResponse = cleanedResponse.substring(startIdx, endIdx + 1);
                }
                
                List<Quiz.Question> questions = objectMapper.readValue(cleanedResponse.trim(), new TypeReference<List<Quiz.Question>>(){});
                for (Quiz.Question question : questions) {
                    question.setId(UUID.randomUUID().toString());
                }
                q.setQuestions(questions);
                return quizRepository.save(q); // Success, return early
            } catch (Exception e) {
                System.err.println("Attempt " + attempt + " failed to parse AI response: " + response);
                if (attempt == maxRetries) {
                    e.printStackTrace();
                }
            }
        }
        
        // Fallback if all attempts fail
        Quiz.Question q1 = new Quiz.Question();
        q1.setId(UUID.randomUUID().toString());
        q1.setText("Which of the following is a marker interface in Java? (Fallback Quiz)");
        q1.setOptions(List.of("Runnable", "Cloneable", "Comparable", "Callable"));
        q1.setCorrectOptionIndex(1);
        q1.setExplanation("Cloneable is a marker interface, it has no methods.");
        q1.setSubTopic("Core Interfaces");
        q.setQuestions(List.of(q1));
        
        return quizRepository.save(q);
    }
}
