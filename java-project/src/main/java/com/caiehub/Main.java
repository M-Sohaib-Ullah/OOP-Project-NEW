package com.caiehub;

import com.caiehub.ui.DashboardView;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("CAIE Past Paper Hub");
        
        DashboardView dashboard = new DashboardView();
        Scene scene = new Scene(dashboard.getView(), 1024, 768);
        
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        // Initialize Firebase here optionally if the credentials JSON is present
        // FirebaseService.initialize();
        
        launch(args);
    }
}
