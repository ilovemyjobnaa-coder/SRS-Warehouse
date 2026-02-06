
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueueProvider } from './store.tsx';
import Navbar from './components/Navbar.tsx';
import NotificationService from './NotificationService.tsx';
import Registration from './pages/Registration.tsx';
import StaffControl from './pages/StaffControl.tsx';
import DisplayBoard from './pages/DisplayBoard.tsx';
import Report from './pages/Report.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isDisplayPage = location.pathname === '/display';

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {!isDisplayPage && <Navbar />}
      <main className={`flex-1 min-h-0 ${isDisplayPage ? '' : 'bg-gray-50 pb-12 overflow-y-auto'}`}>
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueueProvider>
      <NotificationService />
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Registration />} />
            <Route path="/staff" element={<StaffControl />} />
            <Route path="/display" element={<DisplayBoard />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </Layout>
      </HashRouter>
    </QueueProvider>
  );
};

export default App;
