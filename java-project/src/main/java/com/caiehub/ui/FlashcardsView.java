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
        root.setStyle("-fx-background-color: transparent;");
        
        Label header = new Label("Flashcards");
        header.getStyleClass().add("header-text");

        Button generateBtn = new Button("Generate New AI Deck");
        generateBtn.getStyleClass().add("btn-primary");

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
        card.getStyleClass().add("card");
        card.setPrefWidth(250);

        Label titleLabel = new Label(title);
        titleLabel.setFont(Font.font("System", FontWeight.BOLD, 18));
        
        Label subtitleLabel = new Label(subtitle);
        subtitleLabel.getStyleClass().add("subtext");
        
        Button reviewBtn = new Button("Review");
        reviewBtn.getStyleClass().add("btn-secondary");

        card.getChildren().addAll(titleLabel, subtitleLabel, reviewBtn);
        return card;
    }

    public VBox getView() {
        return root;
    }
}
