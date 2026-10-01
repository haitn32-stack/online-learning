import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../services/auth.service';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(token, formData.password);
      toast.success('Password has been successfully reset! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. The link might be expired.');
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
                <h3 className="font-weight-light my-2">Set New Password</h3>
              </Card.Header>
              <Card.Body className="p-5">
                <div className="small mb-4 text-muted text-center">
                  Please enter your new password below.
                </div>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
                      required 
                      isInvalid={!!errorMsg}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required 
                      isInvalid={!!errorMsg}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errorMsg || 'Please confirm your password.'}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...</>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center py-3 bg-light">
                <div className="small">
                  <Link to="/login">Return to login</Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
