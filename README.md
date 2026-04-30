# Library Books

A full-stack MERN application for tracking library books. Built as a CS3320 Capstone Project.

## Features

- View all available books
- View all checked-out books
- Check out a book to a borrower with a due date
- Check in a returned book
- Add new books to the collection
- Delete books from the collection

## Tech Stack

- MongoDB Atlas, database storage
- Express.js, REST API server
- React, frontend UI via Vite
- Node.js, runtime environment

## Getting Started

### Backend

```bash
cd server
npm install
node server.js
```

Server runs on port 4000.

### Frontend

```bash
cd client
npm install
npm run dev
```

Client runs on port 5173 by default.

## API Routes

- GET /books, returns all books with id and title
- GET /books/available, returns available books
- GET /books/checked-out, returns checked-out books
- GET /books/:id, returns full book details
- POST /books, add a new book
- PUT /books/checkout/:id, check out a book
- PUT /books/checkin/:id, check in a book
- DELETE /books/:id, delete a book
