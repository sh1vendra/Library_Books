import { useState } from 'react';

const API = 'http://localhost:4000';

const empty = { title: '', author: '', publisher: '', isbn: '', avail: true, who: '', due: '' };

export default function AddBookForm({ onDone, onCancel }) {
  const [form, setForm]         = useState(empty);
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => {
    const value = field === 'avail' ? e.target.value === 'true' : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.publisher || !form.isbn) {
      setError('Title, author, publisher, and ISBN are all required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(API + '/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('failed');
      onDone('New book added to the catalog: ' + form.title + '.');
    } catch {
      setError('Error: could not add the book. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="add-book-card">
      <div className="card-header">
        <h3>New Book Entry Form</h3>
      </div>

      <div className="add-book-form-body">
        {error && <div className="inline-error" style={{ marginBottom: 22 }}>{error}</div>}

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid-2">
            <div className="form-field">
              <label>Title <span className="required">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={set('title')}
                placeholder="Full book title"
              />
            </div>
            <div className="form-field">
              <label>Author <span className="required">*</span></label>
              <input
                type="text"
                value={form.author}
                onChange={set('author')}
                placeholder="Author full name"
              />
            </div>
            <div className="form-field">
              <label>Publisher <span className="required">*</span></label>
              <input
                type="text"
                value={form.publisher}
                onChange={set('publisher')}
                placeholder="Publisher name"
              />
            </div>
            <div className="form-field">
              <label>ISBN <span className="required">*</span></label>
              <input
                type="text"
                value={form.isbn}
                onChange={set('isbn')}
                placeholder="e.g. 978-0-00-000000-0"
              />
            </div>
            <div className="form-field">
              <label>Initial Status</label>
              <select value={form.avail} onChange={set('avail')}>
                <option value="true">Available</option>
                <option value="false">Checked Out</option>
              </select>
            </div>
          </div>

          {!form.avail && (
            <div className="form-grid-2" style={{ marginTop: 0 }}>
              <div className="form-field">
                <label>Checked Out By</label>
                <input
                  type="text"
                  value={form.who}
                  onChange={set('who')}
                  placeholder="Borrower name"
                />
              </div>
              <div className="form-field">
                <label>Due Date</label>
                <input
                  type="text"
                  value={form.due}
                  onChange={set('due')}
                  placeholder="e.g. 12/31/25"
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add to Catalog'}
            </button>
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
