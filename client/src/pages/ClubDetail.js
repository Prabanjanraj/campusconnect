import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from './components';
import './css/ClubDetail.css';
import { useNavigate } from 'react-router-dom';


function ClubDetail() {
  const location = useLocation();
  const { user } = useUser();
  const club = location.state;
  const navigate = useNavigate();

  const [events, setEvent] = useState([]);
  const [history, setHistory] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [eventDialog, seteventDialog] = useState(false);
  const [eventName, seteventName] = useState('');
  const [eventDescription, seteventDescription] = useState('');
  const [eventStartdate, setStartdate] = useState('');
  const [eventenddate, setenddate] = useState('');
  const [eventImage, seteventImage] = useState(null);

  useEffect(() => {
    if (club?.name) {
      fetch(`https://campusconnect-9tui.onrender.com/api/events/${club.name}`)
        .then((res) => res.json())
        .then((data) => setEvent(data))
        .catch((err) => console.error('Error fetching events:', err));

      fetch(`https://campusconnect-9tui.onrender.com/api/history/${club.name}`)
        .then((res) => res.json())
        .then((data) => setHistory(data))
        .catch((err) => console.error('Error fetching history:', err));
    }
  }, [club]);

  const handleImageUpload = async () => {
    if (!imageFile) return alert("Please select an image");

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('description', description);
    formData.append('club', club.name);

    try {
      const res = await fetch('https://campusconnect-9tui.onrender.com/api/history', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const newEntry = await res.json();
        setHistory([...history, newEntry]);
        setShowDialog(false);
        setDescription('');
        setImageFile(null);
      } else {
        console.error('Upload failed');
      }
    } catch (err) {
      console.error('Error uploading history:', err);
    }
  };

  const handleEventUpload = async () => {
    if (!eventName || !eventStartdate) return alert("Please fill required fields");

    const formData = new FormData();
    formData.append('image', eventImage);
    formData.append('name', eventName);
    formData.append('description', eventDescription);
    formData.append('club', club.name);
    formData.append('startDate', eventStartdate);
    formData.append('endDate', eventenddate);

    try {
      const res = await fetch('https://campusconnect-9tui.onrender.com/api/events', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const newEvent = await res.json();
        setEvent([...events, newEvent]);
        seteventDialog(false);
        seteventName('');
        seteventDescription('');
        setStartdate('');
        setenddate('');
        seteventImage(null);
      } else {
        console.error('Event upload failed');
      }
    } catch (err) {
      console.error('Error uploading event:', err);
    }
  };

  const handleDeleteEvent = async (eventName) => {
    try {
      const res = await fetch(`https://campusconnect-9tui.onrender.com/api/events/by-name/${encodeURIComponent(eventName)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEvent(prev => prev.filter(ev => ev.name !== eventName));
      } else {
        console.error('Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      const res = await fetch(`https://campusconnect-9tui.onrender.com/api/history/des/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHistory(history.filter((entry) => entry._id !== id));
      } else {
        console.error('Failed to delete history');
      }
    } catch (err) {
      console.error('Error deleting history:', err);
    }
  };

  if (!club) return <p className="no-club-message">No club data provided.</p>;

  return (
    <div className="club-detail-container">
      <div className="nav-buttons">
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/events')}>Events</button>
        <button onClick={() => navigate('/snap')}>Watup</button>
      </div>
      <div className="club-header">
        <h2>{club.name}</h2>
        <p className="club-meta"><strong>Description:</strong> {club.description}</p>
        <p className="club-meta"><strong>Admin 1:</strong> {club.admin1}</p>
        <p className="club-meta"><strong>Admin 2:</strong> {club.admin2}</p>
      </div>

      <div className="section">
        <h3>
          Upcoming Events
          {(club.admin1 === user.name || club.admin2 === user.name) && (
            <button className="add-button" onClick={() => seteventDialog(true)}>+</button>
          )}
        </h3>
        
        {eventDialog && (
          <div className="dialog-backdrop" onClick={() => seteventDialog(false)}>
            <div className="event-dialog" onClick={(e) => e.stopPropagation()}>
              <h4>Add Event</h4>
              <label>Event Name *</label>
              <input type='text' value={eventName} onChange={(e) => seteventName(e.target.value)} />
              
              <label>Description</label>
              <textarea value={eventDescription} onChange={(e) => seteventDescription(e.target.value)} />
              
              <label>Start Date *</label>
              <input type='date' value={eventStartdate} onChange={(e) => setStartdate(e.target.value)} />
              
              <label>End Date</label>
              <input type='date' value={eventenddate} onChange={(e) => setenddate(e.target.value)} />
              
              <label>Image</label>
              <input type="file" onChange={(e) => seteventImage(e.target.files[0])} accept="image/*" />
              
              <div className="dialog-buttons">
                <button className="upload-btn" onClick={handleEventUpload}>Upload</button>
                <button className="cancel-btn" onClick={() => seteventDialog(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {events.length === 0 ? (
          <p className="no-events-message">No upcoming events</p>
        ) : (
          <ul className="item-list">
            {events.map((event, index) => (
              <li key={index} className="item-card">
                {(club.admin1 === user.name || club.admin2 === user.name) && (
                  <button 
                    className="delete-btn"
                    onClick={() => {
                      const confirmed = window.confirm(`Are you sure you want to delete "${event.name}"?`);
                      if (confirmed) handleDeleteEvent(event.name);
                    }}
                  >
                    🗑️
                  </button>
                )}
                {event.imageurl && (
                  <img src={event.imageurl} alt="Event" className="item-image" />
                )}
                <h4 className="item-title">{event.name}</h4>
                <p className="item-meta"><strong>Description:</strong> {event.description}</p>
                <p className="item-meta"><strong>Start:</strong> {new Date(event.startDate).toLocaleString()}</p>
                {event.endDate && (
                  <p className="item-meta"><strong>End:</strong> {new Date(event.endDate).toLocaleString()}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section">
        <h3>
          Club History
          {(club.admin1 === user.name || club.admin2 === user.name) && (
            <button className="add-button" onClick={() => setShowDialog(true)}>+</button>
          )}
        </h3>
        
        {showDialog && (
          <div className="dialog-backdrop" onClick={() => setShowDialog(false)}>
            <div className="upload-dialog" onClick={(e) => e.stopPropagation()}>
              <h4>Add History</h4>
              <label>Image *</label>
              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
              
              <label>Description</label>
              <textarea 
                placeholder="Enter description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
              
              <div className="dialog-buttons">
                <button className="upload-btn" onClick={handleImageUpload}>Upload</button>
                <button className="cancel-btn" onClick={() => setShowDialog(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <p className="no-history-message">No history available</p>
        ) : (
          <ul className="item-list">
            {history.map((entry, index) => (
              <li key={index} className="item-card">
                {(club.admin1 === user.name || club.admin2 === user.name) && (
                  <button 
                    className="delete-btn"
                    onClick={() => {
                      const confirmed = window.confirm("Are you sure you want to delete this history entry?");
                      if (confirmed) handleDeleteHistory(entry._id);
                    }}
                  >
                    🗑️
                  </button>
                )}
                {entry.imageurl && (
                  <img src={entry.imageurl} alt="History" className="item-image" />
                )}
                {entry.description && (
                  <p className="item-meta">{entry.description}</p>
                )}
                <p className="item-meta">
                  <small>{new Date(entry.timestamp).toLocaleString()}</small>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ClubDetail;