# CAIE Past Paper Hub - JavaFX Version

This is a Java conversion of the frontend for the CAIE Past Paper Hub project, built with JavaFX.
It uses Maven for dependency management and build processes.

## Requirements
- Java 17 or higher
- Maven 3.6+

## Project Architecture
- `models/`: Contains the POJOs (Plain Old Java Objects) like `UserStats` and `PaperAttempt`.
- `services/`: Logic classes to interface with external APIs (like Gemini AI) and databases.
- `ui/`: JavaFX view classes (building the UI programmatically vs FXML for ease of debugging in this structure).

## How to Run it

1. Open a terminal in the `java-project` directory.
2. Run standard Maven commands:
   ```bash
   mvn clean compile
   mvn javafx:run
   ```

*Note: You need to set `YOUR_GEMINI_API_KEY` inside `GeminiService.java` for the grading/AI functionalities to work.*

### Converting from React to Java
The concepts mapped as follows:
- React Hooks (`useState`) -> JavaFX Properties and View updates.
- Tailwind CSS -> Inline `-fx-` styles or external `style.css`.
- Google Firestore JS Web SDK -> Firebase Admin Java SDK.
- Gemini REST API in browser -> Java `HttpClient` with standard Gson requests.
