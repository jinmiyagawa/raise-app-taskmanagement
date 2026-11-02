package com.raiseapp.taskmanagement.repository;

import com.raiseapp.taskmanagement.entity.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColumnRepository extends JpaRepository<BoardColumn, String> {
}
