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
    private HistoryView historyView;
    private FocusTimerView focusTimerView;

    public MainAppLayout() {
        root = new BorderPane();
        
        dashboardContent = new DashboardContent();
        aiTutorView = new AiTutorView();
        studyPlannerView = new StudyPlannerView();
        flashcardsView = new FlashcardsView();
        leaderboardView = new LeaderboardView();
        analyticsView = new AnalyticsView();
        examInterfaceView = new ExamInterfaceView();
        historyView = new HistoryView();
        focusTimerView = new FocusTimerView();

        // Sidebar
        VBox sidebar = new VBox(10);
        sidebar.setPadding(new Insets(20));
        sidebar.getStyleClass().add("sidebar");
        
        Label brand = new Label("CAIE Hub");
        brand.setFont(Font.font("System", FontWeight.BOLD, 20));
        brand.setPadding(new Insets(0, 0, 20, 0));
        
        Button dashboardBtn = createSidebarButton("Past Papers");
        Button examInterfaceBtn = createSidebarButton("Exam Mode");
        Button studyPlannerBtn = createSidebarButton("Study Planner");
        Button aiTutorBtn = createSidebarButton("AI Tutor");
        Button flashcardsBtn = createSidebarButton("Flashcards");
        Button analyticsBtn = createSidebarButton("Analytics");
        Button focusTimerBtn = createSidebarButton("Focus Timer");
        Button historyBtn = createSidebarButton("History");
        Button leaderboardBtn = createSidebarButton("Leaderboard");

        dashboardBtn.setOnAction(e -> setContent(dashboardContent.getView()));
        aiTutorBtn.setOnAction(e -> setContent(aiTutorView.getView()));
        studyPlannerBtn.setOnAction(e -> setContent(studyPlannerView.getView()));
        flashcardsBtn.setOnAction(e -> setContent(flashcardsView.getView()));
        analyticsBtn.setOnAction(e -> setContent(analyticsView.getView()));
        leaderboardBtn.setOnAction(e -> setContent(leaderboardView.getView()));
        examInterfaceBtn.setOnAction(e -> setContent(examInterfaceView.getView()));
        focusTimerBtn.setOnAction(e -> setContent(focusTimerView.getView()));
        historyBtn.setOnAction(e -> setContent(historyView.getView()));

        sidebar.getChildren().addAll(
                brand, dashboardBtn, examInterfaceBtn, studyPlannerBtn, 
                aiTutorBtn, flashcardsBtn, analyticsBtn, 
                focusTimerBtn, historyBtn, leaderboardBtn
        );
        sidebar.setPrefWidth(240);
        
        mainContentArea = new VBox();
        root.setLeft(sidebar);
        
        // Default View
        setContent(dashboardContent.getView());
    }
    
    private Button createSidebarButton(String text) {
        Button btn = new Button(text);
        btn.getStyleClass().add("sidebar-button");
        btn.setPrefWidth(200);
        return btn;
    }

    private void setContent(javafx.scene.Node node) {
        root.setCenter(node);
    }

    public BorderPane getView() {
        return root;
    }
}
