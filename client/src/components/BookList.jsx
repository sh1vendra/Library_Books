import { useState, useEffect } from 'react';

const API = 'http://localhost:4000';

export default function BookList({ filter, onSelect, onCheckIn, onCheckOut, refresh }) {
  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setLoading(true);
    const endpoint = filter === 'available' ? '/books/available' : '/books/checked-out';
    fetch(API + endpoint)
      .then(r => r.json())
      .then(data => { setBooks(data); setLoading(false); })
      .catch(() => { setFeedback('Failed to load books from server.'); setLoading(false); });
  }, [filter, refresh]);

  const handleCheckIn = async (id, title) => {
    try {
      const res = await fetch(API + '/books/checkin/' + id, { method: 'PUT' });
      if (!res.ok) throw new Error('failed');
      setFeedback(title + ' has been checked back in.');
      onCheckIn();
    } catch {
      setFeedback('Error: could not check in book.');
    }
  };

  const isCheckedOut = filter === 'checked-out';

  return (
    <div className="card">
      <div className="card-header">
        <h3>{isCheckedOut ? 'Checked Out Books' : 'Available Books'}</h3>
        {!loading && <span className="count-badge">{books.length} record{books.length !== 1 ? 's' : ''}</span>}
      </div>

      {feedback && (
        <div
          className={feedback.startsWith('Error') ? 'inline-error' : 'inline-success'}
          style={{ margin: '16px 24px 0' }}
          onClick={() => setFeedback('')}
        >
          {feedback}
        </div>
      )}

      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Status</th>
            {isCheckedOut && <th>Borrower</th>}
            {isCheckedOut && <th>Due Date</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className="loading-row">
              <td colSpan={isCheckedOut ? 8 : 6}>Loading records...</td>
            </tr>
          ) : books.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={isCheckedOut ? 8 : 6}>No records found.</td>
            </tr>
          ) : (
            books.map(book => (
              <tr key={book.id}>
                <td className="title-cell">
                  <button className="title-link" onClick={() => onSelect(book.id)}>
                    {book.title}
                  </button>
                </td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td className="isbn-cell">{book.isbn}</td>
                <td>
                  {book.avail
                    ? <span className="badge badge-available">Available</span>
                    : <span className="badge badge-checkedout">Checked Out</span>
                  }
                </td>
                {isCheckedOut && <td>{book.who}</td>}
                {isCheckedOut && <td>{book.due}</td>}
                <td>
                  {book.avail ? (
                    <button
                      className="btn-action btn-checkout"
                      onClick={() => onCheckOut(book)}
                    >
                      Check Out
                    </button>
                  ) : (
                    <button
                      className="btn-action btn-checkin"
                      onClick={() => handleCheckIn(book.id, book.title)}
                    >
                      Check In
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
