import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register as registerService } from '../../services/auth.service';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (form.checkValidity() === false || !formData.agreeTerms) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await registerService({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      
      toast.success('Registration successful! Please check your email to verify your account.');
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        agreeTerms: false
      });
      setValidated(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Row className="justify-content-center py-5">
          <Col md={8} lg={7} xl={6}>
            <Card className="shadow-lg border-0 rounded-lg">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h3 className="font-weight-light my-2">EduLearn</h3>
                <p className="mb-0">Create a new account</p>
              </Card.Header>
              <Card.Body className="p-5">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required 
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your full name.
                    </Form.Control.Feedback>
                  </Form.Group>

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

                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control 
                      type="tel" 
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid phone number.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          isInvalid={!!passwordError}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          isInvalid={!!passwordError}
                        />
                        <Form.Control.Feedback type="invalid">
                          {passwordError || 'Please confirm your password.'}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4" controlId="agreeTerms">
                    <Form.Check 
                      type="checkbox" 
                      name="agreeTerms"
                      label={<span>I agree to the <Link to="/terms">Terms & Conditions</Link></span>}
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      feedback="You must agree before submitting."
                      feedbackType="invalid"
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Registering...</>
                      ) : (
                        'Register'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center py-3 bg-light">
                <div className="small">
                  Already have an account? <Link to="/login">Go to login</Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
