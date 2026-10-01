import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import { changePassword } from '../../services/user.service';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    return score;
  };

  const strength = getPasswordStrength(formData.newPassword);
  let strengthColor = 'danger';
  if (strength > 50) strengthColor = 'warning';
  if (strength > 75) strengthColor = 'success';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0"><FaLock className="me-2" /> Change Password</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="currentPassword" 
                    value={formData.currentPassword} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="newPassword" 
                    value={formData.newPassword} 
                    onChange={handleChange} 
                    required 
                  />
                  {formData.newPassword && (
                    <div className="mt-2">
                      <small className="text-muted mb-1 d-block">Password Strength</small>
                      <ProgressBar now={strength} variant={strengthColor} style={{ height: '5px' }} />
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    required 
                  />
                  {error && <Form.Text className="text-danger">{error}</Form.Text>}
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
                  {submitting ? <Spinner size="sm" /> : 'Change Password'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePasswordPage;
