package com.examsphere.model;

public class ExamQuestion {

    private int examQuestionId;
    private int examId;
    private int questionId;
    private int questionOrder;
    private int marks;

    // ==============================
    // CONSTRUCTORS
    // ==============================

    public ExamQuestion() {
    }

    public ExamQuestion(
            int examId,
            int questionId,
            int questionOrder,
            int marks) {

        this.examId = examId;
        this.questionId = questionId;
        this.questionOrder = questionOrder;
        this.marks = marks;
    }

    // ==============================
    // GETTERS
    // ==============================

    public int getExamQuestionId() {
        return examQuestionId;
    }

    public int getExamId() {
        return examId;
    }

    public int getQuestionId() {
        return questionId;
    }

    public int getQuestionOrder() {
        return questionOrder;
    }

    public int getMarks() {
        return marks;
    }

    // ==============================
    // SETTERS
    // ==============================

    public void setExamQuestionId(int examQuestionId) {
        this.examQuestionId = examQuestionId;
    }

    public void setExamId(int examId) {
        this.examId = examId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public void setQuestionOrder(int questionOrder) {
        this.questionOrder = questionOrder;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }
}