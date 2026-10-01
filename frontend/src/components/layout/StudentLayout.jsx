import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, NavDropdown, Nav, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FaGraduationCap, FaUser, FaBookOpen, FaListAlt, FaKey, FaSignOutAlt } from 'react-icons/fa';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-primary fw-bold">
            <FaGraduationCap size={30} className="me-2" />
            EduLearn
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="student-navbar-nav" />
          <Navbar.Collapse id="student-navbar-nav">
            <Nav className="me-auto ms-4">
              <Nav.Link as={Link} to="/courses" className="fw-medium px-3">Browse Courses</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown 
                title={<span className="fw-medium text-primary"><FaUser className="me-1"/> {user?.name || 'Student'}</span>} 
                id="student-nav-dropdown" 
                align="end"
              >
                <NavDropdown.Item as={Link} to="/student/profile" className={isActive('/student/profile') ? 'active' : ''}>
                  <FaUser className="me-2 text-muted" /> My Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/student/my-courses" className={isActive('/student/my-courses') ? 'active' : ''}>
                  <FaBookOpen className="me-2 text-muted" /> My Courses
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/student/my-registrations" className={isActive('/student/my-registrations') ? 'active' : ''}>
                  <FaListAlt className="me-2 text-muted" /> My Registrations
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/student/change-password" className={isActive('/student/change-password') ? 'active' : ''}>
                  <FaKey className="me-2 text-muted" /> Change Password
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content Area */}
      <main className="flex-grow-1 bg-light py-4">
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <Container className="text-center">
          <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} EduLearn. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default StudentLayout;
