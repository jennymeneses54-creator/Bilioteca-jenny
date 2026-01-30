
CREATE TABLE authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  biography TEXT,
  nationality TEXT,
  birth_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_authors_name ON authors(name);

INSERT INTO authors (name, biography, nationality, birth_date) VALUES
('Gabriel García Márquez', 'Premio Nobel de Literatura 1982, maestro del realismo mágico', 'Colombiano', '1927-03-06'),
('Isabel Allende', 'Una de las escritoras latinoamericanas más leídas del mundo', 'Chilena', '1942-08-02'),
('Jorge Luis Borges', 'Escritor argentino conocido por sus cuentos y ensayos', 'Argentino', '1899-08-24'),
('Pablo Neruda', 'Poeta chileno, Premio Nobel de Literatura 1971', 'Chileno', '1904-07-12'),
('Julio Cortázar', 'Escritor argentino, exponente del boom latinoamericano', 'Argentino', '1914-08-26'),
('Mario Vargas Llosa', 'Premio Nobel de Literatura 2010', 'Peruano', '1936-03-28'),
('Laura Esquivel', 'Escritora mexicana conocida por "Como agua para chocolate"', 'Mexicana', '1950-09-30'),
('Carlos Ruiz Zafón', 'Autor español de "La sombra del viento"', 'Español', '1964-09-25');
