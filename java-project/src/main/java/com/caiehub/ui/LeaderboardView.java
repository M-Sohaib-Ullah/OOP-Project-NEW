package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.scene.control.Label;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

public class LeaderboardView {

    private VBox root;

    public LeaderboardView() {
        root = new VBox(20);
        root.setPadding(new Insets(30));
        root.setStyle("-fx-background-color: #ffffff;");
        
        Label header = new Label("Global Leaderboard");
        header.setFont(Font.font("System", FontWeight.BOLD, 28));

        Label desc = new Label("Compete with students worldwide. Earn points by completing past papers.");
        desc.setTextFill(javafx.scene.paint.Color.web("#64748b"));

        GridPane table = new GridPane();
        table.setHgap(30);
        table.setVgap(15);
        table.setStyle("-fx-background-color: #f8fafc; -fx-padding: 20px; -fx-border-color: #e2e8f0; -fx-border-radius: 8px;");

        // Headers
        Label rH = new Label("Rank"); rH.setFont(Font.font("System", FontWeight.BOLD, 14));
        Label nH = new Label("Student"); nH.setFont(Font.font("System", FontWeight.BOLD, 14));
        Label xpRH = new Label("XP Score"); xpRH.setFont(Font.font("System", FontWeight.BOLD, 14));

        table.add(rH, 0, 0);
        table.add(nH, 1, 0);
        table.add(xpRH, 2, 0);

        // Dummy Data
        addLeaderRow(table, 1, "Alice M.", "45,000", "#eab308");
        addLeaderRow(table, 2, "Bob S.", "42,100", "#94a3b8");
        addLeaderRow(table, 3, "Charlie D.", "39,500", "#b45309");
        addLeaderRow(table, 4, "You", "24,000", "#1e293b");

        root.getChildren().addAll(header, desc, table);
    }

    private void addLeaderRow(GridPane table, int rank, int index, String name, String score, String color) {
        // Just for rank number
    }
    
    private void addLeaderRow(GridPane table, int row, String name, String score, String color) {
        Label r = new Label(row == 4 ? "..." : String.valueOf(row));
        r.setFont(Font.font("System", FontWeight.BOLD, 14));
        r.setTextFill(javafx.scene.paint.Color.web(color));
        
        Label n = new Label(name);
        n.setFont(Font.font("System", 14));
        
        Label s = new Label(score);
        s.setFont(Font.font("System", FontWeight.BOLD, 14));
        
        table.add(r, 0, row);
        table.add(n, 1, row);
        table.add(s, 2, row);
    }

    public VBox getView() {
        return root;
    }
}
