import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllQuizzes } from '../../services/quiz.service';
import { getAllSubjects } from '../../services/subject.service';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';

const QuizManagementPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects({ page: 1, limit: 100 });
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getAllQuizzes({ 
        page: currentPage, 
        search: searchTerm,
        subjectId: subjectFilter,
        level: levelFilter,
        type: typeFilter,
        status: statusFilter
      });
      setQuizzes(data.quizzes || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage, searchTerm, subjectFilter, levelFilter, typeFilter, statusFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quiz Management</h2>
        <Button as={Link} to="/expert/quizzes/create" variant="primary">
          <FaPlus className="me-2" /> Create Quiz
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3 g-2">
            <Col md={3}>
              <SearchBar onSearch={handleSearch} placeholder="Search title..." />
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
                value={levelFilter}
                onChange={(e) => { setLevelFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Mixed">Mixed</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select 
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Types</option>
                <option value="Practice">Practice</option>
                <option value="Test">Test</option>
              </Form.Select>
            </Col>
            <Col md={3}>
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
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Duration</th>
                    <th>Pass Rate</th>
                    <th>Level</th>
                    <th>Type</th>
                    <th>Questions</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.length > 0 ? (
                    quizzes.map((quiz, index) => (
                      <tr key={quiz.id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td className="fw-bold">{quiz.title}</td>
                        <td>{quiz.subjectName}</td>
                        <td>{quiz.duration} min</td>
                        <td>{quiz.passRate}%</td>
                        <td><Badge bg="info">{quiz.level}</Badge></td>
                        <td><Badge bg={quiz.type === 'Test' ? 'danger' : 'secondary'}>{quiz.type}</Badge></td>
                        <td>{quiz.questionCount}</td>
                        <td>
                          <Badge bg={quiz.status === 'Active' ? 'success' : 'secondary'}>
                            {quiz.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => navigate(`/expert/quizzes/edit/${quiz.id}`)}
                          >
                            <FaEdit />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4">No quizzes found.</td>
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

export default QuizManagementPage;
