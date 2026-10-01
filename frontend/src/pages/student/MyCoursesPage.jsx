import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMyRegistrations } from '../../services/registration.service';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        // Assuming the backend supports multiple status or we filter locally.
        // For now, let's fetch Paid and Completed by getting all and filtering, or if backend supports it.
        // I will fetch all and filter locally for safety based on standard patterns.
        const res = await getMyRegistrations({ page: 1, limit: 100 }); 
        const items = res.items || [];
        const enrolled = items.filter(r => r.status === 'Paid' || r.status === 'Completed');
        setCourses(enrolled);
      } catch (error) {
        toast.error('Failed to load your courses');
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) return <Loading />;

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Courses</h2>
      {courses.length === 0 ? (
        <Card className="text-center py-5 bg-light border-0">
          <Card.Body>
            <h5 className="text-muted">You haven't enrolled in any courses yet</h5>
            <Button variant="primary" className="mt-3" onClick={() => navigate('/courses')}>
              Browse Courses
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {courses.map((course) => (
            <Col key={course.id} lg={4} md={6}>
              <Card className="h-100 shadow-sm hover-shadow transition">
                <Card.Img 
                  variant="top" 
                  src={course.thumbnailUrl || 'https://via.placeholder.com/300x150'} 
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">{course.subjectName}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted small">
                    Package: {course.packageName}
                  </Card.Subtitle>
                  
                  <div className="mt-auto">
                    <p className="small mb-3 text-muted">
                      Access: {formatDate(course.validFrom)} - {formatDate(course.validTo)}
                    </p>
                    <Button 
                      variant="primary" 
                      className="w-100" 
                      onClick={() => navigate(`/student/lessons/${course.subjectId}`)}
                    >
                      Continue Learning
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyCoursesPage;
