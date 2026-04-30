import { useState } from 'react';

const API = 'http://localhost:4000';

export default function CheckoutForm({ book, onClose, onDone }) {
  const [who, setWho] = useState('');
  const [due, setDue] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!who.trim() || !due.trim()) {
      setError('Both fields are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(API + '/books/checkout/' + book._id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ who, due })
      });
      if (!res.ok) throw new Error('Checkout failed');
      onDone('Checked out ' + book.title + ' to ' + who + '.');
    } catch {
      setError('Error checking out book.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Check Out Book</h2>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>
        <p className="book-title-sub">{book.title}</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Borrower Name</label>
            <input
              type="text"
              value={who}
              onChange={e => setWho(e.target.value)}
              placeholder="Enter borrower name"
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="text"
              value={due}
              onChange={e => setDue(e.target.value)}
              placeholder="e.g. 12/31/25"
            />
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Processing...' : 'Confirm Checkout'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
