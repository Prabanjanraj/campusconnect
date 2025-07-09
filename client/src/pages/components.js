import React, { createContext, useContext, useState } from 'react';

// Create Context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: '',
    name: '',
    email: '',
    followedClubs: [] // updated field
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the context
export const useUser = () => useContext(UserContext);
