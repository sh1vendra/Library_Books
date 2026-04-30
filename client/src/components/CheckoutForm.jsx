import { useState } from 'react';

const API = 'http://localhost:4000';

export default function CheckoutForm({ book, onClose, onDone }) {
  const [who, setWho]           = useState('');
  const [due, setDue]           = useState('');
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!who.trim() || !due.trim()) {
      setError('Borrower name and due date are both required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(API + '/books/checkout/' + book.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ who: who.trim(), due: due.trim() })
      });
      if (!res.ok) throw new Error('failed');
      onDone(book.title + ' checked out to ' + who.trim() + '. Due: ' + due.trim() + '.');
    } catch {
      setError('Error: could not complete checkout. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-titlebar">
          <h2>Checkout Book</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">x</button>
        </div>

        <div className="modal-body">
          <p className="book-detail-sub">
            Checking out: <strong style={{ color: 'var(--navy)' }}>{book.title}</strong>
          </p>

          {error && <div className="inline-error" style={{ marginBottom: 18 }}>{error}</div>}

          <form onSubmit={handleSubmit} id="checkout-form" className="form-body">
            <div className="form-field">
              <label>
                Borrower Name <span className="required">*</span>
              </label>
              <input
                type="text"
                value={who}
                onChange={e => setWho(e.target.value)}
                placeholder="Full name of borrower"
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>
                Due Date <span className="required">*</span>
              </label>
              <input
                type="text"
                value={due}
                onChange={e => setDue(e.target.value)}
                placeholder="e.g. 12/31/25"
              />
            </div>
          </form>
        </div>

        <div className="modal-footer-btns">
          <button
            type="submit"
            form="checkout-form"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Confirm Checkout'}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
