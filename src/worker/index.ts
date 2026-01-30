import { Hono } from "hono";
import { cors } from "hono/cors";
import Stripe from "stripe";
import { CreateAuthorSchema, CreateBookSchema, CreateLoanSchema } from "../shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// Authors endpoints
app.get("/api/authors", async (c) => {
  const db = c.env.DB;
  const authors = await db.prepare("SELECT * FROM authors ORDER BY name").all();
  return c.json(authors.results);
});

app.get("/api/authors/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const author = await db.prepare("SELECT * FROM authors WHERE id = ?").bind(id).first();
  
  if (!author) {
    return c.json({ error: "Autor no encontrado" }, 404);
  }
  
  return c.json(author);
});

app.post("/api/authors", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  
  const validation = CreateAuthorSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  
  const data = validation.data;
  
  const result = await db.prepare(
    "INSERT INTO authors (name, biography, nationality, birth_date) VALUES (?, ?, ?, ?)"
  ).bind(
    data.name,
    data.biography || null,
    data.nationality || null,
    data.birth_date || null
  ).run();
  
  const newAuthor = await db.prepare("SELECT * FROM authors WHERE id = ?")
    .bind(result.meta.last_row_id)
    .first();
  
  return c.json(newAuthor, 201);
});

app.put("/api/authors/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const body = await c.req.json();
  
  const validation = CreateAuthorSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  
  const data = validation.data;
  
  await db.prepare(
    "UPDATE authors SET name = ?, biography = ?, nationality = ?, birth_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(
    data.name,
    data.biography || null,
    data.nationality || null,
    data.birth_date || null,
    id
  ).run();
  
  const updatedAuthor = await db.prepare("SELECT * FROM authors WHERE id = ?").bind(id).first();
  
  return c.json(updatedAuthor);
});

app.delete("/api/authors/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  // Check if author has books
  const books = await db.prepare("SELECT COUNT(*) as count FROM books WHERE author_id = ?").bind(id).first();
  
  if (books && (books as any).count > 0) {
    return c.json({ error: "No se puede eliminar el autor porque tiene libros asociados" }, 400);
  }
  
  await db.prepare("DELETE FROM authors WHERE id = ?").bind(id).run();
  
  return c.json({ success: true });
});

// Books endpoints
app.get("/api/books", async (c) => {
  const db = c.env.DB;
  const search = c.req.query("search");
  
  let query = `
    SELECT books.*, authors.name as author_name 
    FROM books 
    JOIN authors ON books.author_id = authors.id
  `;
  
  if (search) {
    query += ` WHERE books.title LIKE ? OR books.isbn LIKE ? OR authors.name LIKE ?`;
    const searchParam = `%${search}%`;
    const books = await db.prepare(query + " ORDER BY books.title")
      .bind(searchParam, searchParam, searchParam)
      .all();
    return c.json(books.results);
  }
  
  const books = await db.prepare(query + " ORDER BY books.title").all();
  return c.json(books.results);
});

app.get("/api/books/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  const book = await db.prepare(`
    SELECT books.*, authors.name as author_name 
    FROM books 
    JOIN authors ON books.author_id = authors.id
    WHERE books.id = ?
  `).bind(id).first();
  
  if (!book) {
    return c.json({ error: "Libro no encontrado" }, 404);
  }
  
  return c.json(book);
});

app.post("/api/books", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  
  const validation = CreateBookSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  
  const data = validation.data;
  
  const result = await db.prepare(`
    INSERT INTO books (
      title, isbn, author_id, genre, publication_year, publisher, 
      pages, language, copies_total, copies_available, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.title,
    data.isbn || null,
    data.author_id,
    data.genre || null,
    data.publication_year || null,
    data.publisher || null,
    data.pages || null,
    data.language || 'Español',
    data.copies_total,
    data.copies_available,
    data.description || null
  ).run();
  
  const newBook = await db.prepare(`
    SELECT books.*, authors.name as author_name 
    FROM books 
    JOIN authors ON books.author_id = authors.id
    WHERE books.id = ?
  `).bind(result.meta.last_row_id).first();
  
  return c.json(newBook, 201);
});

app.put("/api/books/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const body = await c.req.json();
  
  const validation = CreateBookSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  
  const data = validation.data;
  
  await db.prepare(`
    UPDATE books SET 
      title = ?, isbn = ?, author_id = ?, genre = ?, publication_year = ?, 
      publisher = ?, pages = ?, language = ?, copies_total = ?, 
      copies_available = ?, description = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    data.title,
    data.isbn || null,
    data.author_id,
    data.genre || null,
    data.publication_year || null,
    data.publisher || null,
    data.pages || null,
    data.language || 'Español',
    data.copies_total,
    data.copies_available,
    data.description || null,
    id
  ).run();
  
  const updatedBook = await db.prepare(`
    SELECT books.*, authors.name as author_name 
    FROM books 
    JOIN authors ON books.author_id = authors.id
    WHERE books.id = ?
  `).bind(id).first();
  
  return c.json(updatedBook);
});

app.delete("/api/books/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  // Check if book has active loans
  const loans = await db.prepare(
    "SELECT COUNT(*) as count FROM loans WHERE book_id = ? AND is_returned = 0"
  ).bind(id).first();
  
  if (loans && (loans as any).count > 0) {
    return c.json({ error: "No se puede eliminar el libro porque tiene préstamos activos" }, 400);
  }
  
  await db.prepare("DELETE FROM books WHERE id = ?").bind(id).run();
  
  return c.json({ success: true });
});

// Library Users endpoints
app.get("/api/users", async (c) => {
  const db = c.env.DB;
  const search = c.req.query("search");
  
  let query = "SELECT * FROM library_users";
  
  if (search) {
    query += " WHERE name LIKE ? OR member_id LIKE ? OR email LIKE ?";
    const searchParam = `%${search}%`;
    const users = await db.prepare(query + " ORDER BY name")
      .bind(searchParam, searchParam, searchParam)
      .all();
    return c.json(users.results);
  }
  
  const users = await db.prepare(query + " ORDER BY name").all();
  return c.json(users.results);
});

app.get("/api/users/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const user = await db.prepare("SELECT * FROM library_users WHERE id = ?").bind(id).first();
  
  if (!user) {
    return c.json({ error: "Usuario no encontrado" }, 404);
  }
  
  return c.json(user);
});

app.post("/api/users", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  
  const CreateLibraryUserSchema = (await import("../shared/types")).CreateLibraryUserSchema;
  const validation = CreateLibraryUserSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  
  const data = validation.data;
  
  // Generate member_id
  const lastUser = await db.prepare(
    "SELECT member_id FROM library_users ORDER BY id DESC LIMIT 1"
  ).first();
  
  let nextId = 1;
  if (lastUser && (lastUser as any).member_id) {
    const lastId = parseInt((lastUser as any).member_id.substring(1));
    nextId = lastId + 1;
  }
  const memberId = `U${nextId.toString().padStart(3, '0')}`;
  
  const result = await db.prepare(`
    INSERT INTO library_users (member_id, name, email, phone, address, date_of_birth)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    memberId,
    data.name,
    data.email,
    data.phone || null,
    data.address || null,
    data.date_of_birth || null
  ).run();
  
  const newUser = await db.prepare("SELECT * FROM library_users WHERE id = ?")
    .bind(result.meta.last_row_id)
    .first();
  
  return c.json(newUser, 201);
});

app.put("/api/users/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const body = await c.req.json();
  
  const CreateLibraryUserSchema = (await import("../shared/types")).CreateLibraryUserSchema;
  const validation = CreateLibraryUserSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  
  const data = validation.data;
  
  await db.prepare(`
    UPDATE library_users SET 
      name = ?, email = ?, phone = ?, address = ?, date_of_birth = ?, 
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    data.name,
    data.email,
    data.phone || null,
    data.address || null,
    data.date_of_birth || null,
    id
  ).run();
  
  const updatedUser = await db.prepare("SELECT * FROM library_users WHERE id = ?").bind(id).first();
  
  return c.json(updatedUser);
});

app.delete("/api/users/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  // Check if user has active loans
  const loans = await db.prepare(
    "SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND is_returned = 0"
  ).bind(id).first();
  
  if (loans && (loans as any).count > 0) {
    return c.json({ error: "No se puede eliminar el usuario porque tiene préstamos activos" }, 400);
  }
  
  await db.prepare("DELETE FROM library_users WHERE id = ?").bind(id).run();
  
  return c.json({ success: true });
});

// Payment endpoints
app.post("/api/payments/create-checkout-session", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const { userId, amount, description } = body;
  
  if (!userId || !amount || amount <= 0) {
    return c.json({ error: "Datos de pago inválidos" }, 400);
  }
  
  const user = await db.prepare("SELECT * FROM library_users WHERE id = ?").bind(userId).first();
  
  if (!user) {
    return c.json({ error: "Usuario no encontrado" }, 404);
  }
  
  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
  
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "mxn",
          product_data: {
            name: description || "Pago de multa de biblioteca",
            description: `Usuario: ${(user as any).name} (${(user as any).member_id})`,
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    success_url: `${c.req.url.split('/api')[0]}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${c.req.url.split('/api')[0]}/users`,
    metadata: {
      userId: userId.toString(),
      amount: amount.toString(),
    },
    customer_email: (user as any).email,
  });
  
  // Record pending payment
  await db.prepare(`
    INSERT INTO payments (user_id, amount, stripe_session_id, description, status)
    VALUES (?, ?, ?, ?, 'pending')
  `).bind(userId, amount, session.id, description || "Pago de multa").run();
  
  return c.json({ url: session.url });
});

app.get("/api/payments/user/:userId", async (c) => {
  const db = c.env.DB;
  const userId = c.req.param("userId");
  
  const payments = await db.prepare(
    "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(userId).all();
  
  return c.json(payments.results);
});

// Loans endpoints
app.get("/api/loans", async (c) => {
  const db = c.env.DB;
  const search = c.req.query("search");
  const status = c.req.query("status"); // 'active', 'returned', 'overdue'
  
  let query = `
    SELECT loans.*, 
           books.title as book_title,
           library_users.name as user_name,
           library_users.member_id
    FROM loans
    JOIN books ON loans.book_id = books.id
    JOIN library_users ON loans.user_id = library_users.id
  `;
  
  const conditions: string[] = [];
  const params: any[] = [];
  
  if (status === 'active') {
    conditions.push('loans.is_returned = 0');
  } else if (status === 'returned') {
    conditions.push('loans.is_returned = 1');
  } else if (status === 'overdue') {
    conditions.push('loans.is_returned = 0 AND loans.due_date < date("now")');
  }
  
  if (search) {
    conditions.push('(books.title LIKE ? OR library_users.name LIKE ? OR library_users.member_id LIKE ?)');
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY loans.loan_date DESC';
  
  const loans = await db.prepare(query).bind(...params).all();
  return c.json(loans.results);
});

app.get("/api/loans/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  const loan = await db.prepare(`
    SELECT loans.*, 
           books.title as book_title,
           library_users.name as user_name,
           library_users.member_id
    FROM loans
    JOIN books ON loans.book_id = books.id
    JOIN library_users ON loans.user_id = library_users.id
    WHERE loans.id = ?
  `).bind(id).first();
  
  if (!loan) {
    return c.json({ error: "Préstamo no encontrado" }, 404);
  }
  
  return c.json(loan);
});

app.post("/api/loans", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  
  const validation = CreateLoanSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }
  
  const data = validation.data;
  
  // Check if book has available copies
  const book = await db.prepare("SELECT copies_available FROM books WHERE id = ?")
    .bind(data.book_id)
    .first();
  
  if (!book || (book as any).copies_available <= 0) {
    return c.json({ error: "No hay copias disponibles de este libro" }, 400);
  }
  
  // Check if user is active
  const user = await db.prepare("SELECT is_active FROM library_users WHERE id = ?")
    .bind(data.user_id)
    .first();
  
  if (!user || (user as any).is_active === 0) {
    return c.json({ error: "El usuario no está activo" }, 400);
  }
  
  // Create loan
  const result = await db.prepare(`
    INSERT INTO loans (book_id, user_id, due_date, notes)
    VALUES (?, ?, ?, ?)
  `).bind(
    data.book_id,
    data.user_id,
    data.due_date,
    data.notes || null
  ).run();
  
  // Decrease available copies
  await db.prepare(`
    UPDATE books 
    SET copies_available = copies_available - 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(data.book_id).run();
  
  const newLoan = await db.prepare(`
    SELECT loans.*, 
           books.title as book_title,
           library_users.name as user_name,
           library_users.member_id
    FROM loans
    JOIN books ON loans.book_id = books.id
    JOIN library_users ON loans.user_id = library_users.id
    WHERE loans.id = ?
  `).bind(result.meta.last_row_id).first();
  
  return c.json(newLoan, 201);
});

app.post("/api/loans/:id/return", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  const loan = await db.prepare("SELECT * FROM loans WHERE id = ?").bind(id).first();
  
  if (!loan) {
    return c.json({ error: "Préstamo no encontrado" }, 404);
  }
  
  if ((loan as any).is_returned === 1) {
    return c.json({ error: "Este préstamo ya fue devuelto" }, 400);
  }
  
  const returnDate = new Date().toISOString().split('T')[0];
  const dueDate = new Date((loan as any).due_date);
  const today = new Date();
  
  // Calculate late fee if overdue (e.g., $5 per day)
  let lateFee = 0;
  if (today > dueDate) {
    const daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    lateFee = daysLate * 5;
  }
  
  // Update loan
  await db.prepare(`
    UPDATE loans 
    SET is_returned = 1, 
        return_date = ?,
        late_fee = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(returnDate, lateFee, id).run();
  
  // Increase available copies
  await db.prepare(`
    UPDATE books 
    SET copies_available = copies_available + 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind((loan as any).book_id).run();
  
  // Add late fee to user's balance if applicable
  if (lateFee > 0) {
    await db.prepare(`
      UPDATE library_users 
      SET outstanding_balance = outstanding_balance + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(lateFee, (loan as any).user_id).run();
  }
  
  const updatedLoan = await db.prepare(`
    SELECT loans.*, 
           books.title as book_title,
           library_users.name as user_name,
           library_users.member_id
    FROM loans
    JOIN books ON loans.book_id = books.id
    JOIN library_users ON loans.user_id = library_users.id
    WHERE loans.id = ?
  `).bind(id).first();
  
  return c.json(updatedLoan);
});

app.delete("/api/loans/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  const loan = await db.prepare("SELECT * FROM loans WHERE id = ?").bind(id).first();
  
  if (!loan) {
    return c.json({ error: "Préstamo no encontrado" }, 404);
  }
  
  // Only allow deletion if loan was returned
  if ((loan as any).is_returned === 0) {
    return c.json({ error: "No se puede eliminar un préstamo activo. Devuelve el libro primero." }, 400);
  }
  
  await db.prepare("DELETE FROM loans WHERE id = ?").bind(id).run();
  
  return c.json({ success: true });
});

// Stripe webhook handler
app.post("/api/webhooks/stripe", async (c) => {
  const db = c.env.DB;
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature") || "";
  
  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      c.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return c.text("Invalid signature", 400);
  }
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const amount = parseFloat(session.metadata?.amount || "0");
    
    if (userId) {
      // Update payment record
      await db.prepare(`
        UPDATE payments 
        SET status = 'completed', 
            stripe_payment_intent = ?,
            paid_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE stripe_session_id = ?
      `).bind(session.payment_intent, session.id).run();
      
      // Reduce user's outstanding balance
      await db.prepare(`
        UPDATE library_users 
        SET outstanding_balance = outstanding_balance - ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(amount, parseInt(userId)).run();
    }
  }
  
  return c.text("ok", 200);
});

export default app;
