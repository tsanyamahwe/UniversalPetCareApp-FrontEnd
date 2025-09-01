import React from 'react';
import {BsFillHospitalFill, BsGrid1X2Fill, BsPeopleFill, BsX} from 'react-icons/bs';

const AdminDashboardSideBar = ({openSidebarToggle, OpenSidebar, onNavigate, activeTab}) => {
  return (
    <aside id='sidebar' className={openSidebarToggle ? "sidebar-responsive" : "sidebar-responsive"}>
      <div className='sidebar-title'>
        <div className='side-brand'>
          <BsFillHospitalFill className='icon-header'/>
          uniPetCare
        </div>
        <span className='icon-close' onClick={OpenSidebar}>
          <BsX size={20}/>
        </span>
      </div>
      
      <ul className="sidebar-list">
        <li className={`sidebar-list-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => onNavigate("overview")}>
          <a href='#' onClick={(e) => e.preventDefault()}>
            <BsGrid1X2Fill className='icon'/>
            <h4>Dashboard Overview</h4>
          </a>
        </li>
        
        <li className={`sidebar-list-item ${activeTab === "veterinarians" ? "active" : ""}`}
            onClick={() => onNavigate("veterinarians")}>
          <a href='#' onClick={(e) => e.preventDefault()}>
            <BsPeopleFill className='icon'/>
            <h4>Veterinarians</h4>
          </a>
        </li>
        
        <li className={`sidebar-list-item ${activeTab === "patients" ? "active" : ""}`}
            onClick={() => onNavigate("patients")}>
          <a href='#' onClick={(e) => e.preventDefault()}>
            <BsPeopleFill className='icon'/>
            <h4>Patients</h4>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default AdminDashboardSideBar;