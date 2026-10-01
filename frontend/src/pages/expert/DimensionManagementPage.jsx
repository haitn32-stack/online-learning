import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getSubjectById } from '../../services/subject.service';
import { getDimensionsBySubject, createDimension, updateDimension } from '../../services/dimension.service';
import Loading from '../../components/Loading';

const DimensionManagementPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentDimension, setCurrentDimension] = useState({ id: null, name: '', type: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [subjectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectData, dimensionsData] = await Promise.all([
        getSubjectById(subjectId),
        getDimensionsBySubject(subjectId)
      ]);
      setSubject(subjectData);
      setDimensions(dimensionsData || []);
    } catch (error) {
      toast.error('Failed to load data');
      navigate('/expert/subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, dimension = null) => {
    setModalMode(mode);
    if (mode === 'edit' && dimension) {
      setCurrentDimension({ ...dimension });
    } else {
      setCurrentDimension({ id: null, name: '', type: '', description: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setCurrentDimension(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentDimension.name || !currentDimension.type) {
      toast.error('Name and Type are required');
      return;
    }

    try {
      setSubmitting(true);
      if (modalMode === 'add') {
        await createDimension({ ...currentDimension, subjectId });
        toast.success('Dimension added successfully');
      } else {
        await updateDimension(currentDimension.id, currentDimension);
        toast.success('Dimension updated successfully');
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Failed to save dimension');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container fluid className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" className="me-3" onClick={() => navigate(`/expert/subjects/edit/${subjectId}`)}>
          <FaArrowLeft />
        </Button>
        <h2 className="mb-0">Dimensions: {subject?.title}</h2>
      </div>

      <Card className="shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">Dimensions List</h5>
          <Button variant="primary" onClick={() => handleOpenModal('add')}>
            <FaPlus className="me-2" /> Add Dimension
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dimensions.length > 0 ? (
                dimensions.map((dim, index) => (
                  <tr key={dim.id}>
                    <td>{index + 1}</td>
                    <td>{dim.name}</td>
                    <td>{dim.type}</td>
                    <td>{dim.description}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleOpenModal('edit', dim)}
                      >
                        <FaEdit /> Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">No dimensions found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Add Dimension' : 'Edit Dimension'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={currentDimension.name} 
                onChange={handleModalChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                name="type" 
                value={currentDimension.type} 
                onChange={handleModalChange} 
                required
              >
                <option value="">Select Type</option>
                <option value="Topic">Topic</option>
                <option value="Domain">Domain</option>
                <option value="Difficulty">Difficulty</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description" 
                value={currentDimension.description} 
                onChange={handleModalChange} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DimensionManagementPage;
