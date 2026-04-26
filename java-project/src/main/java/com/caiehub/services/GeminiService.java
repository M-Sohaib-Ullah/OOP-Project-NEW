package com.caiehub.services;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class GeminiService {
    private static final String API_KEY = "YOUR_GEMINI_API_KEY";
    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private final HttpClient httpClient;

    public GeminiService() {
        this.httpClient = HttpClient.newHttpClient();
    }

    /**
     * Prompts Gemini to grade a student's answer based on the total marks.
     */
    public CompletableFuture<String> gradeAnswer(String question, String studentAnswer, int totalMarks) {
        String prompt = String.format("You are a strict Cambridge examiner.\nQuestion: %s\nTotal Marks Available: %d\nStudent's Answer: %s\nTask: 1. Grade the student's answer out of the total marks. 2. Provide brief feedback explaining where they got marks and where they lost them. Return as JSON with 'score' (number) and 'feedback' (string).", question, totalMarks, studentAnswer);

        JsonObject contents = new JsonObject();
        JsonArray parts = new JsonArray();
        JsonObject part = new JsonObject();
        part.addProperty("text", prompt);
        parts.add(part);
        contents.add("parts", parts);

        JsonArray contentsArray = new JsonArray();
        contentsArray.add(contents);

        JsonObject requestBody = new JsonObject();
        requestBody.add("contents", contentsArray);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL + "?key=" + API_KEY))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(this::parseGeminiResponse);
    }

    private String parseGeminiResponse(String responseBody) {
        try {
            JsonObject root = JsonParser.parseString(responseBody).getAsJsonObject();
            JsonArray candidates = root.getAsJsonArray("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                JsonObject content = candidates.get(0).getAsJsonObject().getAsJsonObject("content");
                JsonArray parts = content.getAsJsonArray("parts");
                if (parts != null && !parts.isEmpty()) {
                    return parts.get(0).getAsJsonObject().get("text").getAsString();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Failed to parse response.";
    }
}
