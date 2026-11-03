import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350 },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 450 },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", price: 550 }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/") {
    return sendHtml(res, 200, `
      <!DOCTYPE html><html><head><title>Library Home</title></head>
      <body><h1>Welcome to Library Book Management</h1>
      <p>Node.js HTTP server is working.</p></body></html>`);
  }

  if (req.method === "GET" && url.pathname === "/books") {
    return sendJson(res, 200, books);
  }

  if (req.method === "POST" && url.pathname === "/add-book") {
    try {
      const book = await readRequestBody(req);
      const { id, title, author, price } = book;
      if (id === undefined || !title || !author || price === undefined ||
          !Number.isFinite(Number(price))) {
        return sendJson(res, 400, {
          message: "Required fields: id, title, author and numeric price"
        });
      }
      if (books.some(item => item.id === Number(id))) {
        return sendJson(res, 409, { message: "A book with this ID already exists" });
      }
      const newBook = { id: Number(id), title, author, price: Number(price) };
      books.push(newBook);
      return sendJson(res, 201, { message: "Book added successfully", book: newBook });
    } catch (error) {
      return sendJson(res, 400, { message: error.message });
    }
  }

  if (req.method === "GET" && url.pathname === "/about") {
    return sendHtml(res, 200,
      "<!DOCTYPE html><html><body><h1>About</h1><p>A Library Book Management application built with Node.js HTTP and FS modules.</p></body></html>");
  }

  if (req.method === "GET" && url.pathname === "/home") {
    const indexPath = path.join(__dirname, "public", "index.html");
    return fs.readFile(indexPath, "utf8", (error, content) => {
      if (error) {
        console.error("Unable to read index.html:", error);
        return sendHtml(res, 500, "<h1>500 - Unable to load the home page</h1>");
      }
      sendHtml(res, 200, content);
    });
  }

  return sendJson(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
