import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSubjectById, createSubject, updateSubject } from '../../services/subject.service';
import { getPackagesBySubject } from '../../services/pricePackage.service';
import Loading from '../../components/Loading';

const SubjectFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tagLine: '',
    description: '',
    categoryId: '',
    thumbnailUrl: '',
    status: 'Active'
  });
  
  const [pricePackages, setPricePackages] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      fetchSubjectData();
    }
  }, [id]);

  const fetchSubjectData = async () => {
    try {
      setLoading(true);
      const subjectData = await getSubjectById(id);
      setFormData({
        title: subjectData.title || '',
        tagLine: subjectData.tagLine || '',
        description: subjectData.description || '',
        categoryId: subjectData.categoryId || '',
        thumbnailUrl: subjectData.thumbnailUrl || '',
        status: subjectData.status || 'Active'
      });
      
      const packagesData = await getPackagesBySubject(id);
      setPricePackages(packagesData || []);
    } catch (error) {
      toast.error('Failed to load course details');
      navigate('/expert/subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Active' : 'Inactive') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId) {
      toast.error('Title and Category are required');
      return;
    }
    
    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateSubject(id, formData);
        toast.success('Course updated successfully');
      } else {
        await createSubject(formData);
        toast.success('Course created successfully');
        navigate('/expert/subjects');
      }
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
        <h2>{isEditMode ? 'Edit Course' : 'Create Course'}</h2>
        <Button variant="secondary" onClick={() => navigate('/expert/subjects')}>Back to List</Button>
      </div>

      <Row>
        <Col lg={isEditMode ? 8 : 12}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Course Title <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter course title"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Tagline</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="tagLine"
                        value={formData.tagLine}
                        onChange={handleChange}
                        placeholder="Brief catchphrase"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                      <Form.Select 
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="1">IT</option>
                        <option value="2">Business</option>
                        <option value="3">Language</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Thumbnail URL</Form.Label>
                      <Form.Control 
                        type="url" 
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </Form.Group>
                  </Col>
                  
                  {formData.thumbnailUrl && (
                    <Col md={12} className="mb-3 text-center">
                      <img src={formData.thumbnailUrl} alt="Preview" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                    </Col>
                  )}

                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={5}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Detailed course description..."
                      />
                    </Form.Group>
                  </Col>

                  {isEditMode && (
                    <Col md={12} className="mb-4">
                      <Form.Check 
                        type="switch"
                        id="status-switch"
                        name="status"
                        label={`Status: ${formData.status}`}
                        checked={formData.status === 'Active'}
                        onChange={handleChange}
                      />
                    </Col>
                  )}
                </Row>

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Course'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {isEditMode && (
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Course Content</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button as={Link} to={`/expert/dimensions/${id}`} variant="outline-primary" className="text-start">
                    Manage Dimensions
                  </Button>
                  <Button as={Link} to={`/expert/lessons/${id}`} variant="outline-success" className="text-start">
                    Manage Lessons
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Price Packages (Read-Only)</h5>
              </Card.Header>
              <Card.Body>
                {pricePackages.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {pricePackages.map(pkg => (
                      <li key={pkg.id} className="list-group-item px-0">
                        <div className="fw-bold">{pkg.name}</div>
                        <div className="text-muted small">List: ${pkg.listPrice} | Sale: ${pkg.salePrice}</div>
                        <div className="text-muted small">Duration: {pkg.duration} days</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">No price packages found.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default SubjectFormPage;
