package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.scene.control.Label;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

public class AnalyticsView {

    private VBox root;

    public AnalyticsView() {
        root = new VBox(20);
        root.setPadding(new Insets(30));
        root.setStyle("-fx-background-color: #ffffff;");
        
        Label header = new Label("Analytics & Progress");
        header.setFont(Font.font("System", FontWeight.BOLD, 28));

        GridPane statsGrid = new GridPane();
        statsGrid.setHgap(20);
        statsGrid.setVgap(20);

        statsGrid.add(createAnalyticCard("Total Study Time", "24 hours"), 0, 0);
        statsGrid.add(createAnalyticCard("Average Score", "85%"), 1, 0);
        statsGrid.add(createAnalyticCard("Papers Attempted", "12"), 0, 1);
        statsGrid.add(createAnalyticCard("Current Streak", "5 Days"), 1, 1);

        VBox chartMockup = new VBox(10);
        chartMockup.setPadding(new Insets(20));
        chartMockup.setStyle("-fx-background-color: #f8fafc; -fx-border-color: #e2e8f0; -fx-border-radius: 8px; -fx-alignment: center;");
        chartMockup.setPrefHeight(250);
        
        Label chartLabel = new Label("[Performance Progress Chart]");
        chartLabel.setTextFill(javafx.scene.paint.Color.web("#94a3b8"));
        chartLabel.setFont(Font.font("System", FontWeight.BOLD, 18));
        chartMockup.getChildren().add(chartLabel);

        root.getChildren().addAll(header, statsGrid, new Label("Performance Trend"), chartMockup);
    }

    private VBox createAnalyticCard(String title, String value) {
        VBox card = new VBox(10);
        card.setPadding(new Insets(20));
        card.setStyle("-fx-background-color: #f1f5f9; -fx-border-radius: 8px;");
        card.setPrefWidth(250);

        Label titleLabel = new Label(title);
        titleLabel.setTextFill(javafx.scene.paint.Color.web("#64748b"));
        
        Label valueLabel = new Label(value);
        valueLabel.setFont(Font.font("System", FontWeight.BOLD, 24));
        valueLabel.setTextFill(javafx.scene.paint.Color.web("#0f172a"));

        card.getChildren().addAll(titleLabel, valueLabel);
        return card;
    }

    public VBox getView() {
        return root;
    }
}
