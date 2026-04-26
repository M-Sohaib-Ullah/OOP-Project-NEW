package com.caiehub.ui;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

public class MainAppLayout {

    private BorderPane root;
    private VBox mainContentArea;

    // Feature Views
    private DashboardContent dashboardContent;
    private AiTutorView aiTutorView;
    private StudyPlannerView studyPlannerView;
    private FlashcardsView flashcardsView;
    private LeaderboardView leaderboardView;
    private AnalyticsView analyticsView;
    private ExamInterfaceView examInterfaceView;

    public MainAppLayout() {
        root = new BorderPane();
        
        dashboardContent = new DashboardContent();
        aiTutorView = new AiTutorView();
        studyPlannerView = new StudyPlannerView();
        flashcardsView = new FlashcardsView();
        leaderboardView = new LeaderboardView();
        analyticsView = new AnalyticsView();
        examInterfaceView = new ExamInterfaceView();

        // Sidebar
        VBox sidebar = new VBox(15);
        sidebar.setPadding(new Insets(20));
        sidebar.setStyle("-fx-background-color: #f8fafc; -fx-border-color: #e2e8f0; -fx-border-width: 0 1 0 0;");
        
        Label brand = new Label("CAIE Hub");
        brand.setFont(Font.font("System", FontWeight.BOLD, 24));
        
        Button dashboardBtn = createSidebarButton("Dashboard");
        Button aiTutorBtn = createSidebarButton("AI Tutor");
        Button studyPlannerBtn = createSidebarButton("Study Planner");
        Button flashcardsBtn = createSidebarButton("Flashcards");
        Button analyticsBtn = createSidebarButton("Analytics");
        Button leaderboardBtn = createSidebarButton("Leaderboard");
        Button examInterfaceBtn = createSidebarButton("Exam Interface");

        dashboardBtn.setOnAction(e -> setContent(dashboardContent.getView()));
        aiTutorBtn.setOnAction(e -> setContent(aiTutorView.getView()));
        studyPlannerBtn.setOnAction(e -> setContent(studyPlannerView.getView()));
        flashcardsBtn.setOnAction(e -> setContent(flashcardsView.getView()));
        analyticsBtn.setOnAction(e -> setContent(analyticsView.getView()));
        leaderboardBtn.setOnAction(e -> setContent(leaderboardView.getView()));
        examInterfaceBtn.setOnAction(e -> setContent(examInterfaceView.getView()));

        sidebar.getChildren().addAll(brand, dashboardBtn, aiTutorBtn, studyPlannerBtn, flashcardsBtn, analyticsBtn, leaderboardBtn, examInterfaceBtn);
        sidebar.setPrefWidth(220);
        
        mainContentArea = new VBox();
        root.setLeft(sidebar);
        
        // Default View
        setContent(dashboardContent.getView());
    }
    
    private Button createSidebarButton(String text) {
        Button btn = new Button(text);
        btn.setStyle("-fx-background-color: transparent; -fx-text-fill: #475569; -fx-font-size: 14px; -fx-alignment: center-left; -fx-padding: 10 15; -fx-pref-width: 180;");
        btn.setOnMouseEntered(e -> btn.setStyle("-fx-background-color: #e2e8f0; -fx-text-fill: #0f172a; -fx-font-size: 14px; -fx-alignment: center-left; -fx-padding: 10 15; -fx-pref-width: 180; -fx-background-radius: 8px;"));
        btn.setOnMouseExited(e -> btn.setStyle("-fx-background-color: transparent; -fx-text-fill: #475569; -fx-font-size: 14px; -fx-alignment: center-left; -fx-padding: 10 15; -fx-pref-width: 180;"));
        return btn;
    }

    private void setContent(javafx.scene.Node node) {
        root.setCenter(node);
    }

    public BorderPane getView() {
        return root;
    }
}
