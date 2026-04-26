package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.paint.Color;
import javafx.scene.control.ScrollPane;

public class DashboardContent {

    private ScrollPane scrollPane;
    private VBox root;

    public DashboardContent() {
        root = new VBox(25);
        root.setPadding(new Insets(40));
        root.setStyle("-fx-background-color: transparent;");
        
        Label welcomeLabel = new Label("Welcome back, Scholar!");
        welcomeLabel.getStyleClass().add("header-text");

        HBox statsBox = new HBox(20);
        statsBox.getChildren().addAll(
                createStatCard("Total XP", "1,250", "#10b981"),
                createStatCard("Papers Completed", "12", "#3b82f6"),
                createStatCard("Study Streak", "5 Days", "#f59e0b"),
                createStatCard("Avg Score", "85%", "#8b5cf6")
        );

        Label recentActivityLabel = new Label("Recent Past Papers");
        recentActivityLabel.setFont(Font.font("System", FontWeight.BOLD, 20));
        
        VBox recentActivityList = new VBox(15);
        recentActivityList.getChildren().addAll(
                createActivityItem("As Level Mathematics - P12 (May/June 2023)", "Incomplete", "#f59e0b"),
                createActivityItem("A Level Physics - P42 (Oct/Nov 2022)", "Completed", "#10b981"),
                createActivityItem("IGCSE Computer Science - P21 (Feb/Mar 2024)", "Not Started", "#3b82f6")
        );

        root.getChildren().addAll(welcomeLabel, statsBox, recentActivityLabel, recentActivityList);
        
        scrollPane = new ScrollPane(root);
        scrollPane.setFitToWidth(true);
        scrollPane.getStyleClass().add("scroll-pane");
    }

    private VBox createStatCard(String title, String value, String colorHex) {
        VBox card = new VBox(5);
        card.getStyleClass().add("card");
        card.setPrefWidth(220);

        Label titleLabel = new Label(title);
        titleLabel.getStyleClass().add("subtext");
        
        Label valueLabel = new Label(value);
        valueLabel.setFont(Font.font("System", FontWeight.BOLD, 32));
        valueLabel.setTextFill(Color.web(colorHex));

        card.getChildren().addAll(titleLabel, valueLabel);
        return card;
    }

    private HBox createActivityItem(String name, String statusText, String statusColor) {
        HBox item = new HBox(15);
        item.getStyleClass().add("card");
        item.setStyle("-fx-alignment: center-left; -fx-padding: 20px;");
        
        VBox texts = new VBox(5);
        Label nameLabel = new Label(name);
        nameLabel.setFont(Font.font("System", FontWeight.SEMI_BOLD, 16));
        
        Label statusLabel = new Label(statusText);
        statusLabel.setTextFill(Color.web(statusColor));
        statusLabel.setFont(Font.font("System", FontWeight.BOLD, 12));
        texts.getChildren().addAll(nameLabel, statusLabel);
        
        HBox spacer = new HBox();
        javafx.scene.layout.HBox.setHgrow(spacer, javafx.scene.layout.Priority.ALWAYS);

        Button continueBtn = new Button("View/Solve");
        continueBtn.getStyleClass().add("btn-secondary");
        
        item.getChildren().addAll(texts, spacer, continueBtn);
        return item;
    }

    public ScrollPane getView() {
        return scrollPane;
    }
}
