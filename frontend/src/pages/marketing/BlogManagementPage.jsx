import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaEdit, FaEye } from 'react-icons/fa';
import { getAllBlogs, toggleFeatured } from '../../services/blog.service';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';

const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs({
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter,
        featured: featuredFilter,
        page: currentPage,
        limit: 10
      });
      setBlogs(data.blogs || data); // handle both paginated and flat responses
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm, categoryFilter, statusFilter, featuredFilter, currentPage]);

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await toggleFeatured(id, !currentStatus);
      toast.success('Featured status updated');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  if (loading && blogs.length === 0) return <Loading />;

  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Blog Management</h2>
        <Button as={Link} to="/marketing/blogs/create" variant="primary">
          Create New Blog
        </Button>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <SearchBar 
                onSearch={setSearchTerm} 
                placeholder="Search by title..." 
                initialValue={searchTerm}
              />
            </Col>
            <Col md={3}>
              <Form.Select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
                <option value="">All Categories</option>
                <option value="news">News</option>
                <option value="guide">Guide</option>
                <option value="update">Update</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select value={featuredFilter} onChange={(e) => { setFeaturedFilter(e.target.value); setCurrentPage(1); }}>
                <option value="">All Featured</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length > 0 ? (
                blogs.map((blog, idx) => (
                  <tr key={blog.id}>
                    <td>{(currentPage - 1) * 10 + idx + 1}</td>
                    <td>
                      <img src={blog.thumbnail || 'https://via.placeholder.com/50'} alt="thumb" style={{width: '50px', height: '30px', objectFit: 'cover'}} />
                    </td>
                    <td>{blog.title}</td>
                    <td>{blog.category}</td>
                    <td>{blog.author}</td>
                    <td className="text-center">
                      <Button variant="link" className="p-0" onClick={() => handleToggleFeatured(blog.id, blog.featured)}>
                        {blog.featured ? <FaStar className="text-warning" size={20} /> : <FaRegStar className="text-secondary" size={20} />}
                      </Button>
                    </td>
                    <td>
                      <Badge bg={blog.status === 'active' ? 'success' : 'danger'}>
                        {blog.status}
                      </Badge>
                    </td>
                    <td>{formatDate(blog.date || blog.createdAt)}</td>
                    <td>
                      <Button as={Link} to={`/marketing/blogs/edit/${blog.id}`} variant="outline-primary" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button as="a" href={`/blogs/${blog.id}`} target="_blank" variant="outline-secondary" size="sm">
                        <FaEye />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">No blogs found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <div className="mt-4 d-flex justify-content-center">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  );
};

export default BlogManagementPage;
