import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350, category: "Fiction" },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 450, category: "Self-help" },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", price: 550, category: "Programming" }
];

function validateBook(body, requireId = false) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "A JSON object is required";
  if (requireId && (body.id === undefined || !Number.isInteger(Number(body.id)))) return "A valid id is required";
  if (typeof body.title !== "string" || !body.title.trim()) return "A non-empty title is required";
  if (typeof body.author !== "string" || !body.author.trim()) return "A non-empty author is required";
  if (body.price === undefined || !Number.isFinite(Number(body.price)) || Number(body.price) < 0) {
    return "A valid non-negative price is required";
  }
  return null;
}

app.get("/books", (req, res) => {
  res.status(200).json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find(item => item.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.status(200).json(book);
});

app.post("/books", (req, res) => {
  const error = validateBook(req.body, true);
  if (error) return res.status(400).json({ message: error });

  const id = Number(req.body.id);
  if (books.some(item => item.id === id)) {
    return res.status(409).json({ message: "Book ID already exists" });
  }

  const newBook = {
    id,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    price: Number(req.body.price),
    category: typeof req.body.category === "string" && req.body.category.trim()
      ? req.body.category.trim() : "General"
  };
  books.push(newBook);
  res.status(201).json({ message: "Book added successfully", book: newBook });
});

app.put("/books/:id", (req, res) => {
  const book = books.find(item => item.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });

  const body = req.body || {};
  if (body.title !== undefined && (typeof body.title !== "string" || !body.title.trim())) {
    return res.status(400).json({ message: "Title must be a non-empty string" });
  }
  if (body.author !== undefined && (typeof body.author !== "string" || !body.author.trim())) {
    return res.status(400).json({ message: "Author must be a non-empty string" });
  }
  if (body.price !== undefined && (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)) {
    return res.status(400).json({ message: "Price must be a valid non-negative number" });
  }
  if (body.category !== undefined && typeof body.category !== "string") {
    return res.status(400).json({ message: "Category must be a string" });
  }

  if (body.title !== undefined) book.title = body.title.trim();
  if (body.author !== undefined) book.author = body.author.trim();
  if (body.price !== undefined) book.price = Number(body.price);
  if (body.category !== undefined) book.category = body.category.trim();

  res.status(200).json({ message: "Book updated successfully", book });
});

app.delete("/books/:id", (req, res) => {
  const index = books.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const [deletedBook] = books.splice(index, 1);
  res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
});

// Return a clear error for malformed JSON bodies.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  next(error);
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
