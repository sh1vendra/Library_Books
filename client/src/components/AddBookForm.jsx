import { useState } from 'react';

const API = 'http://localhost:4000';

const empty = { title: '', author: '', publisher: '', isbn: '', avail: true, who: '', due: '' };

export default function AddBookForm({ onClose, onDone }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => {
    const value = field === 'avail' ? e.target.value === 'true' : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.publisher || !form.isbn) {
      setError('Title, author, publisher, and ISBN are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(API + '/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to add book');
      onDone('Book added successfully.');
    } catch {
      setError('Error adding book.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Book</h2>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={form.title} onChange={set('title')} placeholder="Book title" />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" value={form.author} onChange={set('author')} placeholder="Author name" />
            </div>
            <div className="form-group">
              <label>Publisher</label>
              <input type="text" value={form.publisher} onChange={set('publisher')} placeholder="Publisher" />
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input type="text" value={form.isbn} onChange={set('isbn')} placeholder="ISBN" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.avail} onChange={set('avail')}>
                <option value="true">Available</option>
                <option value="false">Checked Out</option>
              </select>
            </div>
            {!form.avail && (
              <>
                <div className="form-group">
                  <label>Checked Out By</label>
                  <input type="text" value={form.who} onChange={set('who')} placeholder="Borrower name" />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="text" value={form.due} onChange={set('due')} placeholder="e.g. 12/31/25" />
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Book'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
