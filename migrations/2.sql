
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  isbn TEXT UNIQUE,
  author_id INTEGER NOT NULL,
  genre TEXT,
  publication_year INTEGER,
  publisher TEXT,
  pages INTEGER,
  language TEXT DEFAULT 'Español',
  copies_total INTEGER DEFAULT 1,
  copies_available INTEGER DEFAULT 1,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author_id ON books(author_id);
CREATE INDEX idx_books_isbn ON books(isbn);

INSERT INTO books (title, isbn, author_id, genre, publication_year, publisher, pages, copies_total, copies_available, description) VALUES
('Cien años de soledad', '978-0307474728', 1, 'Realismo mágico', 1967, 'Editorial Sudamericana', 471, 5, 3, 'La obra maestra de García Márquez que narra la historia de la familia Buendía'),
('El amor en los tiempos del cólera', '978-0307387387', 1, 'Novela romántica', 1985, 'Editorial Sudamericana', 368, 3, 2, 'Una historia de amor que perdura a través de los años'),
('La casa de los espíritus', '978-8401242267', 2, 'Realismo mágico', 1982, 'Plaza & Janés', 433, 4, 4, 'La saga familiar de los Trueba a través de generaciones'),
('Ficciones', '978-0802130303', 3, 'Cuentos', 1944, 'Editorial Sur', 174, 3, 2, 'Colección de relatos fantásticos de Borges'),
('Veinte poemas de amor y una canción desesperada', '978-9568714031', 4, 'Poesía', 1924, 'Nascimento', 132, 6, 5, 'La obra poética más conocida de Neruda'),
('Rayuela', '978-8420471570', 5, 'Novela experimental', 1963, 'Editorial Sudamericana', 600, 2, 1, 'Una novela que puede leerse de múltiples formas'),
('La ciudad y los perros', '978-8420412146', 6, 'Novela', 1963, 'Seix Barral', 409, 3, 3, 'Una historia sobre cadetes en un colegio militar de Lima'),
('Como agua para chocolate', '978-0385721233', 7, 'Realismo mágico', 1989, 'Planeta', 245, 4, 3, 'Una historia de amor y cocina en la época de la Revolución Mexicana'),
('La sombra del viento', '978-8408163381', 8, 'Novela gótica', 2001, 'Planeta', 565, 5, 4, 'Un misterio literario en la Barcelona de posguerra');
