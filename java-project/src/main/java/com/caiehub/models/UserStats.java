package com.caiehub.models;

public class UserStats {
    private String uid;
    private int streak;
    private String lastStudyDate;
    private int totalMinutesStudied;
    private int papersCompleted;
    private int xp;

    public UserStats() {
    }

    public UserStats(String uid, int streak, String lastStudyDate, int totalMinutesStudied, int papersCompleted, int xp) {
        this.uid = uid;
        this.streak = streak;
        this.lastStudyDate = lastStudyDate;
        this.totalMinutesStudied = totalMinutesStudied;
        this.papersCompleted = papersCompleted;
        this.xp = xp;
    }

    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public String getLastStudyDate() { return lastStudyDate; }
    public void setLastStudyDate(String lastStudyDate) { this.lastStudyDate = lastStudyDate; }

    public int getTotalMinutesStudied() { return totalMinutesStudied; }
    public void setTotalMinutesStudied(int totalMinutesStudied) { this.totalMinutesStudied = totalMinutesStudied; }

    public int getPapersCompleted() { return papersCompleted; }
    public void setPapersCompleted(int papersCompleted) { this.papersCompleted = papersCompleted; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }
}
