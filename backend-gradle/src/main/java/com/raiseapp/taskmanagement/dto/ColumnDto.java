package com.raiseapp.taskmanagement.dto;

import java.util.List;

public class ColumnDto {
    private String id;
    private String title;
    private List<CardDto> cards;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public List<CardDto> getCards() { return cards; }
    public void setCards(List<CardDto> cards) { this.cards = cards; }
}
