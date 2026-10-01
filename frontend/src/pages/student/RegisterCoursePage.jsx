import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPublishedSubjectById } from '../../services/subject.service';
import { getPackagesBySubject } from '../../services/pricePackage.service';
import { createRegistration } from '../../services/registration.service';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import Loading from '../../components/Loading';

const RegisterCoursePage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, packagesRes] = await Promise.all([
          getPublishedSubjectById(subjectId),
          getPackagesBySubject(subjectId)
        ]);
        setCourse(courseRes);
        setPackages(packagesRes || []);
      } catch (error) {
        toast.error('Failed to load course details');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    if (subjectId) fetchData();
  }, [subjectId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage) {
      toast.warning('Please select a price package');
      return;
    }

    try {
      setSubmitting(true);
      await createRegistration({
        subjectId,
        packageId: selectedPackage.id,
        notes
      });
      toast.success('Registration submitted successfully');
      navigate('/student/my-registrations');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!course) return null;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Course Registration</h2>
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex flex-column flex-md-row gap-3">
                <img 
                  src={course.thumbnailUrl || 'https://via.placeholder.com/300x200'} 
                  alt={course.title} 
                  className="rounded"
                  style={{ width: '100%', maxWidth: '300px', objectFit: 'cover' }} 
                />
                <div>
                  <h4>{course.title}</h4>
                  <p className="text-muted">{course.briefInfo}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <h5 className="mb-3">Select a Package</h5>
          {packages.length === 0 ? (
            <div className="alert alert-warning">No packages available for this course.</div>
          ) : (
            <Row className="g-3 mb-4">
              {packages.map((pkg) => (
                <Col md={6} key={pkg.id}>
                  <Card 
                    className={`h-100 cursor-pointer transition-all ${selectedPackage?.id === pkg.id ? 'border-primary border-2 shadow' : 'border-secondary'}`}
                    onClick={() => setSelectedPackage(pkg)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body>
                      <Form.Check 
                        type="radio" 
                        id={`pkg-${pkg.id}`}
                        name="packageRadio"
                        checked={selectedPackage?.id === pkg.id}
                        onChange={() => setSelectedPackage(pkg)}
                        label={<span className="fw-bold fs-5">{pkg.name}</span>}
                        className="mb-2"
                      />
                      <div className="ms-4">
                        <p className="mb-1 text-muted"><small>Duration: {formatDuration(pkg.duration)}</small></p>
                        <div className="mb-2">
                          <span className="fs-5 fw-bold text-primary">{formatCurrency(pkg.salePrice)}</span>
                          {pkg.listPrice > pkg.salePrice && (
                            <span className="text-muted text-decoration-line-through ms-2">
                              {formatCurrency(pkg.listPrice)}
                            </span>
                          )}
                        </div>
                        <p className="mb-0 text-muted small">{pkg.description}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        <Col md={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Course:</span>
                <span className="fw-semibold text-end">{course.title}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Package:</span>
                <span className="fw-semibold text-end">{selectedPackage ? selectedPackage.name : 'None selected'}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5">Total Cost:</span>
                <span className="fs-4 fw-bold text-primary">
                  {selectedPackage ? formatCurrency(selectedPackage.salePrice) : formatCurrency(0)}
                </span>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Optional Notes</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Any specific requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100" 
                  size="lg"
                  disabled={!selectedPackage || submitting}
                >
                  {submitting ? <Spinner size="sm" /> : 'Submit Registration'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterCoursePage;
