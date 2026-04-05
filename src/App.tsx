import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { MessPage } from './pages/MessPage';
import { LaundryPage } from './pages/LaundryPage';
import { NoticesPage } from './pages/NoticesPage';
import { OutingPage } from './pages/OutingPage';
import { NightCarePage } from './pages/NightCarePage';
import { ProfilePage } from './pages/ProfilePage';
import { ServicesPage } from './pages/ServicesPage';
import { ActivityPage } from './pages/ActivityPage';
import { HealthSOS } from './pages/HealthSOS';
import { RoomServicePage } from './pages/RoomServicePage';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { SOSButton } from './components/SOSButton';
import { NotificationProvider } from './context/NotificationContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-warm-bg max-w-md mx-auto relative overflow-x-hidden">
      {!isLoginPage && <TopBar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isLoginPage && <BottomNav />}
      {!isLoginPage && <SOSButton />}
    </div>
  );
};

export default function App() {
  return (
    <NotificationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/mess" element={<MessPage />} />
            <Route path="/laundry" element={<LaundryPage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/outing" element={<OutingPage />} />
            <Route path="/night-care" element={<NightCarePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/health-sos" element={<HealthSOS />} />
            <Route path="/room-service" element={<RoomServicePage />} />
          </Routes>
        </Layout>
      </Router>
    </NotificationProvider>
  );
}
