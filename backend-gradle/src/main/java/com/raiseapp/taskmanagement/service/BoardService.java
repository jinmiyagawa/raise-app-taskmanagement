package com.raiseapp.taskmanagement.service;

import com.raiseapp.taskmanagement.dto.*;
import com.raiseapp.taskmanagement.entity.BoardColumn;
import com.raiseapp.taskmanagement.entity.Card;
import com.raiseapp.taskmanagement.repository.CardRepository;
import com.raiseapp.taskmanagement.repository.ColumnRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BoardService {

    private final ColumnRepository columnRepository;
    private final CardRepository cardRepository;

    public BoardService(ColumnRepository columnRepository, CardRepository cardRepository) {
        this.columnRepository = columnRepository;
        this.cardRepository = cardRepository;
    }

    @Transactional(readOnly = true)
    public List<ColumnDto> getAllColumns() {
        return columnRepository.findAll().stream()
                .map(this::toColumnDto)
                .toList();
    }

    public CardDto createCard(String columnId, CreateCardRequest req) {
        BoardColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new IllegalArgumentException("Column not found: " + columnId));

        int nextPosition = (int) cardRepository.countByColumn_Id(columnId);

        Card card = new Card();
        card.setId(UUID.randomUUID().toString());
        card.setText(req.getText());
        card.setColumn(column);
        card.setPosition(nextPosition);

        return toCardDto(cardRepository.save(card));
    }

    public void deleteCard(String cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found: " + cardId));
        String columnId = card.getColumn().getId();
        cardRepository.delete(card);
        cardRepository.flush();
        reorderCards(cardRepository.findByColumn_IdOrderByPositionAsc(columnId));
    }

    public CardDto updateCard(String cardId, UpdateCardRequest req) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found: " + cardId));

        if (req.getText() != null) card.setText(req.getText());
        if (req.getPriority() != null) card.setPriority(req.getPriority());
        if (req.getDue() != null) card.setDue(req.getDue());

        return toCardDto(cardRepository.save(card));
    }

    public CardDto moveCard(String cardId, MoveCardRequest req) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found: " + cardId));
        BoardColumn targetColumn = columnRepository.findById(req.getTargetColumnId())
                .orElseThrow(() -> new IllegalArgumentException("Column not found: " + req.getTargetColumnId()));

        // 元のカラムから除外してposition再採番
        List<Card> sourceCards = card.getColumn().getCards().stream()
                .filter(c -> !c.getId().equals(cardId)).toList();
        reorderCards(sourceCards);

        // ターゲットカラムに挿入
        card.setColumn(targetColumn);
        List<Card> targetCards = targetColumn.getCards().stream()
                .filter(c -> !c.getId().equals(cardId)).toList();

        int insertAt;
        if (req.getAfterCardId() == null) {
            insertAt = 0;
        } else {
            insertAt = -1;
            for (int i = 0; i < targetCards.size(); i++) {
                if (targetCards.get(i).getId().equals(req.getAfterCardId())) {
                    insertAt = i + 1;
                    break;
                }
            }
            if (insertAt == -1) insertAt = targetCards.size();
        }

        // insertAt以降のpositionをずらす
        for (int i = insertAt; i < targetCards.size(); i++) {
            targetCards.get(i).setPosition(i + 1);
            cardRepository.save(targetCards.get(i));
        }
        card.setPosition(insertAt);

        return toCardDto(cardRepository.save(card));
    }

    private void reorderCards(List<Card> cards) {
        for (int i = 0; i < cards.size(); i++) {
            cards.get(i).setPosition(i);
            cardRepository.save(cards.get(i));
        }
    }

    private ColumnDto toColumnDto(BoardColumn column) {
        ColumnDto dto = new ColumnDto();
        dto.setId(column.getId());
        dto.setTitle(column.getTitle());
        dto.setCards(column.getCards().stream().map(this::toCardDto).toList());
        return dto;
    }

    private CardDto toCardDto(Card card) {
        CardDto dto = new CardDto();
        dto.setId(card.getId());
        dto.setText(card.getText());
        dto.setPriority(card.getPriority());
        dto.setDue(card.getDue());
        dto.setColumnId(card.getColumn().getId());
        return dto;
    }
}
