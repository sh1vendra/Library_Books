import { useState, useEffect } from 'react';

const API = 'http://localhost:4000';

export default function BookDetail({ bookId, onClose, onDelete }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    fetch(API + '/books/' + bookId)
      .then(r => r.json())
      .then(data => { setBook(data); setLoading(false); })
      .catch(() => { setError('Failed to load book details.'); setLoading(false); });
  }, [bookId]);

  const handleDelete = async () => {
    try {
      const res = await fetch(API + '/books/' + bookId, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      onDelete();
    } catch {
      setError('Error deleting book.');
    }
  };

  if (loading) return <div className="modal-overlay"><div className="modal"><div className="loading">Loading...</div></div></div>;
  if (error) return <div className="modal-overlay"><div className="modal"><p className="error">{error}</p><button onClick={onClose}>Close</button></div></div>;
  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{book.title}</h2>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>
        <div className="detail-grid">
          <span className="label">Author</span>
          <span>{book.author}</span>
          <span className="label">Publisher</span>
          <span>{book.publisher}</span>
          <span className="label">ISBN</span>
          <span>{book.isbn}</span>
          <span className="label">Status</span>
          <span className={book.avail ? 'status available' : 'status checkedout'}>
            {book.avail ? 'Available' : 'Checked Out'}
          </span>
          {!book.avail && (
            <>
              <span className="label">Checked Out By</span>
              <span>{book.who}</span>
              <span className="label">Due Date</span>
              <span>{book.due}</span>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-delete" onClick={handleDelete}>Delete Book</button>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
