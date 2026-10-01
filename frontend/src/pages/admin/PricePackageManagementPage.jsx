import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getSubjectById } from '../../services/subject.service';
import { getPackagesBySubject, createPackage, updatePackage } from '../../services/pricePackage.service';
import Loading from '../../components/Loading';

const PricePackageManagementPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentPackage, setCurrentPackage] = useState({ 
    id: null, name: '', duration: 30, listPrice: 0, salePrice: 0, description: '', status: 'Active' 
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [subjectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectData, packagesData] = await Promise.all([
        getSubjectById(subjectId),
        getPackagesBySubject(subjectId)
      ]);
      setSubject(subjectData);
      setPackages(packagesData || []);
    } catch (error) {
      toast.error('Failed to load data');
      navigate('/admin/subjects'); // Assuming there's a subject list for admin
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, pkg = null) => {
    setModalMode(mode);
    if (mode === 'edit' && pkg) {
      setCurrentPackage({ ...pkg });
    } else {
      setCurrentPackage({ id: null, name: '', duration: 30, listPrice: 0, salePrice: 0, description: '', status: 'Active' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setCurrentPackage(prev => ({ ...prev, [name]: checked ? 'Active' : 'Inactive' }));
    } else if (type === 'number') {
      setCurrentPackage(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setCurrentPackage(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPackage.name || currentPackage.duration <= 0 || currentPackage.listPrice < 0) {
      toast.error('Please fill required fields correctly');
      return;
    }

    if (currentPackage.salePrice > currentPackage.listPrice) {
      toast.error('Sale price cannot be greater than list price');
      return;
    }

    try {
      setSubmitting(true);
      if (modalMode === 'add') {
        await createPackage({ ...currentPackage, subjectId });
        toast.success('Package added successfully');
      } else {
        await updatePackage(currentPackage.id, currentPackage);
        toast.success('Package updated successfully');
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Failed to save package');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container fluid className="py-4">
      <div className="d-flex align-items-center mb-4">
        {/* Navigating back could go to an admin subjects page or dashboard */}
        <Button variant="outline-secondary" className="me-3" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </Button>
        <h2 className="mb-0">Price Packages: {subject?.title}</h2>
      </div>

      <Card className="shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">Available Packages</h5>
          <Button variant="primary" onClick={() => handleOpenModal('add')}>
            <FaPlus className="me-2" /> Add Package
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Duration (Days)</th>
                <th>List Price ($)</th>
                <th>Sale Price ($)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.length > 0 ? (
                packages.map((pkg, index) => (
                  <tr key={pkg.id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{pkg.name}</td>
                    <td>{pkg.duration}</td>
                    <td className="text-decoration-line-through text-muted">${pkg.listPrice}</td>
                    <td className="text-success fw-bold">${pkg.salePrice}</td>
                    <td>
                      <Badge bg={pkg.status === 'Active' ? 'success' : 'secondary'}>
                        {pkg.status}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleOpenModal('edit', pkg)}
                      >
                        <FaEdit /> Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">No price packages found for this course.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Add Price Package' : 'Edit Price Package'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Package Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={currentPackage.name} 
                    onChange={handleModalChange} 
                    required 
                    placeholder="e.g. 1 Month Access"
                  />
                </Form.Group>
              </Col>
              
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Duration (Days) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" 
                    name="duration" 
                    value={currentPackage.duration} 
                    onChange={handleModalChange} 
                    required 
                    min="1"
                  />
                </Form.Group>
              </Col>
              
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>List Price ($) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" 
                    name="listPrice" 
                    value={currentPackage.listPrice} 
                    onChange={handleModalChange} 
                    required 
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>

              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Sale Price ($) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" 
                    name="salePrice" 
                    value={currentPackage.salePrice} 
                    onChange={handleModalChange} 
                    required 
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    name="description" 
                    value={currentPackage.description} 
                    onChange={handleModalChange} 
                  />
                </Form.Group>
              </Col>

              {modalMode === 'edit' && (
                <Col md={12}>
                  <Form.Check 
                    type="switch"
                    id="package-status"
                    name="status"
                    label={`Status: ${currentPackage.status}`}
                    checked={currentPackage.status === 'Active'}
                    onChange={handleModalChange}
                  />
                </Col>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Package'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PricePackageManagementPage;
