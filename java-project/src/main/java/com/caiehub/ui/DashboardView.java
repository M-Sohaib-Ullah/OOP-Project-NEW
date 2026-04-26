package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

public class DashboardView {

    private BorderPane root;

    public DashboardView() {
        root = new BorderPane();
        root.setPadding(new Insets(20));

        // Sidebar
        VBox sidebar = new VBox(15);
        sidebar.setPadding(new Insets(20));
        sidebar.setStyle("-fx-background-color: #f8fafc; -fx-border-color: #e2e8f0; -fx-border-width: 0 1 0 0;");
        
        Label brand = new Label("CAIE Hub");
        brand.setFont(Font.font("System", FontWeight.BOLD, 24));
        
        Button dashboardBtn = new Button("Dashboard");
        Button aiTutorBtn = new Button("AI Tutor");
        Button studyPlannerBtn = new Button("Study Planner");
        Button flashcardsBtn = new Button("Flashcards");
        Button leaderboardBtn = new Button("Leaderboard");

        String btnStyle = "-fx-background-color: transparent; -fx-text-fill: #475569; -fx-font-size: 14px; -fx-alignment: center-left;";
        dashboardBtn.setStyle(btnStyle + "-fx-font-weight: bold; -fx-text-fill: #4f46e5; -fx-background-color: #e0e7ff; -fx-background-radius: 8px;");
        aiTutorBtn.setStyle(btnStyle);
        studyPlannerBtn.setStyle(btnStyle);
        flashcardsBtn.setStyle(btnStyle);
        leaderboardBtn.setStyle(btnStyle);

        sidebar.getChildren().addAll(brand, dashboardBtn, aiTutorBtn, studyPlannerBtn, flashcardsBtn, leaderboardBtn);
        sidebar.setPrefWidth(250);
        
        // Main Content Area
        VBox mainContent = new VBox(20);
        mainContent.setPadding(new Insets(20));
        
        Label welcomeLabel = new Label("Welcome back, Scholar!");
        welcomeLabel.setFont(Font.font("System", FontWeight.BOLD, 28));

        HBox statsBox = new HBox(20);
        statsBox.getChildren().addAll(
                createStatCard("Total XP", "1,250", "#f59e0b"),
                createStatCard("Papers Completed", "12", "#10b981"),
                createStatCard("Study Streak", "5 Days", "#f97316")
        );

        Label recentActivityLabel = new Label("Recent Past Papers");
        recentActivityLabel.setFont(Font.font("System", FontWeight.BOLD, 18));
        
        VBox recentActivityList = new VBox(10);
        recentActivityList.getChildren().addAll(
                createActivityItem("As Level Mathematics - P12 (May/June 2023)"),
                createActivityItem("A Level Physics - P42 (Oct/Nov 2022)"),
                createActivityItem("IGCSE Computer Science - P21 (Feb/Mar 2024)")
        );

        mainContent.getChildren().addAll(welcomeLabel, statsBox, recentActivityLabel, recentActivityList);

        root.setLeft(sidebar);
        root.setCenter(mainContent);
    }

    private VBox createStatCard(String title, String value, String color) {
        VBox card = new VBox(10);
        card.setPadding(new Insets(20));
        card.setStyle("-fx-background-color: white; -fx-border-color: #e2e8f0; -fx-border-radius: 8px; -fx-background-radius: 8px;");
        card.setPrefWidth(200);

        Label titleLabel = new Label(title);
        titleLabel.setTextFill(javafx.scene.paint.Color.web("#64748b"));
        
        Label valueLabel = new Label(value);
        valueLabel.setFont(Font.font("System", FontWeight.BOLD, 24));
        valueLabel.setTextFill(javafx.scene.paint.Color.web(color));

        card.getChildren().addAll(titleLabel, valueLabel);
        return card;
    }

    private HBox createActivityItem(String name) {
        HBox item = new HBox(10);
        item.setPadding(new Insets(15));
        item.setStyle("-fx-background-color: white; -fx-border-color: #e2e8f0; -fx-border-radius: 8px; -fx-background-radius: 8px; -fx-alignment: center-left;");
        
        Label nameLabel = new Label(name);
        nameLabel.setFont(Font.font("System", 14));
        
        Button continueBtn = new Button("View");
        continueBtn.setStyle("-fx-background-color: #eff6ff; -fx-text-fill: #2563eb; -fx-border-radius: 4px;");
        
        HBox spacer = new HBox();
        javafx.scene.layout.HBox.setHgrow(spacer, javafx.scene.layout.Priority.ALWAYS);
        
        item.getChildren().addAll(nameLabel, spacer, continueBtn);
        return item;
    }

    public BorderPane getView() {
        return root;
    }
}
