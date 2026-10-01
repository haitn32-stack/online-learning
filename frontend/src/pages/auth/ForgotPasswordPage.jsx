import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '../../services/auth.service';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validated, setValidated] = useState(false);

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
      await requestPasswordReset(email);
      setIsSuccess(true);
      toast.success('Password reset link sent to your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request. Please try again later.');
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
                <h3 className="font-weight-light my-2">Password Recovery</h3>
              </Card.Header>
              <Card.Body className="p-5">
                {isSuccess ? (
                  <div className="text-center">
                    <Alert variant="success">
                      If an account exists with {email}, you will receive a password reset link shortly.
                    </Alert>
                    <p className="mt-4 mb-0">
                      <Link to="/login" className="btn btn-primary">Return to Login</Link>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="small mb-4 text-muted text-center">
                      Enter your email address and we will send you a link to reset your password.
                    </div>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                      <Form.Group className="mb-4" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                          type="email" 
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a valid email address.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" size="lg" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Sending...</>
                          ) : (
                            'Reset Password'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </Card.Body>
              <Card.Footer className="text-center py-3 bg-light">
                <div className="small">
                  <Link to="/login">Return to login</Link> | <Link to="/register">Need an account?</Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
