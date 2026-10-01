import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { createRegistrationByStaff } from '../../services/registration.service';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

// Mocks for users/subjects retrieval since specific services weren't listed in prompt
const mockSearchUsers = async (query) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ].filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())));
    }, 500);
  });
};

const mockGetSubjects = async () => {
  return [
    { id: 1, title: 'React Fundamentals' },
    { id: 2, title: 'Advanced JavaScript' }
  ];
};

const mockGetPackages = async (subjectId) => {
  return [
    { id: 1, name: 'Basic Package', duration: 3, price: 99.99 },
    { id: 2, name: 'Pro Package', duration: 6, price: 179.99 },
    { id: 3, name: 'Premium Package', duration: 12, price: 299.99 }
  ];
};

const RegistrationFormPage = () => {
  const navigate = useNavigate();
  
  const [submitting, setSubmitting] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const [subjects, setSubjects] = useState([]);
  const [packages, setPackages] = useState([]);
  
  const [formData, setFormData] = useState({
    userId: '',
    userDisplay: '',
    subjectId: '',
    packageId: '',
    notes: ''
  });

  const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // Replace with actual service call
        const data = await mockGetSubjects();
        setSubjects(data);
      } catch (error) {
        toast.error('Failed to load subjects');
      }
    };
    fetchSubjects();
  }, []);

  // Debounced user search
  useEffect(() => {
    if (!userQuery || userQuery === formData.userDisplay) {
      setUsers([]);
      setShowUserDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await mockSearchUsers(userQuery);
      setUsers(results);
      setShowUserDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [userQuery, formData.userDisplay]);

  // Load packages when subject changes
  useEffect(() => {
    if (!formData.subjectId) {
      setPackages([]);
      setFormData(prev => ({ ...prev, packageId: '' }));
      setSelectedPackageDetails(null);
      return;
    }

    const fetchPackages = async () => {
      try {
        // Replace with actual service call
        const data = await mockGetPackages(formData.subjectId);
        setPackages(data);
        setFormData(prev => ({ ...prev, packageId: '' }));
        setSelectedPackageDetails(null);
      } catch (error) {
        toast.error('Failed to load packages');
      }
    };
    fetchPackages();
  }, [formData.subjectId]);

  const handleSelectUser = (user) => {
    setFormData(prev => ({ ...prev, userId: user.id, userDisplay: `${user.name} (${user.email})` }));
    setUserQuery(`${user.name} (${user.email})`);
    setShowUserDropdown(false);
  };

  const handleSelectPackage = (pkg) => {
    setFormData(prev => ({ ...prev, packageId: pkg.id }));
    setSelectedPackageDetails(pkg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.subjectId || !formData.packageId) {
      toast.warning('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createRegistrationByStaff({
        userId: formData.userId,
        subjectId: formData.subjectId,
        packageId: formData.packageId,
        notes: formData.notes
      });
      toast.success('Registration created successfully');
      navigate(`/sale/registrations/${response?.id || ''}`); // Navigate to details or list
    } catch (error) {
      toast.error('Failed to create registration');
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Create New Registration</h2>
        <Button as={Link} to="/sale/registrations" variant="outline-secondary">
          Cancel
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">1. Select Student</h5>
              <Form.Group className="position-relative">
                <Form.Label>Search Student by Name or Email *</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Type to search..." 
                  value={userQuery}
                  onChange={(e) => {
                    setUserQuery(e.target.value);
                    if (formData.userId) setFormData(prev => ({ ...prev, userId: '' }));
                  }}
                  isInvalid={!!userQuery && !formData.userId && !showUserDropdown && userQuery.length > 2}
                />
                
                {showUserDropdown && users.length > 0 && (
                  <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                    {users.map(user => (
                      <ListGroup.Item 
                        key={user.id} 
                        action 
                        onClick={() => handleSelectUser(user)}
                      >
                        <strong>{user.name}</strong> - <span className="text-muted">{user.email}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
                {showUserDropdown && users.length === 0 && userQuery.length > 2 && (
                  <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1000 }}>
                    <ListGroup.Item className="text-muted">No users found</ListGroup.Item>
                  </ListGroup>
                )}
              </Form.Group>
            </div>

            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">2. Select Subject</h5>
              <Form.Group>
                <Form.Label>Course/Subject *</Form.Label>
                <Form.Select 
                  value={formData.subjectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjectId: e.target.value }))}
                >
                  <option value="">-- Select a Subject --</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.title}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            {packages.length > 0 && (
              <div className="mb-4">
                <h5 className="border-bottom pb-2 mb-3">3. Select Package</h5>
                <Row className="g-3">
                  {packages.map(pkg => (
                    <Col md={4} key={pkg.id}>
                      <Card 
                        className={`h-100 cursor-pointer transition-all ${formData.packageId === pkg.id ? 'border-primary border-2 bg-light' : 'border'}`}
                        onClick={() => handleSelectPackage(pkg)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="text-center">
                          <h6 className="mb-3">{pkg.name}</h6>
                          <div className="fs-3 fw-bold text-primary mb-2">
                            {formatCurrency(pkg.price)}
                          </div>
                          <div className="text-muted small">
                            {pkg.duration} months access
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">4. Additional Details</h5>
              <Form.Group>
                <Form.Label>Staff Notes</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Any internal notes regarding this manual registration..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </Form.Group>
            </div>

            {formData.userId && formData.subjectId && formData.packageId && selectedPackageDetails && (
              <Card className="mb-4 bg-light border-0">
                <Card.Body>
                  <h5 className="mb-3">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Student:</span>
                    <span className="fw-bold">{formData.userDisplay}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Package:</span>
                    <span className="fw-bold">{selectedPackageDetails.name} ({selectedPackageDetails.duration} months)</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fs-5 fw-bold">
                    <span>Total Cost:</span>
                    <span className="text-success">{formatCurrency(selectedPackageDetails.price)}</span>
                  </div>
                </Card.Body>
              </Card>
            )}

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button as={Link} to="/sale/registrations" variant="secondary" className="me-md-2">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={submitting || !formData.userId || !formData.subjectId || !formData.packageId}
              >
                {submitting ? 'Creating...' : 'Submit Registration'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegistrationFormPage;
