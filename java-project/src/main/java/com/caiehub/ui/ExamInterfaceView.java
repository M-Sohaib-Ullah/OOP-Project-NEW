package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextArea;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

public class ExamInterfaceView {

    private VBox root;

    public ExamInterfaceView() {
        root = new VBox(20);
        root.setPadding(new Insets(30));
        root.setStyle("-fx-background-color: #ffffff;");
        
        Label header = new Label("Past Paper Assessment");
        header.setFont(Font.font("System", FontWeight.BOLD, 28));
        
        Label detailLabel = new Label("IGCSE Computer Science - Paper 21 - Feb/Mar 2024");
        detailLabel.setFont(Font.font("System", FontWeight.SEMI_BOLD, 18));
        detailLabel.setTextFill(javafx.scene.paint.Color.web("#475569"));

        HBox timerBox = new HBox(10);
        timerBox.setStyle("-fx-background-color: #fef2f2; -fx-padding: 10px; -fx-border-color: #fecaca; -fx-border-radius: 6px; -fx-alignment: center-left;");
        Label timerText = new Label("Time Remaining: 01:45:00");
        timerText.setFont(Font.font("System", FontWeight.BOLD, 16));
        timerText.setTextFill(javafx.scene.paint.Color.web("#ef4444"));
        timerBox.getChildren().add(timerText);

        ScrollPane pdfViewerMockup = new ScrollPane();
        pdfViewerMockup.setPrefHeight(400);
        pdfViewerMockup.setStyle("-fx-border-color: #cbd5e1; -fx-background-color: #f1f5f9;");
        Label pdfMockupLabel = new Label("[PDF Viewer Interface - Requires JavaFX WebView or PDF library]");
        pdfMockupLabel.setStyle("-fx-padding: 150px; -fx-alignment: center; -fx-text-fill: #94a3b8;");
        pdfViewerMockup.setContent(pdfMockupLabel);

        VBox gradingArea = new VBox(15);
        gradingArea.setPadding(new Insets(20));
        gradingArea.setStyle("-fx-background-color: #f8fafc; -fx-border-color: #e2e8f0; -fx-border-radius: 8px;");

        Label autoGradeLabel = new Label("AI Auto-Grading");
        autoGradeLabel.setFont(Font.font("System", FontWeight.BOLD, 16));

        TextArea qTextArea = new TextArea();
        qTextArea.setPromptText("Paste the question text here...");
        qTextArea.setPrefRowCount(2);

        TextArea ansTextArea = new TextArea();
        ansTextArea.setPromptText("Paste your answer text here...");
        ansTextArea.setPrefRowCount(4);

        Button gradeBtn = new Button("Grade Answer");
        gradeBtn.setStyle("-fx-background-color: #4f46e5; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6;");

        gradingArea.getChildren().addAll(autoGradeLabel, new Label("Question:"), qTextArea, new Label("Your Answer:"), ansTextArea, gradeBtn);

        Button submitBtn = new Button("Submit Exam");
        submitBtn.setStyle("-fx-background-color: #10b981; -fx-text-fill: white; -fx-font-weight: bold; -fx-font-size: 16px; -fx-padding: 10 20; -fx-background-radius: 8;");

        root.getChildren().addAll(header, detailLabel, timerBox, pdfViewerMockup, gradingArea, submitBtn);
    }

    public VBox getView() {
        return root;
    }
}
