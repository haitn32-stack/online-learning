import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllSubjects } from '../../services/subject.service';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';

const SubjectManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await getAllSubjects({ 
        page: currentPage, 
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter
      });
      const subjectList = res.subjects || res.data || res.items || (Array.isArray(res) ? res : []);
      setSubjects(Array.isArray(subjectList) ? subjectList : []);
      setTotalPages(res.totalPages || res.data?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Course Management</h2>
        <Button as={Link} to="/expert/subjects/create" variant="primary">
          <FaPlus className="me-2" /> Create Course
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <SearchBar onSearch={handleSearch} placeholder="Search courses..." />
            </Col>
            <Col md={4}>
              <Form.Select 
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Categories</option>
                <option value="IT">IT</option>
                <option value="Business">Business</option>
                <option value="Language">Language</option>
              </Form.Select>
            </Col>
            <Col md={4}>
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
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                      <tr key={subject.id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>
                          <img 
                            src={subject.thumbnailUrl || 'https://via.placeholder.com/50'} 
                            alt={subject.title} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </td>
                        <td>{subject.title}</td>
                        <td>{subject.categoryName}</td>
                        <td>
                          <Badge bg={subject.status === 'Active' ? 'success' : 'secondary'}>
                            {subject.status}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={subject.isPublished ? 'success' : 'warning'} text={!subject.isPublished ? 'dark' : ''}>
                            {subject.isPublished ? 'Published' : 'Unpublished'}
                          </Badge>
                        </td>
                        <td>{new Date(subject.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => navigate(`/expert/subjects/edit/${subject.id}`)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            onClick={() => navigate(`/expert/subjects/view/${subject.id}`)}
                          >
                            <FaEye />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">No courses found.</td>
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

export default SubjectManagementPage;
