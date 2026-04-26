package com.caiehub.ui;

import com.caiehub.services.GeminiService;
import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.application.Platform;

public class AiTutorView {

    private VBox root;
    private VBox chatArea;
    private TextField inputField;
    private GeminiService geminiService;

    public AiTutorView() {
        geminiService = new GeminiService();
        root = new VBox(20);
        root.setPadding(new Insets(30));
        root.setStyle("-fx-background-color: #ffffff;");
        
        Label header = new Label("AI Tutor");
        header.setFont(Font.font("System", FontWeight.BOLD, 28));

        chatArea = new VBox(15);
        chatArea.setPadding(new Insets(15));
        chatArea.setStyle("-fx-background-color: #f8fafc; -fx-border-color: #e2e8f0; -fx-border-radius: 8px;");
        
        ScrollPane scrollPane = new ScrollPane(chatArea);
        scrollPane.setFitToWidth(true);
        scrollPane.setVbarPolicy(ScrollPane.ScrollBarPolicy.AS_NEEDED);
        VBox.setVgrow(scrollPane, Priority.ALWAYS);

        HBox inputContainer = new HBox(10);
        inputField = new TextField();
        inputField.setPromptText("Ask me about any topic, concept, or past paper question...");
        inputField.setStyle("-fx-padding: 10px; -fx-font-size: 14px; -fx-background-radius: 8px; -fx-border-color: #cbd5e1; -fx-border-radius: 8px;");
        HBox.setHgrow(inputField, Priority.ALWAYS);
        
        Button sendBtn = new Button("Send");
        sendBtn.setStyle("-fx-background-color: #4f46e5; -fx-text-fill: white; -fx-padding: 10px 20px; -fx-font-size: 14px; -fx-font-weight: bold; -fx-background-radius: 8px;");
        
        sendBtn.setOnAction(e -> handleSend());
        inputField.setOnAction(e -> handleSend());

        inputContainer.getChildren().addAll(inputField, sendBtn);

        // Initial Greeting
        addMessage("Hello! I'm your CAIE AI Tutor. How can I help you study today?", false);

        root.getChildren().addAll(header, scrollPane, inputContainer);
    }

    private void handleSend() {
        String query = inputField.getText();
        if (query.trim().isEmpty()) return;

        addMessage(query, true);
        inputField.clear();

        Label loadingLabel = addMessage("Thinking...", false);

        // Simplistic tutor prompt call mapping to original geminiService behavior
        // In a real scenario, you'd maintain a chat history array
        // We'll reuse the gradeAnswer or a generic prompt for demonstration
        new Thread(() -> {
            try {
                // Since GeminiService doesn't have a plain chat method mapped exactly, we'll fake it or add one.
                // Assuming we add a `chat` method to GeminiService:
                // String response = geminiService.chat(query).get();
                String response = "AI Response to: " + query + "\n(Implement `geminiService.chat` for actual AI calls)";
                
                Platform.runLater(() -> {
                    chatArea.getChildren().remove(loadingLabel);
                    addMessage(response, false);
                });
            } catch (Exception e) {
                Platform.runLater(() -> {
                    chatArea.getChildren().remove(loadingLabel);
                    addMessage("Sorry, an error occurred.", false);
                });
            }
        }).start();
    }

    private Label addMessage(String text, boolean isUser) {
        Label msgLabel = new Label(text);
        msgLabel.setWrapText(true);
        msgLabel.setMaxWidth(600);
        msgLabel.setPadding(new Insets(10, 15, 10, 15));
        msgLabel.setFont(Font.font("System", 14));
        
        HBox container = new HBox();
        if (isUser) {
            msgLabel.setStyle("-fx-background-color: #4f46e5; -fx-text-fill: white; -fx-background-radius: 12px 12px 0 12px;");
            container.setStyle("-fx-alignment: center-right;");
        } else {
            msgLabel.setStyle("-fx-background-color: white; -fx-text-fill: #1e293b; -fx-border-color: #e2e8f0; -fx-border-radius: 12px 12px 12px 0; -fx-background-radius: 12px 12px 12px 0;");
            container.setStyle("-fx-alignment: center-left;");
        }
        
        container.getChildren().add(msgLabel);
        chatArea.getChildren().add(container);
        return msgLabel;
    }

    public VBox getView() {
        return root;
    }
}
