package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.util.Duration;

public class FocusTimerView {

    private VBox root;
    private int timeSeconds = 25 * 60; // 25 mins
    private boolean isRunning = false;
    private Timeline timeline;
    private Label timerLabel;

    public FocusTimerView() {
        root = new VBox(30);
        root.setPadding(new Insets(40));
        root.setAlignment(Pos.CENTER);
        root.setStyle("-fx-background-color: transparent;");
        
        Label header = new Label("Focus Timer");
        header.getStyleClass().add("header-text");

        timerLabel = new Label("25:00");
        timerLabel.setFont(Font.font("System", FontWeight.BOLD, 72));
        timerLabel.setTextFill(javafx.scene.paint.Color.web("#0f172a"));

        HBox controls = new HBox(15);
        controls.setAlignment(Pos.CENTER);

        Button startBtn = new Button("Start");
        startBtn.getStyleClass().add("btn-primary");
        
        Button resetBtn = new Button("Reset");
        resetBtn.getStyleClass().add("btn-primary");
        resetBtn.setStyle("-fx-background-color: #ef4444;");
        
        Button shortBreakBtn = new Button("Short Break");
        shortBreakBtn.getStyleClass().add("btn-secondary");
        
        Button pomodoroBtn = new Button("Pomodoro");
        pomodoroBtn.getStyleClass().add("btn-secondary");

        timeline = new Timeline(new KeyFrame(Duration.seconds(1), e -> {
            timeSeconds--;
            updateTimerLabel();
            if (timeSeconds <= 0) {
                timeline.stop();
                isRunning = false;
                startBtn.setText("Start");
            }
        }));
        timeline.setCycleCount(Timeline.INDEFINITE);

        startBtn.setOnAction(e -> {
            if (isRunning) {
                timeline.pause();
                startBtn.setText("Resume");
            } else {
                timeline.play();
                startBtn.setText("Pause");
            }
            isRunning = !isRunning;
        });

        resetBtn.setOnAction(e -> {
            timeline.stop();
            isRunning = false;
            timeSeconds = 25 * 60;
            startBtn.setText("Start");
            updateTimerLabel();
        });

        shortBreakBtn.setOnAction(e -> {
            timeline.stop();
            isRunning = false;
            timeSeconds = 5 * 60;
            startBtn.setText("Start");
            updateTimerLabel();
        });

        pomodoroBtn.setOnAction(e -> {
            timeline.stop();
            isRunning = false;
            timeSeconds = 25 * 60;
            startBtn.setText("Start");
            updateTimerLabel();
        });

        controls.getChildren().addAll(startBtn, resetBtn);
        HBox times = new HBox(10, pomodoroBtn, shortBreakBtn);
        times.setAlignment(Pos.CENTER);

        VBox container = new VBox(20);
        container.setAlignment(Pos.CENTER);
        container.setMaxWidth(400);
        container.getStyleClass().add("card");

        container.getChildren().addAll(header, timerLabel, controls, times);

        root.getChildren().add(container);
    }

    private void updateTimerLabel() {
        int mins = timeSeconds / 60;
        int secs = timeSeconds % 60;
        timerLabel.setText(String.format("%02d:%02d", mins, secs));
    }

    public VBox getView() {
        return root;
    }
}
