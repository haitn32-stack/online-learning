import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '80vh' }}>
      <h1 className="display-1 fw-bold text-primary mb-4">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="text-muted mb-5 fs-5">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button as={Link} to="/" variant="primary" size="lg" className="rounded-pill px-5 btn-gradient">
        Go Back Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;
