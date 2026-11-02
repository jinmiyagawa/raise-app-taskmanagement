package com.raiseapp.taskmanagement.repository;

import com.raiseapp.taskmanagement.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, String> {
    long countByColumn_Id(String columnId);
    List<Card> findByColumn_IdOrderByPositionAsc(String columnId);
}
