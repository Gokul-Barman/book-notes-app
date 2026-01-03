import { useState } from 'react';
import axios from 'axios';
import '../css/BookNotes.css';

const CoverImage = ({ src, alt }) => {
  const [loading, setLoading] = useState(!!src); // show loading only if src exists
  const placeholder = 'https://dummyimage.com/120x180/8B3E2F/fffdf6?text=No+Cover';

  if (!src) {
    return <img src={placeholder} alt={alt} />;
  }

  return (
    <div className="cover-wrapper">
      {loading && <div className="cover-placeholder">Loading...</div>}
      <img
        src={src}
        alt={alt}
        style={{ display: loading ? 'none' : 'block' }}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  );
};

const BookNotes = ({ notes, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editHover, setEditHover] = useState(0); // Tracking hover during edit

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditData(note);
  };

  const handleSave = async (id) => {
   
    try {
      await axios.put(`http://localhost:5000/notes/${id}`, editData);
      setEditingId(null); 
      onUpdate(); // refresh notes list
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) { // confirmation dialog
      await axios.delete(`http://localhost:5000/notes/${id}`); 
      onUpdate(); // refresh notes list
    }
  };

  return (
   <div className="notes-list-wrapper">
      {notes.map(note => (
        <div key={note.id} className="note-horizontal-card">
          <CoverImage src={note.cover_url} alt="cover" />
          
          <div className="note-details">
            {editingId === note.id ? (
              <div className="edit-mode-container">
                <h3 className="edit-mode-title">{editData.title}</h3>
                
                <div className="edit-meta-row">
                   {/* Star Rating for Edit Mode */}
                   <div className="edit-stars">
                     {[1, 2, 3, 4, 5].map((s) => (
                       <span
                         key={s}
                         className="star"
                         style={{ color: s <= (editHover || editData.rating) ? '#FFD700' : '#CCC' }}
                         onClick={() => setEditData({ ...editData, rating: s })}
                         onMouseEnter={() => setEditHover(s)}
                         onMouseLeave={() => setEditHover(0)}
                       >★</span>
                     ))}
                   </div>

                   <input 
                     type="date" 
                     className="edit-date-input"
                     value={editData.read_date?.split('T')[0]} 
                     onChange={e => setEditData({...editData, read_date: e.target.value})} 
                   />
                </div>

                <textarea 
                  className="edit-textarea"
                  value={editData.review} 
                  onChange={e => setEditData({...editData, review: e.target.value})} 
                />

                <div className="edit-buttons">
                   <button onClick={() => handleSave(note.id)} className="confirm-btn">Save Changes</button>
                   <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <div className="star-display">{'★'.repeat(note.rating)}</div>
                </div>
                <p className="note-review-text">{note.review}</p>
                <div className="note-footer">
                  <span>Read on: {new Date(note.read_date).toLocaleDateString()}</span>
                  <div className="note-actions">
                    <button onClick={() => startEdit(note)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(note.id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookNotes;