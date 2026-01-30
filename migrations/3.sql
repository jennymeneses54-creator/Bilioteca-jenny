
CREATE TABLE library_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  registration_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT 1,
  outstanding_balance REAL DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_library_users_member_id ON library_users(member_id);
CREATE INDEX idx_library_users_email ON library_users(email);

INSERT INTO library_users (member_id, name, email, phone, address, date_of_birth, registration_date) VALUES
('U001', 'María González', 'maria.gonzalez@email.com', '+52-555-1234', 'Calle Principal 123', '1990-05-15', '2023-01-15'),
('U002', 'Juan Pérez', 'juan.perez@email.com', '+52-555-2345', 'Avenida Central 456', '1985-08-22', '2023-02-20'),
('U003', 'Ana Martínez', 'ana.martinez@email.com', '+52-555-3456', 'Boulevard Norte 789', '1992-11-30', '2023-03-10'),
('U004', 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '+52-555-4567', 'Calle Sur 321', '1988-03-18', '2023-04-05'),
('U005', 'Laura Sánchez', 'laura.sanchez@email.com', '+52-555-5678', 'Avenida Este 654', '1995-07-25', '2023-05-12'),
('U006', 'Pedro Ramírez', 'pedro.ramirez@email.com', '+52-555-6789', 'Calle Oeste 987', '1983-12-08', '2023-06-18'),
('U007', 'Sofia López', 'sofia.lopez@email.com', '+52-555-7890', 'Boulevard Centro 147', '1998-02-14', '2023-07-22'),
('U008', 'Miguel Torres', 'miguel.torres@email.com', '+52-555-8901', 'Avenida Libertad 258', '1991-09-03', '2023-08-30');
