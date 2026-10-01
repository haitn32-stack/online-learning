import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaPlus, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaToggleOn, FaToggleOff, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getSubjectById } from '../../services/subject.service';
import { getLessonsBySubject, toggleLessonStatus } from '../../services/lesson.service';
import Loading from '../../components/Loading';
import ConfirmModal from '../../components/ConfirmModal';

const LessonManagementPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectData, lessonsData] = await Promise.all([
        getSubjectById(subjectId),
        getLessonsBySubject(subjectId)
      ]);
      setSubject(subjectData);
      setLessons(lessonsData || []);
    } catch (error) {
      toast.error('Failed to load lessons');
      navigate('/expert/subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [subjectId]);

  const handleToggleClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowConfirm(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedLesson) return;
    try {
      await toggleLessonStatus(selectedLesson.id);
      toast.success(`Lesson ${selectedLesson.status === 'Active' ? 'deactivated' : 'activated'} successfully`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setShowConfirm(false);
      setSelectedLesson(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container fluid className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" className="me-3" onClick={() => navigate(`/expert/subjects/edit/${subjectId}`)}>
          <FaArrowLeft />
        </Button>
        <h2 className="mb-0">Lessons: {subject?.title}</h2>
      </div>

      <Card className="shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">Lessons Curriculum</h5>
          <Button as={Link} to={`/expert/lessons/create/${subjectId}`} variant="primary">
            <FaPlus className="me-2" /> Add Lesson
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Order</th>
                <th>Title</th>
                <th className="text-center">Video</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.length > 0 ? (
                // Assuming lessons is already sorted by orderNum, if not we could sort here
                [...lessons].sort((a,b) => a.orderNum - b.orderNum).map((lesson, index) => (
                  <tr key={lesson.id}>
                    <td>{index + 1}</td>
                    <td><Badge bg="secondary">{lesson.orderNum}</Badge></td>
                    <td>{lesson.title}</td>
                    <td className="text-center">
                      {lesson.videoUrl ? (
                        <FaVideo className="text-primary" title="Has Video" />
                      ) : (
                        <FaVideoSlash className="text-muted" title="No Video" />
                      )}
                    </td>
                    <td>
                      <Badge bg={lesson.status === 'Active' ? 'success' : 'danger'}>
                        {lesson.status}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="me-2"
                        as={Link}
                        to={`/expert/lessons/edit/${lesson.id}`}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant={lesson.status === 'Active' ? 'outline-danger' : 'outline-success'}
                        size="sm"
                        onClick={() => handleToggleClick(lesson)}
                        title={lesson.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {lesson.status === 'Active' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No lessons found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmToggleStatus}
        title="Confirm Status Change"
        body={`Are you sure you want to ${selectedLesson?.status === 'Active' ? 'deactivate' : 'activate'} this lesson?`}
        confirmText="Yes, Proceed"
        variant={selectedLesson?.status === 'Active' ? 'danger' : 'success'}
      />
    </Container>
  );
};

export default LessonManagementPage;
