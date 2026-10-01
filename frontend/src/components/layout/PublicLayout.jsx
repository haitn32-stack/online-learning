import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';

const PublicLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'Admin': return '/admin/users';
      case 'Marketing': return '/marketing/dashboard';
      case 'Expert': return '/expert/subjects';
      case 'Sale': return '/sale/registrations';
      case 'Student': return '/student/my-courses';
      default: return '/';
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-primary fw-bold">
            <FaGraduationCap size={30} className="me-2" />
            EduLearn
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ms-4">
              <Nav.Link as={Link} to="/" className="fw-medium px-3">Home</Nav.Link>
              <Nav.Link as={Link} to="/courses" className="fw-medium px-3">Courses</Nav.Link>
              <Nav.Link as={Link} to="/blogs" className="fw-medium px-3">Blogs</Nav.Link>
            </Nav>
            <Nav>
              {!isAuthenticated ? (
                <>
                  <Button as={Link} to="/login" variant="outline-primary" className="me-2 px-4 rounded-pill">
                    Login
                  </Button>
                  <Button as={Link} to="/register" variant="primary" className="px-4 rounded-pill btn-gradient">
                    Register
                  </Button>
                </>
              ) : (
                <NavDropdown title={<span className="fw-medium">Hello, {user?.fullName || user?.name || 'User'}</span>} id="basic-nav-dropdown" align="end">
                  {user?.role === 'Student' ? (
                    <>
                      <NavDropdown.Item as={Link} to="/student/profile">Profile</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/student/my-courses">My Courses</NavDropdown.Item>
                    </>
                  ) : (
                    <NavDropdown.Item as={Link} to={getDashboardLink()}>Dashboard</NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">Logout</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="footer mt-auto">
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <div className="d-flex align-items-center text-white fw-bold fs-4 mb-3">
                <FaGraduationCap size={30} className="me-2 text-primary" />
                EduLearn
              </div>
              <p className="text-muted">
                Empowering learners worldwide with high-quality online education and expert instructors.
              </p>
            </Col>
            <Col md={4} className="mb-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/">Home</Link></li>
                <li className="mb-2"><Link to="/courses">Courses</Link></li>
                <li className="mb-2"><Link to="/blogs">Blogs</Link></li>
              </ul>
            </Col>
            <Col md={4} className="mb-4">
              <h5>Contact Us</h5>
              <p className="text-muted mb-1">Email: info@edulearn.com</p>
              <p className="text-muted mb-1">Phone: +1 234 567 890</p>
              <p className="text-muted">Address: 123 Education St, Learning City</p>
            </Col>
          </Row>
          <hr className="border-secondary mt-4 mb-4" />
          <div className="text-center text-muted">
            &copy; {new Date().getFullYear()} EduLearn. All rights reserved.
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default PublicLayout;
