import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { getPublishedSubjects } from '../../services/subject.service';
import { getPackagesBySubject } from '../../services/pricePackage.service';
import { truncateText, formatCurrency } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        category: selectedCategory
      };
      
      const res = await getPublishedSubjects(params);
      const subjectsData = Array.isArray(res.data) ? res.data : (Array.isArray(res.items) ? res.items : (Array.isArray(res.data?.subjects) ? res.data.subjects : []));
      setTotalPages(res.totalPages || res.data?.totalPages || 1);
      
      const subjectsWithPrice = await Promise.all(subjectsData.map(async (sub) => {
        try {
          const pkgRes = await getPackagesBySubject(sub.id);
          const pkgs = Array.isArray(pkgRes.data) ? pkgRes.data : (Array.isArray(pkgRes.items) ? pkgRes.items : []);
          return { ...sub, pricePackage: pkgs.length > 0 ? pkgs[0] : null };
        } catch (err) {
          return { ...sub, pricePackage: null };
        }
      }));
      
      setCourses(subjectsWithPrice);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchQuery, selectedCategory]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="course-list-page bg-light min-vh-100 py-4">
      <Container>
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Courses</Breadcrumb.Item>
        </Breadcrumb>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Our Courses</h2>
        </div>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={8}>
                <SearchBar onSearch={handleSearch} placeholder="Search courses by title..." />
              </Col>
              <Col md={4}>
                <div className="d-flex align-items-center">
                  <FaFilter className="text-muted me-2" />
                  <Form.Select 
                    value={selectedCategory} 
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">All Categories</option>
                    <option value="IT">IT & Software</option>
                    <option value="Business">Business</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </Form.Select>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {loading ? (
          <Loading />
        ) : courses.length === 0 ? (
          <Card className="border-0 shadow-sm text-center py-5">
            <Card.Body>
              <h4 className="text-muted">No courses found matching your criteria.</h4>
              <Button variant="primary" className="mt-3" onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}>
                Clear Filters
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            <Row className="g-4 mb-5">
              {(Array.isArray(courses) ? courses : []).map(course => (
                <Col key={course.id} xs={12} md={6} lg={4}>
                  <Card className="h-100 shadow-sm border-0 hover-shadow transition">
                    <Link to={`/courses/${course.id}`} className="text-decoration-none text-dark">
                      <Card.Img variant="top" src={course.thumbnail || 'https://via.placeholder.com/300x200?text=Course'} style={{ height: '200px', objectFit: 'cover' }} />
                      <Card.Body className="d-flex flex-column">
                        <div className="mb-2">
                          <Badge bg="info">{course.category?.name || 'General'}</Badge>
                        </div>
                        <Card.Title className="fw-bold">{course.title}</Card.Title>
                        <Card.Text className="text-muted small flex-grow-1">
                          {truncateText(course.tagline, 80)}
                        </Card.Text>
                        <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                          <div className="fw-bold text-primary">
                            {course.pricePackage ? (
                              course.pricePackage.salePrice ? (
                                <span>{formatCurrency(course.pricePackage.salePrice)}</span>
                              ) : (
                                <span>{formatCurrency(course.pricePackage.listPrice)}</span>
                              )
                            ) : (
                              <span>Free / TBD</span>
                            )}
                          </div>
                          <span className="text-muted small">{course.lessonCount || 0} Lessons</span>
                        </div>
                      </Card.Body>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default CourseListPage;
