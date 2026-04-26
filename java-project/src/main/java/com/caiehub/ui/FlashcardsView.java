package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

public class FlashcardsView {

    private VBox root;

    public FlashcardsView() {
        root = new VBox(20);
        root.setPadding(new Insets(30));
        root.setStyle("-fx-background-color: #ffffff;");
        
        Label header = new Label("Flashcards");
        header.setFont(Font.font("System", FontWeight.BOLD, 28));

        Button generateBtn = new Button("Generate New AI Deck");
        generateBtn.setStyle("-fx-background-color: #a855f7; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6;");

        GridPane grid = new GridPane();
        grid.setHgap(20);
        grid.setVgap(20);

        grid.add(createDeckCard("Physics Definitions", "15 Cards"), 0, 0);
        grid.add(createDeckCard("Math Formulas", "30 Cards"), 1, 0);
        grid.add(createDeckCard("CS Theory", "20 Cards"), 0, 1);

        root.getChildren().addAll(header, generateBtn, grid);
    }

    private VBox createDeckCard(String title, String subtitle) {
        VBox card = new VBox(10);
        card.setPadding(new Insets(20));
        card.setStyle("-fx-background-color: #f8fafc; -fx-border-color: #e2e8f0; -fx-border-radius: 8px; -fx-background-radius: 8px;");
        card.setPrefWidth(250);

        Label titleLabel = new Label(title);
        titleLabel.setFont(Font.font("System", FontWeight.BOLD, 18));
        
        Label subtitleLabel = new Label(subtitle);
        subtitleLabel.setTextFill(javafx.scene.paint.Color.web("#64748b"));
        
        Button reviewBtn = new Button("Review");
        reviewBtn.setStyle("-fx-background-color: #f3e8ff; -fx-text-fill: #9333ea; -fx-font-weight: bold;");

        card.getChildren().addAll(titleLabel, subtitleLabel, reviewBtn);
        return card;
    }

    public VBox getView() {
        return root;
    }
}
