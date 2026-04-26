package com.caiehub.models;

public class PaperAttempt {
    private String id;
    private String paperId;
    private String timestamp;
    private int userScore;
    private int totalMarks;

    public PaperAttempt(String id, String paperId, String timestamp, int userScore, int totalMarks) {
        this.id = id;
        this.paperId = paperId;
        this.timestamp = timestamp;
        this.userScore = userScore;
        this.totalMarks = totalMarks;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPaperId() { return paperId; }
    public void setPaperId(String paperId) { this.paperId = paperId; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public int getUserScore() { return userScore; }
    public void setUserScore(int userScore) { this.userScore = userScore; }
    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }
}
