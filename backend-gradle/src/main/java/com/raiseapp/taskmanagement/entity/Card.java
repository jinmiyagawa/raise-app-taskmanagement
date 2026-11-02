package com.raiseapp.taskmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    private String id;

    @jakarta.persistence.Column(nullable = false)
    private String text;

    @jakarta.persistence.Column(nullable = false)
    private String priority = "none";

    private LocalDate due;

    @jakarta.persistence.Column(nullable = false)
    private int position = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id", nullable = false)
    private BoardColumn column;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getDue() { return due; }
    public void setDue(LocalDate due) { this.due = due; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public BoardColumn getColumn() { return column; }
    public void setColumn(BoardColumn column) { this.column = column; }
}
