import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createSlider, getSliderById, updateSlider } from '../../services/slider.service';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

const SliderFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    backlink: '',
    orderNum: 1,
    notes: '',
    status: 'active'
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchSlider = async () => {
        try {
          const slider = await getSliderById(id);
          setFormData({
            title: slider.title || '',
            imageUrl: slider.imageUrl || '',
            backlink: slider.backlink || '',
            orderNum: slider.orderNum || slider.order || 1,
            notes: slider.notes || '',
            status: slider.status || 'active'
          });
        } catch (error) {
          toast.error('Failed to load slider data');
          navigate('/marketing/sliders');
        } finally {
          setLoading(false);
        }
      };
      fetchSlider();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'active' : 'inactive') : value
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

    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateSlider(id, formData);
        toast.success('Slider updated successfully');
      } else {
        await createSlider(formData);
        toast.success('Slider created successfully');
      }
      navigate('/marketing/sliders');
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} slider`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Edit Slider' : 'Create New Slider'}</h2>
        <Button as={Link} to="/marketing/sliders" variant="outline-secondary">
          Back to List
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control 
                    required 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="Slider title" 
                  />
                  <Form.Control.Feedback type="invalid">
                    Title is required.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image URL *</Form.Label>
                  <Form.Control 
                    required 
                    type="text" 
                    name="imageUrl" 
                    value={formData.imageUrl} 
                    onChange={handleChange} 
                    placeholder="https://..." 
                  />
                  <Form.Control.Feedback type="invalid">
                    Image URL is required.
                  </Form.Control.Feedback>
                  {formData.imageUrl && (
                    <div className="mt-3 text-center border rounded p-2 bg-light">
                      <img 
                        src={formData.imageUrl} 
                        alt="Slider Preview" 
                        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} 
                        onError={(e) => { e.target.style.display = 'none'; toast.warn('Invalid image URL'); }} 
                      />
                    </div>
                  )}
                </Form.Group>
                
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Backlink URL</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="backlink" 
                        value={formData.backlink} 
                        onChange={handleChange} 
                        placeholder="Link to navigate when clicked" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Display Order</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="orderNum" 
                        value={formData.orderNum} 
                        onChange={handleChange} 
                        min="1" 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange} 
                    placeholder="Internal notes..." 
                  />
                </Form.Group>

                {isEditMode && (
                  <Form.Group className="mb-4 border p-3 rounded bg-light">
                    <Form.Check 
                      type="switch" 
                      id="status-switch" 
                      name="status" 
                      label="Active Status" 
                      checked={formData.status === 'active'} 
                      onChange={handleChange} 
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>

            <div className="d-flex justify-content-end border-top pt-3">
              <Button as={Link} to="/marketing/sliders" variant="secondary" className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Saving...' : (isEditMode ? 'Update Slider' : 'Create Slider')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SliderFormPage;
