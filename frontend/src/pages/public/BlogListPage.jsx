import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaCalendar, FaUser, FaArrowRight, FaList, FaTh } from 'react-icons/fa';
import { getPublicBlogs } from '../../services/blog.service';
import { truncateText, formatDate } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        category: selectedCategory
      };
      
      const res = await getPublicBlogs(params);
      const blogsData = Array.isArray(res.data) ? res.data : (Array.isArray(res.items) ? res.items : (Array.isArray(res.data?.blogs) ? res.data.blogs : []));
      setBlogs(blogsData);
      setTotalPages(res.totalPages || res.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
    <div className="blog-list-page bg-light min-vh-100 py-4">
      <Container>
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Blog & Articles</Breadcrumb.Item>
        </Breadcrumb>

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 className="fw-bold mb-0">Blog & Articles</h2>
          <div className="d-flex align-items-center gap-2 bg-white rounded shadow-sm p-1">
            <Button 
              variant={viewMode === 'grid' ? 'primary' : 'light'} 
              size="sm" 
              onClick={() => setViewMode('grid')}
            >
              <FaTh />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'primary' : 'light'} 
              size="sm" 
              onClick={() => setViewMode('list')}
            >
              <FaList />
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm mb-5">
          <Card.Body>
            <Row className="g-3">
              <Col md={8}>
                <SearchBar onSearch={handleSearch} placeholder="Search articles by title..." />
              </Col>
              <Col md={4}>
                <div className="d-flex align-items-center">
                  <FaFilter className="text-muted me-2" />
                  <Form.Select 
                    value={selectedCategory} 
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">All Categories</option>
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                    <option value="Career">Career Development</option>
                    <option value="Tips">Study Tips</option>
                  </Form.Select>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {loading ? (
          <Loading />
        ) : blogs.length === 0 ? (
          <Card className="border-0 shadow-sm text-center py-5">
            <Card.Body>
              <h4 className="text-muted">No articles found matching your criteria.</h4>
              <Button variant="primary" className="mt-3" onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}>
                Clear Filters
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            <Row className="g-4 mb-5">
              {(Array.isArray(blogs) ? blogs : []).map(blog => (
                <Col key={blog.id} xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12}>
                  <Card className={`h-100 shadow-sm border-0 hover-shadow transition ${viewMode === 'list' ? 'flex-md-row' : ''}`}>
                    <div className={viewMode === 'list' ? 'col-md-4' : ''}>
                      <Card.Img 
                        variant={viewMode === 'list' ? 'left' : 'top'} 
                        src={blog.thumbnail || 'https://via.placeholder.com/300x200?text=Blog'} 
                        style={{ height: '200px', objectFit: 'cover', width: viewMode === 'list' ? '100%' : 'auto' }} 
                      />
                    </div>
                    <Card.Body className={`d-flex flex-column ${viewMode === 'list' ? 'col-md-8' : ''}`}>
                      <div className="d-flex align-items-center text-muted small mb-2 gap-3">
                        <span><FaCalendar className="me-1" /> {formatDate(blog.createdAt)}</span>
                        <span><FaUser className="me-1" /> {blog.author?.fullName || 'Admin'}</span>
                      </div>
                      <Card.Title className="fw-bold">{blog.title}</Card.Title>
                      <Card.Text className="text-muted flex-grow-1">
                        {truncateText(blog.briefInfo, viewMode === 'list' ? 200 : 100)}
                      </Card.Text>
                      <div className="mt-3 pt-3 border-top">
                        <Link to={`/blogs/${blog.id}`} className="text-primary fw-bold text-decoration-none">
                          Read More <FaArrowRight className="ms-1" size={12} />
                        </Link>
                      </div>
                    </Card.Body>
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

export default BlogListPage;
