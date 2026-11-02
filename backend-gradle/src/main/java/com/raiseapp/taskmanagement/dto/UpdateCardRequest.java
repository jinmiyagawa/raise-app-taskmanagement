package com.raiseapp.taskmanagement.dto;

import java.time.LocalDate;

public class UpdateCardRequest {
    private String text;
    private String priority;
    private LocalDate due;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getDue() { return due; }
    public void setDue(LocalDate due) { this.due = due; }
}
