import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getQuizById, createQuiz, updateQuiz } from '../../services/quiz.service';
import { getAllSubjects } from '../../services/subject.service';
import Loading from '../../components/Loading';

const QuizFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    duration: 30,
    passRate: 60,
    level: 'Mixed',
    type: 'Practice',
    questionCount: 10,
    status: 'Active'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const subjData = await getAllSubjects({ page: 1, limit: 100 });
      setSubjects(subjData.subjects || []);
      
      if (isEditMode) {
        const quizData = await getQuizById(id);
        setFormData({
          title: quizData.title || '',
          subjectId: quizData.subjectId || '',
          duration: quizData.duration || 30,
          passRate: quizData.passRate || 60,
          level: quizData.level || 'Mixed',
          type: quizData.type || 'Practice',
          questionCount: quizData.questionCount || 10,
          status: quizData.status || 'Active'
        });
        setLoading(false);
      }
    } catch (error) {
      toast.error('Failed to load data');
      if (isEditMode) navigate('/expert/quizzes');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;
    
    if (type === 'checkbox') {
      finalValue = checked ? 'Active' : 'Inactive';
    } else if (type === 'number') {
      finalValue = parseInt(value, 10);
      if (isNaN(finalValue)) finalValue = '';
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subjectId) {
      toast.error('Title and Subject are required');
      return;
    }
    
    if (formData.passRate < 0 || formData.passRate > 100) {
      toast.error('Pass rate must be between 0 and 100');
      return;
    }
    
    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateQuiz(id, formData);
        toast.success('Quiz updated successfully');
      } else {
        await createQuiz(formData);
        toast.success('Quiz created successfully');
      }
      navigate('/expert/quizzes');
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
        <h2>{isEditMode ? 'Edit Quiz' : 'Create Quiz'}</h2>
        <Button variant="secondary" onClick={() => navigate('/expert/quizzes')}>Back to List</Button>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <strong>Note:</strong> Questions will be automatically selected from the question bank based on the chosen subject, level, and question count.
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Quiz Title <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Midterm Test, Chapter 1 Practice"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
                      <Form.Select 
                        name="subjectId"
                        value={formData.subjectId}
                        onChange={handleChange}
                        required
                        disabled={isEditMode}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                      </Form.Select>
                      {isEditMode && <Form.Text className="text-muted">Subject cannot be changed after creation.</Form.Text>}
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select 
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="Practice">Practice</option>
                        <option value="Test">Test</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Level Settings <span className="text-danger">*</span></Form.Label>
                      <Form.Select 
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                      >
                        <option value="Mixed">Mixed (All levels)</option>
                        <option value="Easy">Easy Only</option>
                        <option value="Medium">Medium Only</option>
                        <option value="Hard">Hard Only</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Number of Questions <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="number" 
                        name="questionCount"
                        value={formData.questionCount}
                        onChange={handleChange}
                        required
                        min="1"
                        max="100"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Duration (Minutes) <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="number" 
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        min="1"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Pass Rate (%) <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="number" 
                        name="passRate"
                        value={formData.passRate}
                        onChange={handleChange}
                        required
                        min="0"
                        max="100"
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
                    {submitting ? 'Saving...' : 'Save Quiz'}
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

export default QuizFormPage;
