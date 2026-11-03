# MT1-LABEXAM — Library Book Management Web Application

**Subject:** Full Stack Development – Node.js Lab Examination  
**Technologies:** Node.js, built-in HTTP module, FS module, Express.js  
**Database:** None. Book records are stored in JavaScript arrays.

## Project structure

```text
MT1-LABEXAM/
├── package.json
├── httpServer.js
├── expressApp.js
├── public/
│   └── index.html
└── screenshots/
```

## Setup

```bash
npm install
```

## Part A — Native Node.js HTTP server (port 3000)

```bash
npm run http
```

Open these routes in a browser:

- http://localhost:3000/
- http://localhost:3000/books
- http://localhost:3000/about
- http://localhost:3000/home

POST endpoint: `http://localhost:3000/add-book`  
Method: `POST`, header: `Content-Type: application/json`

Example JSON:

```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550
}
```

## Part B — Express REST API (port 4000)

Run in a second terminal:

```bash
npm run express
```

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/books` | Retrieve all books |
| GET | `/books/:id` | Retrieve one book |
| POST | `/books` | Add a book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

Base URL: `http://localhost:4000`

Example POST JSON:

```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "category": "Programming"
}
```

## EchoAPI testing sequence

1. GET `http://localhost:4000/books`
2. GET `http://localhost:4000/books/1`
3. POST `http://localhost:4000/books` with the JSON above.
4. PUT `http://localhost:4000/books/1` with JSON such as:
   `{"title":"The Alchemist - Revised","price":399}`
5. DELETE `http://localhost:4000/books/1`

For POST, expect status `201`. For a missing book, expect `404`.

## Screenshots to capture

Save genuine screenshots from your own running application/EchoAPI in this folder:

- `screenshots/http-server-running.png`
- `screenshots/http-routes.png`
- `screenshots/fs-home-page.png`
- `screenshots/echoapi-get-all.png`
- `screenshots/echoapi-get-by-id.png`
- `screenshots/echoapi-post.png`
- `screenshots/echoapi-put.png`
- `screenshots/echoapi-delete.png`
- `screenshots/github-commit-history.png`

Do not use sample or fabricated screenshots; capture the actual results on your machine.

## GitHub

Repository name required by the question paper: `MT1-LABEXAM`.

After each module, commit and push meaningful changes:

```bash
git add .
git commit -m "Complete Part A HTTP server and routing"
git push
```

Then after Part B:

```bash
git add .
git commit -m "Implement Express CRUD REST API"
git push
```
