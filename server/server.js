const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 4000;
const MONGO_URI = 'mongodb+srv://shivendraus121_db_user:0wgyajjTknCtNBGd@cluster-library1.hrxnagd.mongodb.net/capstonelibrarydb?retryWrites=true&w=majority&appName=Cluster-Library1';

app.use(cors());
app.use(express.json());

const bookSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  author:    { type: String, required: true },
  publisher: { type: String, required: true },
  isbn:      { type: String, required: true },
  avail:     { type: Boolean, default: true },
  who:       { type: String, default: '' },
  due:       { type: String, default: '' }
});

const Book = mongoose.model('Book', bookSchema);

const seedBooks = [
  { title: 'Reactions in REACT',   author: 'Ben Dover',   publisher: 'Random House',   isbn: '978-3-16-148410-0', avail: true,  who: '',    due: '' },
  { title: 'Express-sions',        author: 'Frieda Livery', publisher: 'Chaotic House', isbn: '978-3-16-148410-2', avail: true,  who: '',    due: '' },
  { title: 'Restful REST',         author: 'Al Gorithm',  publisher: 'ACM',            isbn: '978-3-16-143310-1', avail: true,  who: '',    due: '' },
  { title: 'See Essess',           author: 'Anna Log',    publisher: 'O Reilly',       isbn: '987-6-54-148220-1', avail: false, who: 'Homer', due: '1/1/23' },
  { title: 'Scripting in JS',      author: 'Dee Gital',   publisher: 'IEEE',           isbn: '987-6-54-321123-1', avail: false, who: 'Marge', due: '1/2/23' },
  { title: 'Be An HTML Hero',      author: 'Jen Neric',   publisher: 'Coders-R-Us',   isbn: '987-6-54-321123-2', avail: false, who: 'Lisa',  due: '1/3/23' },
  { title: 'Node Your Way',        author: 'Bill Ding',   publisher: 'Tech Press',     isbn: '978-1-23-456789-0', avail: true,  who: '',    due: '' },
  { title: 'Mongo Madness',        author: 'Clara Fied',  publisher: 'DB Books',       isbn: '978-1-23-456789-1', avail: true,  who: '',    due: '' },
  { title: 'The Art of APIs',      author: 'Drew Coder',  publisher: 'Dev House',      isbn: '978-1-23-456789-2', avail: true,  who: '',    due: '' },
  { title: 'Full Stack Fever',     author: 'Pat Tern',    publisher: 'Code Academy',   isbn: '978-1-23-456789-3', avail: false, who: 'Bart', due: '2/1/23' }
];

async function seedIfEmpty() {
  const count = await Book.countDocuments();
  if (count === 0) {
    await Book.insertMany(seedBooks);
    console.log('Seeded 10 books into capstonelibrarydb');
  }
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas, capstonelibrarydb');
    return seedIfEmpty();
  })
  .then(() => {
    app.listen(PORT, () => console.log('Server running on port ' + PORT));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find({}, '_id title');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/books/available', async (req, res) => {
  try {
    const books = await Book.find({ avail: true });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/books/checked-out', async (req, res) => {
  try {
    const books = await Book.find({ avail: false });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/books/checkout/:id', async (req, res) => {
  try {
    const { who, due } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { avail: false, who, due },
      { new: true }
    );
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/books/checkin/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { avail: true, who: '', due: '' },
      { new: true }
    );
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
