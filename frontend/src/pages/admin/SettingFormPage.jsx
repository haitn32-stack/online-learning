import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSettingById, createSetting, updateSetting } from '../../services/setting.service';
import Loading from '../../components/Loading';

const SettingFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    settingType: 'System',
    settingKey: '',
    settingValue: '',
    orderNum: 1,
    status: 'Active'
  });

  const commonTypes = ['Role', 'Subject Category', 'System', 'Email Template'];

  useEffect(() => {
    if (isEditMode) {
      const fetchSetting = async () => {
        try {
          const data = await getSettingById(id);
          setFormData({
            settingType: data.settingType || 'System',
            settingKey: data.settingKey || '',
            settingValue: data.settingValue || '',
            orderNum: data.orderNum || 1,
            status: data.status || 'Active'
          });
        } catch (error) {
          toast.error('Failed to load setting details');
          navigate('/admin/settings');
        } finally {
          setLoading(false);
        }
      };
      fetchSetting();
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
    if (!formData.settingType || !formData.settingKey || !formData.settingValue) {
      toast.error('Type, Key, and Value are required');
      return;
    }
    
    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateSetting(id, formData);
        toast.success('Setting updated successfully');
      } else {
        await createSetting(formData);
        toast.success('Setting created successfully');
      }
      navigate('/admin/settings');
    } catch (error) {
      toast.error(error.message || 'An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Edit Setting' : 'Add Setting'}</h2>
        <Button variant="secondary" onClick={() => navigate('/admin/settings')}>Back to List</Button>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Alert variant="warning" className="mb-4">
                <strong>Warning:</strong> Setting Keys must be unique within the same Setting Type. Altering system-critical settings may affect application behavior.
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Setting Type <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        as="select"
                        name="settingType"
                        value={formData.settingType}
                        onChange={handleChange}
                        required
                        list="type-options"
                      >
                        {commonTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Control>
                      {/* Using a datalist could also work if we want users to type custom categories, but select is safer */}
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Setting Key <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        name="settingKey"
                        value={formData.settingKey}
                        onChange={handleChange}
                        required
                        placeholder="e.g. MAX_FILE_SIZE"
                        disabled={isEditMode} // Usually keys shouldn't be changed to prevent orphans
                      />
                      {isEditMode && <Form.Text className="text-muted">Key cannot be changed.</Form.Text>}
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Setting Value <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4}
                        name="settingValue"
                        value={formData.settingValue}
                        onChange={handleChange}
                        required
                        placeholder="Value content"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Group>
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

                  {isEditMode && (
                    <Col md={12} className="mb-4 mt-2">
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

                <div className="d-flex justify-content-end mt-3">
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Setting'}
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

export default SettingFormPage;
