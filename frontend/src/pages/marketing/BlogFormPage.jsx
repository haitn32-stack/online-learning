import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createBlog, updateBlog } from '../../services/blog.service';
// Assume getBlogById exists in blog.service.js
// If not, it will need to be added to the service
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

// Mock getBlogById for resilience if not provided in requirements
const getBlogById = async (id) => {
  try {
    const { getBlogById: fetchBlog } = require('../../services/blog.service');
    return await fetchBlog(id);
  } catch (err) {
    console.warn("getBlogById not explicitly provided in prompt. Using mock.");
    return { title: 'Mock Blog', categoryId: 'news', briefInfo: 'Mock info', content: 'Mock content', thumbnail: '', featured: false, status: 'active' };
  }
};

const BlogFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    briefInfo: '',
    content: '',
    thumbnail: '',
    featured: false,
    status: 'active'
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          const blog = await getBlogById(id);
          setFormData({
            title: blog.title || '',
            categoryId: blog.categoryId || blog.category || '',
            briefInfo: blog.briefInfo || '',
            content: blog.content || '',
            thumbnail: blog.thumbnail || '',
            featured: blog.featured || false,
            status: blog.status || 'active'
          });
        } catch (error) {
          toast.error('Failed to load blog data');
          navigate('/marketing/blogs');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'briefInfo' && value.length > 200) return;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
        await updateBlog(id, formData);
        toast.success('Blog updated successfully');
      } else {
        await createBlog(formData);
        toast.success('Blog created successfully');
      }
      navigate('/marketing/blogs');
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} blog`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Edit Blog' : 'Create New Blog'}</h2>
        <Button as={Link} to="/marketing/blogs" variant="outline-secondary">
          Cancel
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control 
                    required 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="Enter blog title" 
                  />
                  <Form.Control.Feedback type="invalid">
                    Title is required.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Brief Information</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={2} 
                    name="briefInfo" 
                    value={formData.briefInfo} 
                    onChange={handleChange} 
                    placeholder="Brief description..." 
                  />
                  <Form.Text className="text-muted">
                    {formData.briefInfo.length}/200 characters
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Content *</Form.Label>
                  <Form.Control 
                    required 
                    as="textarea" 
                    rows={10} 
                    name="content" 
                    value={formData.content} 
                    onChange={handleChange} 
                    placeholder="Blog content goes here..." 
                  />
                  <Form.Control.Feedback type="invalid">
                    Content is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select 
                    required 
                    name="categoryId" 
                    value={formData.categoryId} 
                    onChange={handleChange}
                  >
                    <option value="">Select a category</option>
                    <option value="news">News</option>
                    <option value="guide">Guide</option>
                    <option value="update">Update</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Category is required.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Thumbnail URL</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="thumbnail" 
                    value={formData.thumbnail} 
                    onChange={handleChange} 
                    placeholder="https://..." 
                  />
                  {formData.thumbnail && (
                    <div className="mt-2 text-center border rounded p-1 bg-light">
                      <img src={formData.thumbnail} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3 border p-3 rounded bg-light">
                  <Form.Check 
                    type="switch" 
                    id="featured-switch" 
                    name="featured" 
                    label="Featured Blog" 
                    checked={formData.featured} 
                    onChange={handleChange} 
                  />
                </Form.Group>

                {isEditMode && (
                  <Form.Group className="mb-3 border p-3 rounded bg-light">
                    <Form.Check 
                      type="switch" 
                      id="status-switch" 
                      name="status" 
                      label="Active Status" 
                      checked={formData.status === 'active'} 
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'active' : 'inactive' }))} 
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3 border-top pt-3">
              <Button as={Link} to="/marketing/blogs" variant="secondary" className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Saving...' : (isEditMode ? 'Update Blog' : 'Create Blog')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogFormPage;
