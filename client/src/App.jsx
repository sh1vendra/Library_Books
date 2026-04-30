import { useState } from 'react';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import CheckoutForm from './components/CheckoutForm';
import AddBookForm from './components/AddBookForm';
import './App.css';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [checkoutBook, setCheckoutBook] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [globalFeedback, setGlobalFeedback] = useState('');

  const triggerRefresh = () => setRefresh(r => r + 1);

  const handleCheckoutDone = (msg) => {
    setCheckoutBook(null);
    setGlobalFeedback(msg);
    triggerRefresh();
  };

  const handleAddDone = (msg) => {
    setShowAddForm(false);
    setGlobalFeedback(msg);
    triggerRefresh();
  };

  const handleDelete = () => {
    setSelectedId(null);
    setGlobalFeedback('Book deleted.');
    triggerRefresh();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Library Books</h1>
          <span>CS3320 Capstone Project</span>
        </div>
        <button className="btn-add" onClick={() => setShowAddForm(true)}>
          + Add Book
        </button>
      </header>

      <main className="main-content">
        {globalFeedback && (
          <div className="global-feedback" onClick={() => setGlobalFeedback('')}>
            {globalFeedback}
          </div>
        )}

        <BookList
          onSelect={setSelectedId}
          onCheckIn={triggerRefresh}
          onCheckOut={setCheckoutBook}
          refresh={refresh}
        />
      </main>

      <footer className="app-footer">
        Library Books, MERN Stack Capstone
      </footer>

      {selectedId && (
        <BookDetail
          bookId={selectedId}
          onClose={() => setSelectedId(null)}
          onDelete={handleDelete}
        />
      )}

      {checkoutBook && (
        <CheckoutForm
          book={checkoutBook}
          onClose={() => setCheckoutBook(null)}
          onDone={handleCheckoutDone}
        />
      )}

      {showAddForm && (
        <AddBookForm
          onClose={() => setShowAddForm(false)}
          onDone={handleAddDone}
        />
      )}
    </div>
  );
}
