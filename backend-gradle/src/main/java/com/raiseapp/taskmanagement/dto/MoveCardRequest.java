package com.raiseapp.taskmanagement.dto;

public class MoveCardRequest {
    private String targetColumnId;
    private String afterCardId;

    public String getTargetColumnId() { return targetColumnId; }
    public void setTargetColumnId(String targetColumnId) { this.targetColumnId = targetColumnId; }

    public String getAfterCardId() { return afterCardId; }
    public void setAfterCardId(String afterCardId) { this.afterCardId = afterCardId; }
}
