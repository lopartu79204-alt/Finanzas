import React, { useState } from 'react';
import { ViewState, UserProfile } from './types';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setView(ViewState.LANDING);
  };

  return (
    <>
      {view === ViewState.LANDING && (
        <LandingPage onLoginClick={() => setView(ViewState.LOGIN)} />
      )}
      {view === ViewState.LOGIN && (
        <Auth 
            onLogin={handleLogin} 
            onBack={() => setView(ViewState.LANDING)}
        />
      )}
      {view === ViewState.DASHBOARD && user && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
