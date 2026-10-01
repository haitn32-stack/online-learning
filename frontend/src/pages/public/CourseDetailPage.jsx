import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Tabs, Tab, Accordion, Button, Breadcrumb } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaPlayCircle, FaShare, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { getPublishedSubjectById } from '../../services/subject.service';
import { getPackagesBySubject } from '../../services/pricePackage.service';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const [courseRes, packagesRes] = await Promise.all([
          getPublishedSubjectById(id),
          getPackagesBySubject(id).catch(() => ({ data: [] }))
        ]);
        
        setCourse(courseRes.data);
        setPackages(packagesRes.data || []);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const handleRegisterClick = (packageId) => {
    if (isAuthenticated) {
      navigate(`/student/register-course/${id}?package=${packageId}`);
    } else {
      navigate('/login', { state: { returnUrl: `/student/register-course/${id}?package=${packageId}` } });
    }
  };

  if (loading) return <Loading />;
  if (!course) return <Container className="py-5 text-center"><h3>Course not found</h3></Container>;

  return (
    <div className="course-detail-page bg-light min-vh-100 pb-5">
      {/* Course Header */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Breadcrumb className="mb-3 custom-breadcrumb">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="text-white-50">Home</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/courses" }} className="text-white-50">Courses</Breadcrumb.Item>
            <Breadcrumb.Item active className="text-white">{course.title}</Breadcrumb.Item>
          </Breadcrumb>
          
          <Row>
            <Col lg={8}>
              <Badge bg="info" className="mb-3">{course.category?.name || 'General'}</Badge>
              <h1 className="fw-bold mb-3">{course.title}</h1>
              <p className="lead mb-4">{course.tagline}</p>
              <div className="d-flex align-items-center mb-4">
                <span className="me-4"><strong>Expert:</strong> {course.expert?.fullName || 'EduLearn Expert'}</span>
                <span><strong>Last updated:</strong> {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}</span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt-4">
        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-0">
                <Tabs defaultActiveKey="overview" className="border-bottom p-3 pb-0" id="course-tabs">
                  <Tab eventKey="overview" title="Overview" className="p-4">
                    <h4 className="fw-bold mb-3">About this course</h4>
                    <div dangerouslySetInnerHTML={{ __html: course.description || 'No description provided.' }} />
                  </Tab>
                  
                  <Tab eventKey="curriculum" title="Curriculum" className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="fw-bold mb-0">Course Content</h4>
                      <span className="text-muted">{course.lessons?.length || 0} lessons</span>
                    </div>
                    
                    {course.lessons && course.lessons.length > 0 ? (
                      <Accordion defaultActiveKey="0">
                        {course.lessons.map((lesson, idx) => (
                          <Accordion.Item eventKey={idx.toString()} key={lesson.id || idx}>
                            <Accordion.Header>
                              <strong>Lesson {lesson.order || idx + 1}:</strong> &nbsp; {lesson.title}
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="d-flex align-items-center text-muted">
                                <FaPlayCircle className="me-2" /> 
                                {lesson.type || 'Video / Reading'}
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    ) : (
                      <p className="text-muted">Curriculum details are not available yet.</p>
                    )}
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            {/* Sidebar with Image and Pricing */}
            <Card className="border-0 shadow-sm mb-4" style={{ marginTop: '-100px', zIndex: 10 }}>
              <Card.Img variant="top" src={course.thumbnail || 'https://via.placeholder.com/400x250?text=Course'} style={{ height: '250px', objectFit: 'cover' }} />
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Pricing Packages</h4>
                
                {packages.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {packages.map(pkg => (
                      <Card key={pkg.id} className={`border ${pkg.isDefault ? 'border-primary shadow' : ''}`}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0 fw-bold">{pkg.name}</h5>
                            <Badge bg="light" text="dark">{pkg.duration} days</Badge>
                          </div>
                          
                          <div className="mb-3">
                            {pkg.salePrice ? (
                              <>
                                <h3 className="fw-bold text-primary mb-0">{formatCurrency(pkg.salePrice)}</h3>
                                <span className="text-muted text-decoration-line-through small">{formatCurrency(pkg.listPrice)}</span>
                              </>
                            ) : (
                              <h3 className="fw-bold text-primary mb-0">{formatCurrency(pkg.listPrice)}</h3>
                            )}
                          </div>
                          
                          <p className="text-muted small mb-3">{pkg.description}</p>
                          
                          <div className="d-grid">
                            <Button 
                              variant={pkg.isDefault ? "primary" : "outline-primary"} 
                              onClick={() => handleRegisterClick(pkg.id)}
                            >
                              Register Now
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted">No pricing packages available yet.</p>
                  </div>
                )}
                
                <hr className="my-4" />
                
                <div className="mb-3">
                  <h6 className="fw-bold">Course Includes:</h6>
                  <ul className="list-unstyled small text-muted">
                    <li className="mb-2">✓ Full lifetime access</li>
                    <li className="mb-2">✓ Access on mobile and TV</li>
                    <li className="mb-2">✓ Certificate of completion</li>
                  </ul>
                </div>
                
                <hr className="my-4" />
                
                <div>
                  <h6 className="fw-bold mb-3 d-flex align-items-center">
                    <FaShare className="me-2" /> Share this course
                  </h6>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm" className="rounded-circle" style={{ width: '36px', height: '36px', padding: 0 }}><FaFacebook /></Button>
                    <Button variant="outline-secondary" size="sm" className="rounded-circle" style={{ width: '36px', height: '36px', padding: 0 }}><FaTwitter /></Button>
                    <Button variant="outline-secondary" size="sm" className="rounded-circle" style={{ width: '36px', height: '36px', padding: 0 }}><FaLinkedin /></Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CourseDetailPage;
