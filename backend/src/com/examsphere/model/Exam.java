package com.examsphere.model;

import java.sql.Date;
import java.sql.Time;

public class Exam {

    private int examId;
    private String examCode;
    private String examTitle;
    private int subjectId;
    private int durationMinutes;
    private int totalMarks;
    private int passingMarks;
    private Date examDate;
    private Time examTime;
    private String status;

    public Exam() {
    }

    public Exam(int examId, String examCode, String examTitle,
                int subjectId, int durationMinutes,
                int totalMarks, int passingMarks,
                Date examDate, Time examTime,
                String status) {

        this.examId = examId;
        this.examCode = examCode;
        this.examTitle = examTitle;
        this.subjectId = subjectId;
        this.durationMinutes = durationMinutes;
        this.totalMarks = totalMarks;
        this.passingMarks = passingMarks;
        this.examDate = examDate;
        this.examTime = examTime;
        this.status = status;
    }

    public int getExamId() {
        return examId;
    }

    public void setExamId(int examId) {
        this.examId = examId;
    }

    public String getExamCode() {
        return examCode;
    }

    public void setExamCode(String examCode) {
        this.examCode = examCode;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public int getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }

    public int getPassingMarks() {
        return passingMarks;
    }

    public void setPassingMarks(int passingMarks) {
        this.passingMarks = passingMarks;
    }

    public Date getExamDate() {
        return examDate;
    }

    public void setExamDate(Date examDate) {
        this.examDate = examDate;
    }

    public Time getExamTime() {
        return examTime;
    }

    public void setExamTime(Time examTime) {
        this.examTime = examTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}