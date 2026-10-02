import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserById, createUser, updateUser } from '../../services/user.service';
import Loading from '../../components/Loading';

const UserFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Male',
    role: 'Student',
    status: 'Active'
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          const data = await getUserById(id);
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            password: '', // Never populate password
            phone: data.phone || '',
            gender: data.gender || 'Male',
            role: data.role || 'Student',
            status: data.status || 'Active'
          });
        } catch (error) {
          toast.error('Failed to load user details');
          navigate('/admin/users');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Active' : 'Inactive') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.role) {
      toast.error('Full Name and Role are required');
      return;
    }
    
    if (!isEditMode && (!formData.email || !formData.password)) {
      toast.error('Email and Password are required for new users');
      return;
    }
    
    try {
      setSubmitting(true);
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.phone) delete dataToSubmit.phone;
      if (isEditMode) {
        // Don't send empty password on edit
        if (!dataToSubmit.password) delete dataToSubmit.password;
        await updateUser(id, dataToSubmit);
        toast.success('User updated successfully');
      } else {
        await createUser(dataToSubmit);
        toast.success('User created successfully');
      }
      navigate('/admin/users');
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;
      let errMsg = 'An error occurred while saving';
      if (validationErrors && Array.isArray(validationErrors)) {
        errMsg = validationErrors.map(err => err.msg).join(', ');
      } else if (serverMsg) {
        errMsg = serverMsg;
      } else if (error.message) {
        errMsg = error.message;
      }
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Edit User' : 'Create User'}</h2>
        <Button variant="secondary" onClick={() => navigate('/admin/users')}>Back to List</Button>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email <span className="text-danger">{!isEditMode && '*'}</span></Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required={!isEditMode}
                        readOnly={isEditMode}
                        disabled={isEditMode}
                        placeholder="john@example.com"
                      />
                      {isEditMode && <Form.Text className="text-muted">Email cannot be changed.</Form.Text>}
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Password <span className="text-danger">{!isEditMode && '*'}</span></Form.Label>
                      <Form.Control 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isEditMode}
                        placeholder={isEditMode ? "Leave blank to keep unchanged" : "••••••••"}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                      <Form.Select 
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="Admin">Admin</option>
                        <option value="Student">Student</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Expert">Expert</option>
                        <option value="Sale">Sale</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {isEditMode && (
                    <Col md={12} className="mb-4 mt-2">
                      <Form.Check 
                        type="switch"
                        id="status-switch"
                        name="status"
                        label={`Account Status: ${formData.status}`}
                        checked={formData.status === 'Active'}
                        onChange={handleChange}
                      />
                    </Col>
                  )}
                </Row>

                <div className="d-flex justify-content-end mt-3">
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save User'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserFormPage;
