import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaGlobe, FaGlobeAmericas } from 'react-icons/fa';
import { getAllSubjects, togglePublish } from '../../services/subject.service';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';

const SubjectPublishPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getAllSubjects({ page: currentPage });
      setSubjects(data.subjects || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage]);

  const handlePublishClick = (subject) => {
    setSelectedSubject(subject);
    setShowConfirm(true);
  };

  const confirmTogglePublish = async () => {
    if (!selectedSubject) return;
    try {
      await togglePublish(selectedSubject.id);
      toast.success(`Course ${selectedSubject.isPublished ? 'unpublished' : 'published'} successfully`);
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to change publish status');
    } finally {
      setShowConfirm(false);
      setSelectedSubject(null);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Course Publish Management</h2>

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Owner/Expert</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                      <tr key={subject.id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td className="fw-bold">{subject.title}</td>
                        <td>{subject.categoryName}</td>
                        <td>{subject.ownerName || 'Unknown'}</td>
                        <td>
                          <Badge bg={subject.status === 'Active' ? 'success' : 'secondary'}>
                            {subject.status}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={subject.isPublished ? 'primary' : 'warning'} text={!subject.isPublished ? 'dark' : ''}>
                            {subject.isPublished ? 'Published' : 'Unpublished'}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant={subject.isPublished ? 'outline-warning' : 'outline-primary'}
                            size="sm"
                            onClick={() => handlePublishClick(subject)}
                          >
                            {subject.isPublished ? <FaGlobeAmericas className="me-1"/> : <FaGlobe className="me-1"/>}
                            {subject.isPublished ? 'Unpublish' : 'Publish'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">No courses found.</td>
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

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmTogglePublish}
        title={selectedSubject?.isPublished ? "Unpublish Course" : "Publish Course"}
        body={`Are you sure you want to ${selectedSubject?.isPublished ? 'unpublish' : 'publish'} "${selectedSubject?.title}"? ${!selectedSubject?.isPublished ? 'This will make the course visible to students.' : 'This will hide the course from students.'}`}
        confirmText="Yes, Proceed"
        variant={selectedSubject?.isPublished ? 'warning' : 'primary'}
      />
    </Container>
  );
};

export default SubjectPublishPage;
