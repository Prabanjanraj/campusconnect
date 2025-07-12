// HomePage.js
import { useNavigate } from 'react-router-dom';
import { useUser } from './components';
import { useState, useEffect } from 'react';
import './css/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [profile, setProfile] = useState(false);
  const [about, setAbout] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeline, setTimeline] = useState([]);

  const closeModals = () => {
    setProfile(false);
    setAbout(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    if (user && user._id) {
      fetch(`https://campusconnect-9tui.onrender.com/api/timeline/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setTimeline(data);
          } else {
            console.warn("Unexpected timeline format:", data);
            setTimeline([]);
          }
        })
        .catch((err) => {
          console.error('Error loading timeline:', err);
          setTimeline([]);
        });
    }
  }, [user]);

  return (
    <div className="home-container">
      <header className="topbar">
        <button className="menu-button" onClick={() => setDrawerOpen(!drawerOpen)}>
          ☰
        </button>
        <h2>ClubVibe</h2>
      </header>

      {drawerOpen && (
        <div className="drawer">
          <button className="close-button" onClick={() => setDrawerOpen(false)}>✖</button>
          <ul>
            <li onClick={() => { setProfile(true); setAbout(false); }}>👤 Profile</li>
            <li onClick={handleLogout}>🚪 Logout</li>
            <li onClick={() => { setAbout(true); setProfile(false); }}>ℹ️ About</li>
          </ul>
        </div>
      )}

      {profile && (
        <div className="modal">
          <div className="modal-content">
            <h3>Name: {user.name}</h3>
            <h3>Email: {user.email}</h3>
            <button onClick={closeModals}>Close</button>
          </div>
        </div>
      )}

      {about && (
        <div className="modal">
          <div className="modal-content">
            <h1>About ClubVibe</h1>
            <p>This is a platform to explore clubs and events in your college.</p>
            <button onClick={closeModals}>Close</button>
          </div>
        </div>
      )}

      <div className="main-content">
        <h1>Hello 👋 {user.name}!</h1>
        <h2>Welcome to ClubVibe</h2>
        <div className="nav-buttons">
          <button onClick={() => navigate('/clubs')}>Clubs</button>
          <button onClick={() => navigate('/events')}>Events</button>
          <button onClick={() => navigate('/snap')}>Watup</button>
        </div>

        {/* Timeline Feed */}
<div className="timeline-container">
  <h2>📢 Timeline</h2>
  {timeline.length === 0 ? (
    <p>No updates yet.</p>
  ) : (
    timeline.map((item, index) => (
      <div key={index} className="timeline-card">
        <h3>{item.type === 'event' ? '📅 Event' : '📸 Watup'}</h3>

        {item.type === 'event' && (
          <>
            <p>
              <strong
                className="club-link"
                onClick={() => navigate('/clubs')}
              >
                {item.club || 'Unknown Club'}
              </strong>
            </p>
            <p>{item.name || 'No description available.'}</p>
            <p>🕒 {item.startDate} to {item.endDate}</p>
          </>
        )}

        {item.type === 'snap' && (
          <p><strong>{item.caption || 'Snap posted!'}</strong></p>
        )}

        {item.imageUrl && (
          <img src={item.imageUrl} alt="timeline" className="timeline-image" />
        )}
      </div>
    ))
  )}
</div>


      </div>
    </div>
  );
}

export default HomePage;
