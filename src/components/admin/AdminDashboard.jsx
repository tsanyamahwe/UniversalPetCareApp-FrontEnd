import React, { useState, useEffect } from 'react';
import AdminOverview from './AdminOverview';
import AdminDashboardSideBar from './AdminDashboardSideBar';
import VeterinarianComponent from './VeterinarianComponent';
import PatientComponent from './PatientComponent';

const AdminDashboard = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  
  const getActiveComponentFromHash = () => {
    const hash = window.location.hash.substring(1); 
    const validComponents = ["overview", "veterinarians", "patients"];
    return validComponents.includes(hash) ? hash : "overview";
  };
  
  const [activeContent, setActiveContent] = useState(getActiveComponentFromHash);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleNavigation = (component) => {
    setActiveContent(component);
    window.location.hash = component; 
  };

  useEffect(() => {
    const handleHashChange = () => {
      setActiveContent(getActiveComponentFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <main className='admin-body'>
      {/* Sidebar Container - 20% */}
      <div className='grid-container'>
        <AdminDashboardSideBar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
          onNavigate={handleNavigation}
          activeTab={activeContent}
        />
      </div>
      
      {/* Main Content Container - 80% */}
      <div className='main-container'>
        {activeContent === "overview" && <AdminOverview/>}
        {activeContent === "veterinarians" && <div><VeterinarianComponent/></div>}
        {activeContent === "patients" && <div><PatientComponent/></div>}
      </div>
    </main>
  );
};

export default AdminDashboard;