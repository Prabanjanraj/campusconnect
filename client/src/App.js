import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Clubs from './pages/clubs';
import ClubDetail from './pages/ClubDetail';
import LoginPage from './pages/Login';
import { UserProvider } from './pages/components';
import Events from './pages/Events';
import PrivateRoute from './pages/PrivateRoute';
import Snap from './pages/Snap.js';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/clubs"
            element={
              <PrivateRoute>
                <Clubs />
              </PrivateRoute>
            }
          />
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <Events />
              </PrivateRoute>
            }
          />
          <Route
            path="/club-detail"
            element={
              <PrivateRoute>
                <ClubDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/snap"
            element={
              <PrivateRoute>
                <Snap />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
