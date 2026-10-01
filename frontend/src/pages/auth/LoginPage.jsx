import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { login as loginService } from '../../services/auth.service';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await loginService(formData.email, formData.password);
      
      // Assume response contains user data and token
      await login(response.data);
      toast.success('Login successful!');

      const role = response.data.user?.role || 'Student';
      switch (role) {
        case 'Admin':
          navigate('/admin/users');
          break;
        case 'Marketing':
          navigate('/marketing/dashboard');
          break;
        case 'Sale':
          navigate('/sale/registrations');
          break;
        case 'Expert':
          navigate('/expert/subjects');
          break;
        case 'Student':
        default:
          navigate('/');
          break;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-lg mt-5 mb-5">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h3 className="font-weight-light my-2">EduLearn</h3>
                <p className="mb-0">Login to your account</p>
              </Card.Header>
              <Card.Body className="p-5">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email address.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your password.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                    <Form.Check 
                      type="checkbox" 
                      name="rememberMe"
                      id="rememberMe"
                      label="Remember me" 
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Logging in...</>
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center py-3 bg-light">
                <div className="small">
                  Need an account? <Link to="/register">Sign up!</Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
