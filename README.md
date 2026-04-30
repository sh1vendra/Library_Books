# Library Books - MERN Capstone Project

CS3320 Internet Software Development, Spring 2026

---

## Project Overview

A full-stack library management system built with MongoDB, Express, React, and Node.js. The application allows library staff to manage the book catalog, track availability, check books out to borrowers with due dates, check them back in, and maintain the full collection through a clean, professional web interface.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) |
| Backend | Express.js, Node.js |
| Database | MongoDB Atlas (cloud hosted) |
| ODM | Mongoose |
| Styling | Plain CSS (no frameworks) |

---

## Features

- View all available books in a sortable table
- View all checked-out books with borrower name and due date
- Check out a book by entering borrower name and due date
- Check in a returned book, clearing borrower info
- Add a new book to the catalog with all required fields
- Delete a book from the catalog
- View full book details in a modal overlay
- Status badges showing Available or Checked Out
- Pre-seeded with 10 books on first run

---

## How to Run Locally

### Prerequisites

- Node.js installed (v18 or higher recommended)
- Internet connection (MongoDB Atlas is cloud hosted, no local database setup needed)

### Backend

```bash
cd server
npm install
node server.js
```

Server runs on http://localhost:4000

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on http://localhost:5173

Open http://localhost:5173 in a browser after both servers are running.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | /books | Returns all books (id and title only) |
| GET | /books/available | Returns all available books with full details |
| GET | /books/checked-out | Returns all checked-out books with full details |
| GET | /books/:id | Returns full details for a single book |
| POST | /books | Adds a new book to the catalog |
| PUT | /books/checkout/:id | Checks out a book, expects JSON body with who and due fields |
| PUT | /books/checkin/:id | Checks in a book, clears borrower and due date |
| DELETE | /books/:id | Deletes a book from the catalog |

All responses use JSON. All request bodies use JSON.

---

## Database

MongoDB Atlas cloud database, cluster hosted at cluster0.oshybwt.mongodb.net. Database name: capstonelibrarydb.

The collection is pre-seeded with 10 books on first run if the collection is empty. Data persists across server restarts.

Book schema fields: title, author, publisher, isbn, avail (Boolean), who (borrower name), due (due date).

---

## Notes for Grader

- The MongoDB Atlas connection string is hardcoded in server/server.js for ease of grading. No .env file is needed to run this project.
- The database is live and accessible. Data persists across runs.
- Both the backend and frontend must be running simultaneously for the app to work.
- The backend must be started before opening the frontend in a browser.
