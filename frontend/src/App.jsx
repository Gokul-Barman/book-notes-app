import { useState, useEffect } from 'react';
import axios from 'axios';
import BookForm from '../components/BookForm.jsx';
import BookNotes from '../components/BookNotes.jsx';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';
import '../css/App.css';

function App() {
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [notes, setNotes] = useState([]);
  const [sortType, setSortType] = useState('created_at');
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('register');
  const [loading, setLoading] = useState(true);

  // if token exists in localStorage, attach it
  useEffect(() => {
    const initAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set global header so we don't have to manually pass the token in every axios.get/post call. Also persist login state so user stays authenticated on page refresh
      try {
        // fetch user profile from backend to restore the 'user' state
        const res = await axios.get(`${API_URL}/auth/me`);
        setUser(res.data); // restore user state ({id, username})
      } catch (err) {
        console.error("Token invalid or expired", err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization']; // Remove the token so future requests are no longer authenticated
      }
    }
    setLoading(false);

  }
  initAuth();
}, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_URL}/notes?sort=${sortType}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  useEffect(() => { // call fetchNotes everytime when  sortType changes
    fetchNotes();
  }, [sortType]);

  const handleAuth = (user) => {
    setUser(user);
    fetchNotes();
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setNotes([]);
  }

  if (!user) {
    return (
      <div className="app-root">
        <div className="app-container">
          <header className="app-header">
            <h1>📚 My Personal Library</h1>
          </header>
          <div className="auth-row">
            {authView === 'register' ? (
              <Register onAuth={handleAuth} onSwitch={setAuthView} />
            ) : (
              <Login onAuth={handleAuth} onSwitch={setAuthView} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <h1>📚 My Personal Library</h1>
          <div className="user-bar">Logged in as {user.username} <button onClick={logout}>Logout</button></div>
        </header>

        {/* Top Form - Full Width */}
        <section className="top-section">
          <BookForm onNoteAdded={fetchNotes} />
        </section>

        {/* Sorting Controls */}
        <div className="list-controls">
          <h2>Your Collection</h2>
          <div className="button-group">
            <button 
              className={sortType === 'recency' ? 'active' : ''}  // If sortType is 'recency', apply the 'active' CSS class for styling
              onClick={() => setSortType('recency')}
            >
              Sort by Recency
            </button>
            <button 
              className={sortType === 'rating' ? 'active' : ''} // If sortType is 'rating', apply the 'active' CSS class for styling
              onClick={() => setSortType('rating')}
            >
              Sort by Rating
            </button>
          </div>
        </div>

        {/* Bottom List - Column Wise */}
        <section className="bottom-section">
          <BookNotes notes={notes} onUpdate={fetchNotes} />
        </section>
      </div>
    </div>
  );
}

export default App;