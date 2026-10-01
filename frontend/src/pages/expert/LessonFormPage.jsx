import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getLessonById, createLesson, updateLesson } from '../../services/lesson.service';
import Loading from '../../components/Loading';

const LessonFormPage = () => {
  const { subjectId, id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    orderNum: 1,
    status: 'Active',
    subjectId: subjectId || ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchLesson = async () => {
        try {
          const data = await getLessonById(id);
          setFormData({
            title: data.title || '',
            content: data.content || '',
            videoUrl: data.videoUrl || '',
            orderNum: data.orderNum || 1,
            status: data.status || 'Active',
            subjectId: data.subjectId || ''
          });
        } catch (error) {
          toast.error('Failed to load lesson details');
          navigate(-1);
        } finally {
          setLoading(false);
        }
      };
      fetchLesson();
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
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }
    
    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateLesson(id, formData);
        toast.success('Lesson updated successfully');
        navigate(`/expert/lessons/${formData.subjectId}`);
      } else {
        await createLesson(formData);
        toast.success('Lesson created successfully');
        navigate(`/expert/lessons/${subjectId}`);
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  const renderVideoPreview = () => {
    if (!formData.videoUrl) return null;
    
    // Simple check for youtube URL
    let embedUrl = null;
    if (formData.videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = formData.videoUrl.split('v=')[1]?.split('&')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (formData.videoUrl.includes('youtu.be/')) {
      const videoId = formData.videoUrl.split('youtu.be/')[1];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    if (embedUrl) {
      return (
        <div className="mt-3">
          <p className="mb-1 text-muted">Video Preview:</p>
          <div className="ratio ratio-16x9">
            <iframe src={embedUrl} title="Video Preview" allowFullScreen></iframe>
          </div>
        </div>
      );
    }
    return <div className="mt-2 text-muted small">Cannot preview this video URL.</div>;
  };

  if (loading) return <Loading />;

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Edit Lesson' : 'Create Lesson'}</h2>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8} className="mb-3">
                    <Form.Group>
                      <Form.Label>Lesson Title <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter lesson title"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Order Number</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="orderNum"
                        value={formData.orderNum}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Video URL (Optional)</Form.Label>
                      <Form.Control 
                        type="url" 
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        placeholder="e.g., YouTube URL"
                      />
                      {renderVideoPreview()}
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Content / Reading Material</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={8}
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Lesson content, markdown or HTML supported depending on implementation..."
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
                    {submitting ? 'Saving...' : 'Save Lesson'}
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

export default LessonFormPage;
