import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/events/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="events-container">
      <div className="nav-buttons">
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/clubs')}>Clubs</button>
        <button onClick={() => navigate('/snap')}>Watup</button>
      </div>

      <h1>Events</h1>

      {loading && <p>Loading events...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {events.length === 0 && !loading ? (
        <p>No events for now...</p>
      ) : (
        <ul className="events-list">
          {events.map((event, index) => (
            <li key={index} className="event-card">
              <h2>{event.club}</h2>
              <img src={event.imageurl} alt="Event" className="event-image" />
              <p><h3>{event.name}</h3> </p>
              <p><strong>Description:</strong> {event.description}</p>
              <p><strong>Start Date:</strong> {event.startDate}</p>
              <p><strong>End Date:</strong> {event.endDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Events;
