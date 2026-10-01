import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getQuestionById, createQuestion, updateQuestion } from '../../services/question.service';
import { getAllSubjects } from '../../services/subject.service';
import { getDimensionsBySubject } from '../../services/dimension.service';
import Loading from '../../components/Loading';

const QuestionFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  
  const [formData, setFormData] = useState({
    subjectId: '',
    dimensionId: '',
    level: 'Easy',
    content: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const subjData = await getAllSubjects({ page: 1, limit: 100 });
      setSubjects(subjData.subjects || []);
      
      if (isEditMode) {
        const questionData = await getQuestionById(id);
        setFormData({
          subjectId: questionData.subjectId || '',
          dimensionId: questionData.dimensionId || '',
          level: questionData.level || 'Easy',
          content: questionData.content || '',
          optionA: questionData.optionA || '',
          optionB: questionData.optionB || '',
          optionC: questionData.optionC || '',
          optionD: questionData.optionD || '',
          correctAnswer: questionData.correctAnswer || 'A',
          explanation: questionData.explanation || ''
        });
        
        if (questionData.subjectId) {
          loadDimensions(questionData.subjectId);
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error('Failed to load data');
      if (isEditMode) navigate('/expert/questions');
    }
  };

  const loadDimensions = async (subjId) => {
    try {
      const data = await getDimensionsBySubject(subjId);
      setDimensions(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'subjectId') {
      setFormData(prev => ({ ...prev, dimensionId: '' }));
      if (value) {
        loadDimensions(value);
      } else {
        setDimensions([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subjectId || !formData.content || !formData.optionA || !formData.optionB || !formData.correctAnswer) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateQuestion(id, formData);
        toast.success('Question updated successfully');
      } else {
        await createQuestion(formData);
        toast.success('Question created successfully');
      }
      navigate('/expert/questions');
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
        <h2>{isEditMode ? 'Edit Question' : 'Create Question'}</h2>
        <Button variant="secondary" onClick={() => navigate('/expert/questions')}>Back to List</Button>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
                      <Form.Select 
                        name="subjectId"
                        value={formData.subjectId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Dimension</Form.Label>
                      <Form.Select 
                        name="dimensionId"
                        value={formData.dimensionId}
                        onChange={handleChange}
                        disabled={!formData.subjectId}
                      >
                        <option value="">Select Dimension</option>
                        {dimensions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Level <span className="text-danger">*</span></Form.Label>
                      <Form.Select 
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-4">
                    <Form.Group>
                      <Form.Label>Question Content <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4}
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        placeholder="Enter the question text"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <h6 className="border-bottom pb-2">Answer Options</h6>
                  </Col>

                  {['A', 'B', 'C', 'D'].map(opt => (
                    <Col md={6} className="mb-3" key={opt}>
                      <Form.Group>
                        <div className="d-flex align-items-center mb-1">
                          <Form.Check 
                            type="radio" 
                            name="correctAnswer"
                            id={`opt${opt}`}
                            value={opt}
                            checked={formData.correctAnswer === opt}
                            onChange={handleChange}
                            className="me-2"
                          />
                          <Form.Label className="mb-0 fw-bold" htmlFor={`opt${opt}`}>Option {opt}</Form.Label>
                        </div>
                        <Form.Control 
                          type="text" 
                          name={`option${opt}`}
                          value={formData[`option${opt}`]}
                          onChange={handleChange}
                          required={opt === 'A' || opt === 'B'}
                          placeholder={`Text for option ${opt}`}
                        />
                      </Form.Group>
                    </Col>
                  ))}

                  <Col md={12} className="mb-4 mt-3">
                    <Form.Group>
                      <Form.Label>Explanation (Optional)</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        name="explanation"
                        value={formData.explanation}
                        onChange={handleChange}
                        placeholder="Explain why the answer is correct"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Question'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Visual Preview</h5>
            </Card.Header>
            <Card.Body>
              {formData.content ? (
                <>
                  <p className="fw-bold mb-3">{formData.content}</p>
                  <div className="d-flex flex-column gap-2 mb-3">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const text = formData[`option${opt}`];
                      if (!text) return null;
                      const isCorrect = formData.correctAnswer === opt;
                      return (
                        <div key={opt} className={`p-2 border rounded ${isCorrect ? 'bg-success text-white border-success' : 'bg-light'}`}>
                          <strong>{opt}.</strong> {text}
                        </div>
                      )
                    })}
                  </div>
                  {formData.explanation && (
                    <div className="p-3 bg-info bg-opacity-10 rounded border border-info">
                      <strong>Explanation:</strong><br/>
                      {formData.explanation}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted text-center my-4">Start typing to see preview</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionFormPage;
