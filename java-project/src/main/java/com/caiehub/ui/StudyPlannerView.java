package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

public class StudyPlannerView {

    private VBox root;
    private VBox resultsArea;

    public StudyPlannerView() {
        root = new VBox(20);
        root.setPadding(new Insets(30));
        root.setStyle("-fx-background-color: transparent;");
        
        Label header = new Label("AI Study Planner");
        header.getStyleClass().add("header-text");

        Label desc = new Label("Generate a personalized study plan based on your goals and timeline.");
        desc.getStyleClass().add("subtext");

        HBox form = new HBox(15);
        form.setStyle("-fx-alignment: center-left;");
        
        TextField subjectInput = new TextField();
        subjectInput.setPromptText("Subject (A Level Physics)");
        subjectInput.getStyleClass().add("text-field");
        
        TextField goalInput = new TextField();
        goalInput.setPromptText("Goal (Cover Mechanics)");
        goalInput.getStyleClass().add("text-field");
        
        ComboBox<Integer> daysDropdown = new ComboBox<>();
        daysDropdown.getItems().addAll(1, 3, 5, 7, 14, 30);
        daysDropdown.setValue(7);
        daysDropdown.getStyleClass().add("text-field");

        Button generateBtn = new Button("Generate Plan");
        generateBtn.getStyleClass().add("btn-primary");
        
        form.getChildren().addAll(new Label("Topic:"), subjectInput, new Label("Goal:"), goalInput, new Label("Days:"), daysDropdown, generateBtn);

        resultsArea = new VBox(10);
        
        generateBtn.setOnAction(e -> {
            resultsArea.getChildren().clear();
            resultsArea.getChildren().add(new Label("Generating study plan for " + subjectInput.getText() + "..."));
            
            VBox planMockup = new VBox(10);
            planMockup.setPadding(new Insets(20));
            planMockup.getStyleClass().add("card");
            
            for(int i = 1; i <= daysDropdown.getValue(); i++) {
                Label dayLabel = new Label("Day " + i + ": Study Topic " + i);
                dayLabel.setFont(Font.font("System", FontWeight.SEMI_BOLD, 14));
                planMockup.getChildren().add(dayLabel);
            }
            
            resultsArea.getChildren().clear();
            resultsArea.getChildren().add(planMockup);
        });

        root.getChildren().addAll(header, desc, form, resultsArea);
    }

    public VBox getView() {
        return root;
    }
}
