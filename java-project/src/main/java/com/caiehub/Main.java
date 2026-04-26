package com.caiehub;

import com.caiehub.ui.MainAppLayout;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("CAIE Past Paper Hub");
        
        MainAppLayout mainLayout = new MainAppLayout();
        Scene scene = new Scene(mainLayout.getView(), 1024, 768);
        
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
