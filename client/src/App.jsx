import { useState } from 'react';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import CheckoutForm from './components/CheckoutForm';
import AddBookForm from './components/AddBookForm';
import './App.css';

const VIEWS = {
  DASHBOARD:   'dashboard',
  AVAILABLE:   'available',
  CHECKED_OUT: 'checked-out',
  ADD_BOOK:    'add-book',
};

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

export default function App() {
  const [view, setView]               = useState(VIEWS.AVAILABLE);
  const [selectedId, setSelectedId]   = useState(null);
  const [checkoutBook, setCheckoutBook] = useState(null);
  const [refresh, setRefresh]         = useState(0);
  const [globalFeedback, setGlobalFeedback] = useState('');

  const triggerRefresh = () => setRefresh(r => r + 1);

  const handleCheckoutDone = (msg) => {
    setCheckoutBook(null);
    setGlobalFeedback(msg);
    triggerRefresh();
  };

  const handleAddDone = (msg) => {
    setView(VIEWS.AVAILABLE);
    setGlobalFeedback(msg);
    triggerRefresh();
  };

  const handleDelete = () => {
    setSelectedId(null);
    setGlobalFeedback('The book record has been permanently removed.');
    triggerRefresh();
  };

  const navItems = [
    { id: VIEWS.AVAILABLE,   label: 'Available Books',    icon: 'o' },
    { id: VIEWS.CHECKED_OUT, label: 'Checked Out Books',  icon: 'x' },
  ];

  const pageHeadings = {
    [VIEWS.AVAILABLE]:   { title: 'Available Books',       desc: 'Books currently available for checkout.' },
    [VIEWS.CHECKED_OUT]: { title: 'Checked Out Books',     desc: 'Books currently on loan to borrowers.' },
    [VIEWS.ADD_BOOK]:    { title: 'Add New Book',          desc: 'Enter the details of a new book to add to the collection.' },
  };

  const heading = pageHeadings[view];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-icon" role="img" aria-label="library">
            &#128218;
          </span>
          <div className="header-title">
            <h1>City Library Management System</h1>
            <div className="subtitle">Collection and Circulation Module</div>
          </div>
        </div>
        <div className="header-date">{formatDate()}</div>
      </header>

      <div className="app-body">
        <nav className="sidebar">
          <div className="sidebar-section-label">Navigation</div>
          <ul className="sidebar-nav">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  className={view === item.id ? 'active' : ''}
                  onClick={() => setView(item.id)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <hr className="sidebar-divider" />
          <div className="sidebar-section-label">Catalog</div>
          <button
            className="sidebar-add-btn"
            onClick={() => setView(VIEWS.ADD_BOOK)}
          >
            + Add New Book
          </button>
        </nav>

        <main className="main-content">
          {globalFeedback && (
            <div
              className="global-feedback"
              onClick={() => setGlobalFeedback('')}
              role="alert"
            >
              {globalFeedback}
            </div>
          )}

          {heading && (
            <div className="page-heading">
              <h2>{heading.title}</h2>
              <p>{heading.desc}</p>
            </div>
          )}

          {(view === VIEWS.AVAILABLE || view === VIEWS.CHECKED_OUT) && (
            <BookList
              filter={view}
              onSelect={setSelectedId}
              onCheckIn={triggerRefresh}
              onCheckOut={setCheckoutBook}
              refresh={refresh}
            />
          )}

          {view === VIEWS.ADD_BOOK && (
            <AddBookForm
              onDone={handleAddDone}
              onCancel={() => setView(VIEWS.AVAILABLE)}
            />
          )}
        </main>
      </div>

      <footer className="app-footer">
        City Library Management System, <span>CS3320 Capstone Project</span>. All rights reserved.
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
    </div>
  );
}
