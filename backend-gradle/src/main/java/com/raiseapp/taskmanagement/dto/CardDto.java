package com.raiseapp.taskmanagement.dto;

import java.time.LocalDate;

public class CardDto {
    private String id;
    private String text;
    private String priority;
    private LocalDate due;
    private String columnId;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getDue() { return due; }
    public void setDue(LocalDate due) { this.due = due; }

    public String getColumnId() { return columnId; }
    public void setColumnId(String columnId) { this.columnId = columnId; }
}
