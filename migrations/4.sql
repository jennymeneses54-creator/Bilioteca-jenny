
CREATE TABLE loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  is_returned BOOLEAN DEFAULT 0,
  is_overdue BOOLEAN DEFAULT 0,
  late_fee REAL DEFAULT 0.0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loans_book_id ON loans(book_id);
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_is_returned ON loans(is_returned);
CREATE INDEX idx_loans_due_date ON loans(due_date);

INSERT INTO loans (book_id, user_id, loan_date, due_date, is_returned, return_date) VALUES
(1, 1, '2024-01-15', '2024-02-15', 1, '2024-02-10'),
(2, 2, '2024-01-20', '2024-02-20', 0, NULL),
(4, 3, '2024-01-25', '2024-02-25', 0, NULL),
(5, 1, '2024-02-01', '2024-03-01', 1, '2024-02-28'),
(6, 4, '2024-02-05', '2024-03-05', 0, NULL),
(8, 5, '2024-02-10', '2024-03-10', 0, NULL),
(3, 6, '2024-02-12', '2024-03-12', 0, NULL),
(1, 7, '2024-02-15', '2024-03-15', 0, NULL),
(9, 2, '2024-01-10', '2024-02-10', 0, NULL),
(7, 8, '2024-02-18', '2024-03-18', 0, NULL);
