import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

const DashboardLayout = ({ onLogout }) => {
  const [pageTitle, setPageTitle] = useState('Dashboard');

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      
      <div className="dashboard-main">
        <Header title={pageTitle} />
        
        <main className="dashboard-content">
          <Outlet context={{ setPageTitle }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
