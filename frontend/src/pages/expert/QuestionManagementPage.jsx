import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaEyeSlash, FaEye, FaPlus, FaFileImport } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllQuestions, toggleQuestionStatus } from '../../services/question.service';
import { getAllSubjects } from '../../services/subject.service';
import { getDimensionsBySubject } from '../../services/dimension.service';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';

const QuestionManagementPage = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [dimensionFilter, setDimensionFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const data = await getAllSubjects({ page: 1, limit: 100 });
      setSubjects(data.subjects || []);
    } catch (error) {
      toast.error('Failed to load subjects');
    }
  };

  useEffect(() => {
    if (subjectFilter) {
      loadDimensions(subjectFilter);
    } else {
      setDimensions([]);
      setDimensionFilter('');
    }
  }, [subjectFilter]);

  const loadDimensions = async (subjId) => {
    try {
      const data = await getDimensionsBySubject(subjId);
      setDimensions(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getAllQuestions({ 
        page: currentPage, 
        search: searchTerm,
        subjectId: subjectFilter,
        dimensionId: dimensionFilter,
        level: levelFilter,
        status: statusFilter
      });
      setQuestions(data.questions || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, searchTerm, subjectFilter, dimensionFilter, levelFilter, statusFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleQuestionStatus(id);
      toast.success('Question visibility updated');
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Question Bank</h2>
        <div>
          <Button as={Link} to="/expert/questions/import" variant="outline-primary" className="me-2">
            <FaFileImport className="me-2" /> Import Questions
          </Button>
          <Button as={Link} to="/expert/questions/create" variant="primary">
            <FaPlus className="me-2" /> Add Question
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3 g-2">
            <Col md={3}>
              <SearchBar onSearch={handleSearch} placeholder="Search content..." />
            </Col>
            <Col md={2}>
              <Form.Select 
                value={subjectFilter}
                onChange={(e) => { setSubjectFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Subjects</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select 
                value={dimensionFilter}
                onChange={(e) => { setDimensionFilter(e.target.value); setCurrentPage(1); }}
                disabled={!subjectFilter}
              >
                <option value="">All Dimensions</option>
                {dimensions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select 
                value={levelFilter}
                onChange={(e) => { setLevelFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <Loading />
          ) : (
            <>
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Content</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.length > 0 ? (
                    questions.map((question, index) => (
                      <tr key={question.id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>{question.subjectName}</td>
                        <td title={question.content}>{truncateText(question.content)}</td>
                        <td>
                          <Badge 
                            bg={question.level === 'Easy' ? 'success' : question.level === 'Medium' ? 'warning' : 'danger'}
                          >
                            {question.level}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={question.status === 'Active' ? 'primary' : 'secondary'}>
                            {question.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => navigate(`/expert/questions/edit/${question.id}`)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant={question.status === 'Active' ? 'outline-secondary' : 'outline-info'} 
                            size="sm"
                            onClick={() => handleToggleStatus(question.id, question.status)}
                            title={question.status === 'Active' ? 'Hide' : 'Show'}
                          >
                            {question.status === 'Active' ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">No questions found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuestionManagementPage;
