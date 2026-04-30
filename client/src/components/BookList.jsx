import { useState, useEffect } from 'react';

const API = 'http://localhost:4000';

export default function BookList({ onSelect, onCheckIn, onCheckOut, refresh }) {
  const [tab, setTab] = useState('available');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setLoading(true);
    const endpoint = tab === 'available' ? '/books/available' : '/books/checked-out';
    fetch(API + endpoint)
      .then(r => r.json())
      .then(data => { setBooks(data); setLoading(false); })
      .catch(() => { setFeedback('Failed to load books.'); setLoading(false); });
  }, [tab, refresh]);

  const handleCheckIn = async (id) => {
    try {
      const res = await fetch(API + '/books/checkin/' + id, { method: 'PUT' });
      if (!res.ok) throw new Error('Check-in failed');
      setFeedback('Book checked in successfully.');
      onCheckIn();
    } catch {
      setFeedback('Error checking in book.');
    }
  };

  return (
    <div className="booklist">
      <div className="tab-bar">
        <button
          className={tab === 'available' ? 'tab active' : 'tab'}
          onClick={() => setTab('available')}
        >
          Available Books
        </button>
        <button
          className={tab === 'checked-out' ? 'tab active' : 'tab'}
          onClick={() => setTab('checked-out')}
        >
          Checked Out
        </button>
      </div>

      {feedback && (
        <div className="feedback success" onClick={() => setFeedback('')}>
          {feedback}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : books.length === 0 ? (
        <div className="empty">No books found.</div>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              {tab === 'checked-out' && <th>Checked Out By</th>}
              {tab === 'checked-out' && <th>Due Date</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book._id}>
                <td>
                  <button className="link-btn" onClick={() => onSelect(book._id)}>
                    {book.title}
                  </button>
                </td>
                <td>{book.author}</td>
                <td className="isbn">{book.isbn}</td>
                {tab === 'checked-out' && <td>{book.who}</td>}
                {tab === 'checked-out' && <td>{book.due}</td>}
                <td className="actions">
                  {tab === 'available' ? (
                    <button className="btn-checkout" onClick={() => onCheckOut(book)}>
                      Check Out
                    </button>
                  ) : (
                    <button className="btn-checkin" onClick={() => handleCheckIn(book._id)}>
                      Check In
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
