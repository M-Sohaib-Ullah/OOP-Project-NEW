package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.scene.layout.HBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

public class HistoryView {

    private VBox root;

    public HistoryView() {
        root = new VBox(20);
        root.setPadding(new Insets(30));
        root.setStyle("-fx-background-color: transparent;");
        
        Label header = new Label("Exam History");
        header.getStyleClass().add("header-text");

        Label desc = new Label("Review your past exam attempts and scores.");
        desc.getStyleClass().add("subtext");

        VBox historyList = new VBox(15);
        historyList.getChildren().addAll(
                createHistoryCard("AS Level Mathematics - P12", "Score: C (60%)", "Time Taken: 1h 15m", "May/June 2023", "#f59e0b"),
                createHistoryCard("IGCSE Computer Science - P21", "Score: A (85%)", "Time Taken: 1h 30m", "Feb/Mar 2024", "#10b981")
        );

        root.getChildren().addAll(header, desc, historyList);
    }

    private VBox createHistoryCard(String paperName, String score, String time, String date, String statusColor) {
        VBox card = new VBox(8);
        card.getStyleClass().add("card");

        HBox topArea = new HBox(10);
        Label titleLabel = new Label(paperName);
        titleLabel.setFont(Font.font("System", FontWeight.BOLD, 16));
        topArea.getChildren().add(titleLabel);

        HBox detailsArea = new HBox(20);
        Label scoreLabel = new Label(score);
        scoreLabel.setTextFill(javafx.scene.paint.Color.web(statusColor));
        scoreLabel.setFont(Font.font("System", FontWeight.SEMI_BOLD, 14));
        
        Label timeLabel = new Label(time);
        timeLabel.getStyleClass().add("subtext");
        
        Label dateLabel = new Label("Taken on " + date);
        dateLabel.getStyleClass().add("subtext");
        
        detailsArea.getChildren().addAll(scoreLabel, timeLabel, dateLabel);

        card.getChildren().addAll(topArea, detailsArea);
        return card;
    }

    public VBox getView() {
        return root;
    }
}
