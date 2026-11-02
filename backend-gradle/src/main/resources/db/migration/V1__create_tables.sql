CREATE TABLE columns (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL
);

CREATE TABLE cards (
    id VARCHAR(50) PRIMARY KEY,
    text TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'none',
    due DATE,
    column_id VARCHAR(50) NOT NULL REFERENCES columns(id)
);

INSERT INTO columns (id, title) VALUES
    ('todo', '未着手'),
    ('in-progress', '進行中'),
    ('done', '完了');
