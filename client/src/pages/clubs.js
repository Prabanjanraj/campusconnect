import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/clubs.css';

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [followed, setFollowed] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('https://campusconnect-9tui.onrender.com/api/clubs')
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(err => console.error('Error fetching clubs:', err));

    const fetchFollowed = async () => {
      try {
        const res = await fetch('https://campusconnect-9tui.onrender.com/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setFollowed(data.followedClubs || []);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchFollowed();
  }, [token]);

  const handleFollowToggle = async (clubId, isFollowing) => {
    const url = `https://campusconnect-9tui.onrender.com/api/user/${isFollowing ? 'unfollow' : 'follow'}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ clubId }),
      });

      const result = await res.json();
      if (res.ok) {
        setFollowed(result.followedClubs || []);
      } else {
        alert(result.message || 'Action failed');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="clubs-container">
      <div className="nav-buttons">
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/events')}>Events</button>
        <button onClick={() => navigate('/snap')}>Watup</button>
      </div>
      <h1>Available Clubs</h1>

      {clubs.length === 0 ? (
        <p>No clubs found.</p>
      ) : (
        <ul className="clubs-list">
          {clubs.map((club, index) => {
            const isFollowing = followed.includes(club._id);
            return (
              <li key={index} className="club-card">
                <strong>{club.name}</strong><br />
                <button onClick={() => navigate('/club-detail', { state: club })}>View</button>
                <button
                  onClick={() => handleFollowToggle(club._id, isFollowing)}
                  className="follow-button"
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Clubs;
