/**
 * Tipos y Esquemas de Validación para el Sistema de Biblioteca
 * 
 * Este archivo contiene todas las definiciones de tipos TypeScript y esquemas
 * de validación Zod utilizados en la aplicación de gestión de biblioteca.
 * 
 * Estándares aplicados:
 * - Validación de datos con Zod para garantizar integridad
 * - Tipos TypeScript estrictos para seguridad de tipos
 * - Separación de esquemas de creación y lectura
 * - Mensajes de error en español para mejor experiencia de usuario
 */

import z from "zod";

// ============================================================================
// ESQUEMAS Y TIPOS DE AUTORES
// ============================================================================

/**
 * Esquema de validación para un autor completo (lectura de base de datos)
 * Incluye todos los campos incluyendo IDs y timestamps
 */
export const AuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
  biography: z.string().nullable(),
  nationality: z.string().nullable(),
  birth_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Esquema de validación para crear/actualizar un autor
 * Solo incluye campos editables por el usuario
 */
export const CreateAuthorSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  biography: z.string().optional(),
  nationality: z.string().optional(),
  birth_date: z.string().optional(),
});

/** Tipo TypeScript inferido del esquema de autor completo */
export type Author = z.infer<typeof AuthorSchema>;

/** Tipo TypeScript inferido del esquema de creación de autor */
export type CreateAuthor = z.infer<typeof CreateAuthorSchema>;

// ============================================================================
// ESQUEMAS Y TIPOS DE LIBROS
// ============================================================================

/**
 * Esquema de validación para un libro completo (lectura de base de datos)
 * Incluye todos los campos del libro incluyendo control de inventario
 */
export const BookSchema = z.object({
  id: z.number(),
  title: z.string(),
  isbn: z.string().nullable(),
  author_id: z.number(),
  genre: z.string().nullable(),
  publication_year: z.number().nullable(),
  publisher: z.string().nullable(),
  pages: z.number().nullable(),
  language: z.string().nullable(),
  copies_total: z.number(),
  copies_available: z.number(),
  description: z.string().nullable(),
  cover_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Esquema de validación para crear/actualizar un libro
 * Incluye validaciones de negocio como mínimo de copias
 */
export const CreateBookSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  isbn: z.string().optional(),
  author_id: z.number().min(1, "Debes seleccionar un autor"),
  genre: z.string().optional(),
  publication_year: z.number().optional(),
  publisher: z.string().optional(),
  pages: z.number().optional(),
  language: z.string().optional(),
  copies_total: z.number().min(1).default(1),
  copies_available: z.number().min(0).default(1),
  description: z.string().optional(),
});

/** Tipo TypeScript inferido del esquema de libro completo */
export type Book = z.infer<typeof BookSchema>;

/** Tipo TypeScript inferido del esquema de creación de libro */
export type CreateBook = z.infer<typeof CreateBookSchema>;

/**
 * Tipo extendido de libro que incluye el nombre del autor
 * Útil para mostrar información completa en la interfaz
 */
export type BookWithAuthor = Book & {
  author_name: string;
};

// ============================================================================
// ESQUEMAS Y TIPOS DE USUARIOS DE BIBLIOTECA
// ============================================================================

/**
 * Esquema de validación para un usuario de biblioteca completo
 * Incluye información de membresía, contacto y saldo pendiente
 */
export const LibraryUserSchema = z.object({
  id: z.number(),
  member_id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  date_of_birth: z.string().nullable(),
  registration_date: z.string(),
  is_active: z.number(), // SQLite almacena booleanos como 0/1
  outstanding_balance: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Esquema de validación para crear/actualizar un usuario
 * Valida formato de email y campos requeridos
 */
export const CreateLibraryUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
});

/** Tipo TypeScript inferido del esquema de usuario completo */
export type LibraryUser = z.infer<typeof LibraryUserSchema>;

/** Tipo TypeScript inferido del esquema de creación de usuario */
export type CreateLibraryUser = z.infer<typeof CreateLibraryUserSchema>;

// ============================================================================
// ESQUEMAS Y TIPOS DE PAGOS
// ============================================================================

/**
 * Esquema de validación para un pago
 * Incluye integración con Stripe y estados de pago
 */
export const PaymentSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  amount: z.number(),
  stripe_session_id: z.string().nullable(),
  stripe_payment_intent: z.string().nullable(),
  description: z.string().nullable(),
  status: z.string(), // pending, completed, failed
  paid_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

/** Tipo TypeScript inferido del esquema de pago */
export type Payment = z.infer<typeof PaymentSchema>;

// ============================================================================
// ESQUEMAS Y TIPOS DE PRÉSTAMOS
// ============================================================================

/**
 * Esquema de validación para un préstamo completo
 * Incluye fechas, estado de devolución y multas por retraso
 */
export const LoanSchema = z.object({
  id: z.number(),
  book_id: z.number(),
  user_id: z.number(),
  loan_date: z.string(),
  due_date: z.string(),
  return_date: z.string().nullable(),
  is_returned: z.number(), // SQLite almacena booleanos como 0/1
  is_overdue: z.number(), // SQLite almacena booleanos como 0/1
  late_fee: z.number(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Esquema de validación para crear un préstamo
 * Valida que se seleccionen libro y usuario, y se establezca fecha de devolución
 */
export const CreateLoanSchema = z.object({
  book_id: z.number().min(1, "Debes seleccionar un libro"),
  user_id: z.number().min(1, "Debes seleccionar un usuario"),
  due_date: z.string().min(1, "La fecha de devolución es requerida"),
  notes: z.string().optional(),
});

/** Tipo TypeScript inferido del esquema de préstamo completo */
export type Loan = z.infer<typeof LoanSchema>;

/** Tipo TypeScript inferido del esquema de creación de préstamo */
export type CreateLoan = z.infer<typeof CreateLoanSchema>;

/**
 * Tipo extendido de préstamo que incluye detalles del libro y usuario
 * Útil para mostrar información completa en listados
 */
export type LoanWithDetails = Loan & {
  book_title: string;
  user_name: string;
  member_id: string;
};
