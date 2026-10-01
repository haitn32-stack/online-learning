import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Breadcrumb } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaTag, FaArrowLeft } from 'react-icons/fa';
import { getPublicBlogById, getPublicBlogs } from '../../services/blog.service';
import { formatDate, truncateText } from '../../utils/formatters';
import Loading from '../../components/common/Loading';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const [blogRes, recentRes] = await Promise.all([
          getPublicBlogById(id),
          getPublicBlogs({ limit: 4 })
        ]);
        
        setBlog(blogRes.data);
        
        // Filter out the current blog from recent blogs
        const recent = (recentRes.data?.blogs || recentRes.data || [])
          .filter(b => b.id !== id || b.id !== parseInt(id))
          .slice(0, 3);
          
        setRecentBlogs(recent);
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (loading) return <Loading />;
  if (!blog) return <Container className="py-5 text-center"><h3>Article not found</h3></Container>;

  return (
    <div className="blog-detail-page bg-light min-vh-100 py-4 pb-5">
      <Container>
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/blogs" }}>Blog</Breadcrumb.Item>
          <Breadcrumb.Item active>Article</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Img variant="top" src={blog.thumbnail || 'https://via.placeholder.com/800x400?text=Blog+Cover'} style={{ height: '400px', objectFit: 'cover' }} />
              <Card.Body className="p-4 p-md-5">
                <div className="mb-3">
                  <Badge bg="primary" className="mb-3">
                    <FaTag className="me-1" /> {blog.category?.name || 'General'}
                  </Badge>
                  <h1 className="fw-bold mb-3">{blog.title}</h1>
                  
                  <div className="d-flex align-items-center text-muted gap-4 pb-3 border-bottom mb-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                        <FaUser />
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{blog.author?.fullName || 'EduLearn Author'}</div>
                        <small>Author</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaCalendar className="me-2 text-primary" size={20} />
                      <div>
                        <div className="fw-bold text-dark">{formatDate(blog.createdAt)}</div>
                        <small>Published</small>
                      </div>
                    </div>
                  </div>
                </div>

                {blog.briefInfo && (
                  <div className="lead mb-4 text-muted fst-italic border-start border-4 border-primary ps-3 py-1">
                    {blog.briefInfo}
                  </div>
                )}

                <div 
                  className="blog-content" 
                  dangerouslySetInnerHTML={{ __html: blog.content || '<p>No content available.</p>' }} 
                />
                
                <div className="mt-5 pt-4 border-top">
                  <Link to="/blogs" className="btn btn-outline-primary d-inline-flex align-items-center">
                    <FaArrowLeft className="me-2" /> Back to all articles
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-bottom p-4">
                <h5 className="fw-bold mb-0">Recent Articles</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="list-group list-group-flush">
                  {recentBlogs.length > 0 ? (
                    recentBlogs.map(recentBlog => (
                      <Link 
                        key={recentBlog.id} 
                        to={`/blogs/${recentBlog.id}`} 
                        className="list-group-item list-group-item-action p-4 border-bottom"
                      >
                        <Row className="g-2">
                          <Col xs={4}>
                            <img 
                              src={recentBlog.thumbnail || 'https://via.placeholder.com/150x100?text=Blog'} 
                              alt={recentBlog.title} 
                              className="img-fluid rounded" 
                              style={{ height: '70px', objectFit: 'cover', width: '100%' }} 
                            />
                          </Col>
                          <Col xs={8}>
                            <h6 className="mb-1 text-dark fw-bold" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {recentBlog.title}
                            </h6>
                            <small className="text-muted">
                              {formatDate(recentBlog.createdAt)}
                            </small>
                          </Col>
                        </Row>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-muted text-center">No recent articles found.</div>
                  )}
                </div>
              </Card.Body>
            </Card>
            
            <Card className="border-0 shadow-sm bg-primary text-white">
              <Card.Body className="p-4 text-center">
                <h5 className="fw-bold mb-3">Subscribe to our Newsletter</h5>
                <p className="small mb-4">Get the latest news and updates right to your inbox.</p>
                <div className="input-group mb-3">
                  <input type="email" className="form-control" placeholder="Email Address" />
                  <button className="btn btn-dark" type="button">Subscribe</button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogDetailPage;
