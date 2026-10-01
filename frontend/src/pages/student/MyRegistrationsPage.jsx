import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { getMyRegistrations, cancelRegistration, updateMyRegistration } from '../../services/registration.service';
import { getPackagesBySubject } from '../../services/pricePackage.service';
import { formatDate, formatCurrency, getStatusBadgeVariant } from '../../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cancel Modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReg, setEditingReg] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getMyRegistrations({ page: currentPage, status: statusFilter });
      setRegistrations(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line
  }, [currentPage, statusFilter]);

  const handleCancelClick = (id) => {
    setCancelingId(id);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      await cancelRegistration(cancelingId);
      toast.success('Registration cancelled successfully');
      setShowCancelModal(false);
      fetchRegistrations();
    } catch (error) {
      toast.error('Failed to cancel registration');
    }
  };

  const handleEditClick = async (reg) => {
    setEditingReg(reg);
    setSelectedPackageId(reg.packageId);
    setShowEditModal(true);
    try {
      const pkgs = await getPackagesBySubject(reg.subjectId);
      setPackages(pkgs);
    } catch (error) {
      toast.error('Failed to load packages');
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await updateMyRegistration(editingReg.id, { packageId: selectedPackageId });
      toast.success('Registration updated successfully');
      setShowEditModal(false);
      fetchRegistrations();
    } catch (error) {
      toast.error('Failed to update registration');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && registrations.length === 0) return <Loading />;

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0">My Registrations</h4>
          <Form.Select 
            style={{ width: '200px' }} 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Paid">Paid</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </Form.Select>
        </Card.Header>
        <Card.Body>
          {registrations.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5>No registrations yet. Browse our courses!</h5>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover align="middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Course</th>
                      <th>Package</th>
                      <th>Total Cost</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, index) => (
                      <tr key={reg.id}>
                        <td>{index + 1 + (currentPage - 1) * 10}</td>
                        <td className="fw-semibold">{reg.subjectName}</td>
                        <td>{reg.packageName}</td>
                        <td className="fw-bold">{formatCurrency(reg.totalCost)}</td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(reg.status)}>
                            {reg.status}
                          </Badge>
                        </td>
                        <td>{formatDate(reg.createdAt)}</td>
                        <td>
                          {reg.status === 'Submitted' && (
                            <div className="d-flex gap-2">
                              <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(reg)}>
                                Edit
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleCancelClick(reg.id)}>
                                Cancel
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <ConfirmModal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        title="Cancel Registration"
        message="Are you sure you want to cancel this registration? This action cannot be undone."
        confirmText="Yes, Cancel it"
        confirmVariant="danger"
      />

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Registration Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Course: <strong>{editingReg?.subjectName}</strong></p>
          <Form.Group>
            <Form.Label>Select Package</Form.Label>
            <Form.Select 
              value={selectedPackageId} 
              onChange={(e) => setSelectedPackageId(e.target.value)}
            >
              {packages.map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - {formatCurrency(pkg.salePrice)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdate} disabled={updating || !selectedPackageId}>
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default MyRegistrationsPage;
