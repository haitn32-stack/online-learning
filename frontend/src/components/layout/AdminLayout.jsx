import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, NavDropdown, Row, Col, Nav } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaBars, FaUser, FaBook, FaList, FaCog, FaSignOutAlt, 
  FaChartBar, FaBlog, FaImage, FaQuestionCircle, FaClipboardList, 
  FaUsers, FaMoneyBillWave, FaGraduationCap
} from 'react-icons/fa';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'Marketing':
        return [
          { path: '/marketing/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
          { path: '/marketing/blogs', icon: <FaBlog />, label: 'Blogs' },
          { path: '/marketing/sliders', icon: <FaImage />, label: 'Sliders' },
        ];
      case 'Expert':
        return [
          { path: '/expert/subjects', icon: <FaBook />, label: 'Subjects' },
          { path: '/expert/questions', icon: <FaQuestionCircle />, label: 'Questions' },
          { path: '/expert/quizzes', icon: <FaClipboardList />, label: 'Quizzes' },
        ];
      case 'Sale':
        return [
          { path: '/sale/registrations', icon: <FaList />, label: 'Registrations' },
        ];
      case 'Admin':
        return [
          { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
          { path: '/admin/subjects', icon: <FaBook />, label: 'All Subjects' },
          { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top px-3">
        <div className="d-flex align-items-center">
          <FaBars 
            className="me-3 cursor-pointer text-secondary" 
            style={{ cursor: 'pointer' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <Navbar.Brand as={Link} to="/" className="text-primary fw-bold m-0 d-flex align-items-center">
            <FaGraduationCap size={24} className="me-2" />
            EduLearn <span className="text-secondary fs-6 ms-2">| {user?.role} Portal</span>
          </Navbar.Brand>
        </div>
        
        <Nav className="ms-auto">
          <NavDropdown title={
            <span><FaUser className="me-2" />{user?.name || 'User'}</span>
          } id="admin-nav-dropdown" align="end">
            <NavDropdown.Item as={Link} to="/">View Site</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout} className="text-danger">
              <FaSignOutAlt className="me-2" /> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="sidebar shadow-sm" style={{ width: '250px', flexShrink: 0 }}>
            <Nav className="flex-column px-3 pt-4">
              {navLinks.map((link, index) => (
                <Nav.Link 
                  key={index}
                  as={Link} 
                  to={link.path}
                  className={`mb-2 d-flex align-items-center ${isActive(link.path) ? 'active' : ''}`}
                >
                  {link.icon} <span className="ms-3">{link.label}</span>
                </Nav.Link>
              ))}
            </Nav>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-grow-1 p-4" style={{ overflowX: 'hidden' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
