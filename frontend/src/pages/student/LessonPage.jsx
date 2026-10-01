import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Card, Button, Accordion } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getLessonsBySubject, getLessonById } from '../../services/lesson.service';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { FaPlayCircle, FaFileAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const LessonPage = () => {
  const { subjectId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await getLessonsBySubject(subjectId);
        setLessons(data || []);
        if (data && data.length > 0) {
          loadLessonContent(data[0].id);
        }
      } catch (error) {
        toast.error('Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };
    if (subjectId) fetchLessons();
    // eslint-disable-next-line
  }, [subjectId]);

  const loadLessonContent = async (lessonId) => {
    try {
      setContentLoading(true);
      const detail = await getLessonById(lessonId);
      setActiveLesson(detail);
    } catch (error) {
      toast.error('Failed to load lesson content');
    } finally {
      setContentLoading(false);
    }
  };

  const currentIndex = activeLesson ? lessons.findIndex(l => l.id === activeLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (loading) return <Loading />;

  const renderSidebar = () => (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-light fw-bold">Course Curriculum</Card.Header>
      <ListGroup variant="flush" className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {lessons.length === 0 ? (
          <ListGroup.Item>No lessons available</ListGroup.Item>
        ) : (
          lessons.map((lesson, idx) => (
            <ListGroup.Item 
              key={lesson.id} 
              action 
              active={activeLesson?.id === lesson.id}
              onClick={() => loadLessonContent(lesson.id)}
              className="d-flex align-items-start gap-2"
            >
              <div className="mt-1 text-muted">
                {lesson.type === 'Video' ? <FaPlayCircle /> : <FaFileAlt />}
              </div>
              <div>
                <div className="fw-semibold small">{idx + 1}. {lesson.title}</div>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
      <Card.Footer className="bg-white text-center">
        <Link to={`/student/quizzes/${subjectId}`} className="btn btn-outline-primary btn-sm w-100">
          Course Quizzes
        </Link>
      </Card.Footer>
    </Card>
  );

  return (
    <Container fluid className="py-4 px-md-4">
      <Row>
        {/* Mobile Sidebar */}
        <Col className="d-md-none mb-3">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Course Curriculum</Accordion.Header>
              <Accordion.Body className="p-0">
                {renderSidebar()}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>

        {/* Desktop Sidebar */}
        <Col md={3} className="d-none d-md-block">
          {renderSidebar()}
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <Card className="shadow-sm min-vh-100">
            <Card.Body>
              {contentLoading ? (
                <div className="text-center py-5"><Loading /></div>
              ) : activeLesson ? (
                <>
                  <h3 className="mb-4">{activeLesson.title}</h3>
                  
                  {activeLesson.videoUrl && (
                    <div className="ratio ratio-16x9 mb-4 bg-dark rounded">
                      {activeLesson.videoUrl.includes('youtube.com') ? (
                        <iframe 
                          src={activeLesson.videoUrl} 
                          title="Video player" 
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video controls src={activeLesson.videoUrl} className="w-100" />
                      )}
                    </div>
                  )}

                  <div 
                    className="lesson-content lh-lg"
                    dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                  />

                  <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                    <Button 
                      variant="outline-secondary" 
                      disabled={!prevLesson}
                      onClick={() => prevLesson && loadLessonContent(prevLesson.id)}
                    >
                      <FaChevronLeft className="me-2" /> Previous Lesson
                    </Button>
                    <Button 
                      variant="primary" 
                      disabled={!nextLesson}
                      onClick={() => nextLesson && loadLessonContent(nextLesson.id)}
                    >
                      Next Lesson <FaChevronRight className="ms-2" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-5 text-muted">
                  <h5>Select a lesson to start learning</h5>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LessonPage;
