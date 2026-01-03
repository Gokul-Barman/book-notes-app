import { useState } from 'react';
import axios from 'axios';
import '../css/BookForm.css';

const BookForm = ({ onNoteAdded }) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [formData, setFormData] = useState({ title: '', review: '', rating: 0, read_date: '' });
  const [coverUrl, setCoverUrl] = useState('');
  const [hover, setHover] = useState(0);
  const [loadingCover, setLoadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleTitleBlur = async () => {
    if (!formData.title) return;
    setLoadingCover(true);
    try {
      const res = await axios.get(`${API_URL}/notes/cover-search?title=${encodeURIComponent(formData.title)}`);
      console.log("Cover search response:", res.data);
      if (res.data.coverUrl) {
        console.log("Setting cover URL:", res.data.coverUrl);
        setCoverUrl(res.data.coverUrl);
      } else {
        console.warn("No cover found for book:", formData.title);
      }
    } catch (err) {
      console.error("Cover search failed:", err.message);
    } finally {
      setLoadingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/notes`, { ...formData, cover_url: coverUrl });
      setFormData({ title: '', review: '', rating: 0, read_date: '' });
      setCoverUrl('');
      onNoteAdded();
    } catch (err) {
      alert("Error saving note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-form-container">
      <form onSubmit={handleSubmit} className="entry-form">
        <div className="form-main-row">
          <div className="mini-preview-wrapper">
            {loadingCover ? (
              <div className="mini-preview loading">Loading cover...</div>
            ) : coverUrl ? (
              <img src={coverUrl} alt="Preview" className="mini-preview" />
            ) : null}
          </div>
          <input 
            type="text" 
            placeholder="Book Title" 
            value={formData.title} 
            onBlur={handleTitleBlur} // fetch cover on title blur
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required 
          />
          <div className="date-input-wrapper">
            <label htmlFor="read_date" className="date-label">Read date</label>
            <input 
              id="read_date"
              type="date" 
              value={formData.read_date} 
              onChange={(e) => setFormData({...formData, read_date: e.target.value})}
              max={getTodayDate()}
              required 
              aria-label="Read date"
            />
          </div>
          <div className="stars"> 
            {[1,2,3,4,5].map(s => ( // Dyncamic star rating system -Loop creates 1-5 stars
              <span key={s} 
                style={{ color: s <= (hover || formData.rating) ? '#FFD700' : '#CCC' }} // gold if selected or hovered, grey otherwise
                onClick={() => setFormData({...formData, rating: s})} // set rating on click
                onMouseEnter={() => setHover(s)} // set hover on mouse enter
                onMouseLeave={() => setHover(0)} // reset hover on mouse leave
              >★</span>
            ))}
          </div>
        </div>
        <textarea 
          placeholder="What are your thoughts on this book?" 
          value={formData.review} 
          onChange={(e) => setFormData({...formData, review: e.target.value})}
        />
        <button type="submit" className="submit-btn" disabled={loadingCover || isSubmitting}>
          {isSubmitting ? 'Saving...' : loadingCover ? 'Waiting for cover...' : 'Add Book Note'}
        </button>
      </form>
    </div>
  );
};

export default BookForm;