import { useState, useEffect } from 'react';

const API = 'http://localhost:4000';

export default function BookDetail({ bookId, onClose, onDelete }) {
  const [book, setBook]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    fetch(API + '/books/' + bookId)
      .then(r => r.json())
      .then(data => { setBook(data); setLoading(false); })
      .catch(() => { setError('Could not load book details.'); setLoading(false); });
  }, [bookId]);

  const handleDelete = async () => {
    try {
      const res = await fetch(API + '/books/' + bookId, { method: 'DELETE' });
      if (!res.ok) throw new Error('failed');
      onDelete();
    } catch {
      setError('Error: could not delete this record.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-titlebar">
          <h2>Book Record</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">x</button>
        </div>

        <div className="modal-body">
          {loading && <p className="inline-success" style={{ fontStyle: 'italic' }}>Loading record...</p>}
          {error   && <p className="inline-error">{error}</p>}

          {book && !loading && (
            <>
              <p className="book-detail-sub">Full catalog record for this item.</p>
              <table className="detail-table">
                <tbody>
                  <tr><td>Title</td><td style={{ fontWeight: 600, color: 'var(--navy)' }}>{book.title}</td></tr>
                  <tr><td>Author</td><td>{book.author}</td></tr>
                  <tr><td>Publisher</td><td>{book.publisher}</td></tr>
                  <tr><td>ISBN</td><td style={{ fontFamily: 'monospace', fontSize: 13 }}>{book.isbn}</td></tr>
                  <tr>
                    <td>Status</td>
                    <td>
                      {book.avail
                        ? <span className="badge badge-available">Available</span>
                        : <span className="badge badge-checkedout">Checked Out</span>
                      }
                    </td>
                  </tr>
                  {!book.avail && (
                    <>
                      <tr><td>Checked Out By</td><td>{book.who}</td></tr>
                      <tr><td>Due Date</td><td>{book.due}</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>

        <div className="modal-footer-btns">
          {book && !loading && (
            <button className="btn-danger" onClick={handleDelete}>Delete Record</button>
          )}
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
