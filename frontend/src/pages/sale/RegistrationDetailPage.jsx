import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRegistrationById, updateRegistrationStatus } from '../../services/registration.service';
import { formatCurrency, formatDate, getStatusBadgeVariant } from '../../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import ConfirmModal from '../../components/ConfirmModal';

const RegistrationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const data = await getRegistrationById(id);
        setRegistration(data);
        setNewStatus(data.status);
      } catch (error) {
        toast.error('Failed to load registration details');
        navigate('/sale/registrations');
      } finally {
        setLoading(false);
      }
    };
    fetchRegistration();
  }, [id, navigate]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      await updateRegistrationStatus(id, { status: newStatus, notes: staffNotes });
      toast.success('Registration status updated successfully');
      setRegistration(prev => ({ ...prev, status: newStatus }));
      setShowConfirm(false);
      setStaffNotes('');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading />;
  if (!registration) return <Container className="mt-4">Registration not found.</Container>;

  const isTerminalStatus = registration.status === 'Cancelled' || registration.status === 'Completed';

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Registration Details</h2>
        <Button as={Link} to="/sale/registrations" variant="outline-secondary">
          Back to List
        </Button>
      </div>

      <Row>
        <Col lg={7}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white fw-bold">
              Registration Information
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Registration ID</Col>
                <Col sm={8}>#{registration.id}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Registration Date</Col>
                <Col sm={8}>{formatDate(registration.date || registration.createdAt)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Status</Col>
                <Col sm={8}>
                  <Badge bg={getStatusBadgeVariant(registration.status)} className="fs-6">
                    {registration.status}
                  </Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Total Cost</Col>
                <Col sm={8} className="fw-bold text-success">{formatCurrency(registration.totalCost)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Valid Dates</Col>
                <Col sm={8}>
                  {registration.validFrom && registration.validTo ? 
                    `${formatDate(registration.validFrom)} to ${formatDate(registration.validTo)}` : 
                    'N/A'
                  }
                </Col>
              </Row>
              <Row>
                <Col sm={4} className="text-muted">User Notes</Col>
                <Col sm={8}>{registration.notes || 'No notes provided.'}</Col>
              </Row>
            </Card.Body>
          </Card>

          {!isTerminalStatus && (
            <Card className="mb-4 shadow-sm border-primary">
              <Card.Header className="bg-primary text-white fw-bold">
                Update Status
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>New Status</Form.Label>
                    <Form.Select 
                      value={newStatus} 
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Submitted" disabled={registration.status !== 'Submitted'}>Submitted</option>
                      <option value="Paid">Paid</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Staff Notes</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={staffNotes} 
                      onChange={(e) => setStaffNotes(e.target.value)} 
                      placeholder="Add internal notes about this status change..." 
                    />
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowConfirm(true)}
                    disabled={newStatus === registration.status}
                  >
                    Update Status
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={5}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white fw-bold">Student Information</Card.Header>
            <Card.Body>
              <p><strong>Name:</strong> {registration.studentName}</p>
              <p><strong>Email:</strong> {registration.email}</p>
              <p className="mb-0"><strong>Phone:</strong> {registration.phone || 'N/A'}</p>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white fw-bold">Course Information</Card.Header>
            <Card.Body>
              <p><strong>Title:</strong> {registration.courseTitle || registration.course}</p>
              <p className="mb-0"><strong>Category:</strong> {registration.courseCategory || 'N/A'}</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-bold">Package Information</Card.Header>
            <Card.Body>
              <p><strong>Package:</strong> {registration.packageName || registration.package}</p>
              <p><strong>Duration:</strong> {registration.packageDuration || 'N/A'} months</p>
              <p className="mb-0"><strong>Original Price:</strong> {formatCurrency(registration.packagePrice || registration.totalCost)}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleUpdateStatus}
        title="Confirm Status Update"
        message={
          newStatus === 'Paid' 
            ? "Are you sure you want to change the status to 'Paid'? This will automatically grant the user access to the course."
            : `Are you sure you want to change the status to '${newStatus}'?`
        }
        confirmText="Yes, Update"
        cancelText="Cancel"
        variant={newStatus === 'Cancelled' ? 'danger' : 'primary'}
      />
    </Container>
  );
};

export default RegistrationDetailPage;
