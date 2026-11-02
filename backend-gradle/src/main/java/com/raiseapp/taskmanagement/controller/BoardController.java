package com.raiseapp.taskmanagement.controller;

import com.raiseapp.taskmanagement.dto.*;
import com.raiseapp.taskmanagement.service.BoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/columns")
    public List<ColumnDto> getColumns() {
        return boardService.getAllColumns();
    }

    @PostMapping("/columns/{columnId}/cards")
    public CardDto createCard(@PathVariable String columnId, @RequestBody CreateCardRequest req) {
        return boardService.createCard(columnId, req);
    }

    @DeleteMapping("/cards/{cardId}")
    public ResponseEntity<Void> deleteCard(@PathVariable String cardId) {
        boardService.deleteCard(cardId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/cards/{cardId}")
    public CardDto updateCard(@PathVariable String cardId, @RequestBody UpdateCardRequest req) {
        return boardService.updateCard(cardId, req);
    }

    @PostMapping("/cards/{cardId}/move")
    public CardDto moveCard(@PathVariable String cardId, @RequestBody MoveCardRequest req) {
        return boardService.moveCard(cardId, req);
    }
}
