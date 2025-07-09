import React, { useState, useEffect } from 'react';
import { useUser } from './components';
import { useNavigate } from 'react-router-dom';
import './css/Snap.css';

function Snap() {
  const [snaps, setSnaps] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/snap/snaps')
      .then(res => res.json())
      .then(data => setSnaps(data))
      .catch(err => console.error('Error fetching snaps:', err));
  }, []);

  const handleUpload = async () => {
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);
    formData.append('user', user.name);

    try {
      await fetch('http://localhost:5000/api/snap/snaps', {
        method: 'POST',
        body: formData,
      });

      alert('Snap uploaded!');
      setImage(null);
      setCaption('');
      setShowModal(false);

      const res = await fetch('http://localhost:5000/api/snap/snaps');
      const updatedSnaps = await res.json();
      setSnaps(updatedSnaps);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="snap-container">
      <div className="nav-buttons">
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/events')}>Events</button>
        <button onClick={() => navigate('/clubs')}>Clubs</button>
      </div>

      <button onClick={() => setShowModal(true)} className="upload-btn">
        Upload a Watup
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>New Watup</h3>
            <input type="file" onChange={e => setImage(e.target.files[0])} />
            <input
              type="text"
              placeholder="Caption (optional)"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="caption-input"
            />
            <div className="modal-buttons">
              <button onClick={handleUpload} className="upload-btn">Upload</button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <hr />
      <h2>Feeds</h2>
      {snaps.length === 0 ? (
        <p>No snaps available</p>
      ) : (
        snaps.map((snap, i) => (
          <div key={i} className="snap-card">
            <img src={snap.imageUrl} alt="snap" className="snap-image" />
            <p>{snap.caption}</p>
            <small>Posted: {new Date(snap.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Snap;
