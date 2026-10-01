import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBookOpen, FaCertificate, FaUsers, FaArrowRight } from 'react-icons/fa';
import { getActiveSliders } from '../../services/slider.service';
import { getPublishedSubjects } from '../../services/subject.service';
import { getPublicBlogs } from '../../services/blog.service';
import { getPackagesBySubject } from '../../services/pricePackage.service';
import { formatCurrency, formatDate, truncateText } from '../../utils/formatters';
import Loading from '../../components/common/Loading';

const HomePage = () => {
  const [sliders, setSliders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [slidersRes, subjectsRes, blogsRes] = await Promise.all([
          getActiveSliders().catch(() => ({ data: [] })),
          getPublishedSubjects({ limit: 6 }).catch(() => ({ data: [] })),
          getPublicBlogs({ limit: 3 }).catch(() => ({ data: [] }))
        ]);
        
        const slidersArray = Array.isArray(slidersRes.data) ? slidersRes.data : (Array.isArray(slidersRes.items) ? slidersRes.items : []);
        setSliders(slidersArray);
        
        // Fetch prices for subjects
        const subjectsData = Array.isArray(subjectsRes.data) ? subjectsRes.data : (Array.isArray(subjectsRes.items) ? subjectsRes.items : (Array.isArray(subjectsRes.data?.items) ? subjectsRes.data.items : []));
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
        const blogsArray = Array.isArray(blogsRes.data) ? blogsRes.data : (Array.isArray(blogsRes.items) ? blogsRes.items : []);
        setBlogs(blogsArray);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        {Array.isArray(sliders) && sliders.length > 0 ? (
          <Carousel>
            {sliders.map(slider => (
              <Carousel.Item key={slider.id}>
                <img
                  className="d-block w-100"
                  src={slider.imageUrl || 'https://via.placeholder.com/1200x500?text=Hero+Image'}
                  alt={slider.title}
                  style={{ height: '500px', objectFit: 'cover' }}
                />
                <Carousel.Caption className="bg-dark bg-opacity-50 p-4 rounded">
                  <h3>{slider.title}</h3>
                  <p>{slider.backlink}</p>
                  <Button as={Link} to={slider.backlink || '/courses'} variant="primary">
                    Learn More
                  </Button>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div className="bg-primary text-white py-5 text-center" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container>
              <h1 className="display-4 fw-bold mb-4">Welcome to EduLearn</h1>
              <p className="lead mb-4">Unlock your potential with our top-rated online courses.</p>
              <Button as={Link} to="/courses" variant="light" size="lg" className="px-5 rounded-pill fw-bold text-primary">
                Explore Courses
              </Button>
            </Container>
          </div>
        )}
      </section>

      {/* Featured Courses Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Featured Courses</h2>
            <p className="text-muted">Discover our most popular subjects and start learning today.</p>
          </div>
          <Row className="g-4">
            {(Array.isArray(courses) ? courses : []).map(course => (
              <Col key={course.id} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0 hover-shadow transition">
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
                      <Button as={Link} to={`/courses/${course.id}`} variant="outline-primary" size="sm">
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button as={Link} to="/courses" variant="primary" size="lg">
              View All Courses <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose EduLearn</h2>
            <p className="text-muted">We provide the best learning experience for our students.</p>
          </div>
          <Row className="g-4 text-center">
            <Col md={3}>
              <div className="p-4">
                <div className="text-primary mb-3"><FaGraduationCap size={50} /></div>
                <h4>Expert Instructors</h4>
                <p className="text-muted small">Learn from industry experts and experienced professionals.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="p-4">
                <div className="text-primary mb-3"><FaBookOpen size={50} /></div>
                <h4>Comprehensive Content</h4>
                <p className="text-muted small">High-quality materials and up-to-date curriculums.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="p-4">
                <div className="text-primary mb-3"><FaCertificate size={50} /></div>
                <h4>Valuable Certification</h4>
                <p className="text-muted small">Earn certificates that demonstrate your new skills.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="p-4">
                <div className="text-primary mb-3"><FaUsers size={50} /></div>
                <h4>Active Community</h4>
                <p className="text-muted small">Connect with peers and mentors in our vibrant community.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Latest Articles</h2>
            <p className="text-muted">Read our latest news, tips, and insights.</p>
          </div>
          <Row className="g-4">
            {(Array.isArray(blogs) ? blogs : []).map(blog => (
              <Col key={blog.id} md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Img variant="top" src={blog.thumbnail || 'https://via.placeholder.com/300x200?text=Blog'} style={{ height: '200px', objectFit: 'cover' }} />
                  <Card.Body>
                    <div className="text-muted small mb-2">{formatDate(blog.createdAt)}</div>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Text className="text-muted small">
                      {truncateText(blog.briefInfo, 100)}
                    </Card.Text>
                    <Link to={`/blogs/${blog.id}`} className="text-primary fw-bold text-decoration-none">
                      Read More <FaArrowRight className="ms-1" size={12} />
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white text-center">
        <Container className="py-4">
          <h2 className="fw-bold mb-3">Ready to start your learning journey?</h2>
          <p className="lead mb-4">Join thousands of students and boost your career today.</p>
          <Button as={Link} to="/register" variant="light" size="lg" className="px-5 rounded-pill fw-bold text-primary mx-2">
            Register Now
          </Button>
          <Button as={Link} to="/courses" variant="outline-light" size="lg" className="px-5 rounded-pill fw-bold mx-2">
            Explore Courses
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
