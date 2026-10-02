import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { getAllRegistrations } from '../../services/registration.service';
import { formatCurrency, formatDate, getStatusBadgeVariant } from '../../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';

const RegistrationManagementPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // Simplified date range for UI
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await getAllRegistrations({
        search: searchTerm,
        status: statusFilter,
        dateFrom,
        dateTo,
        sortBy: sortField,
        sortOrder,
        page: currentPage,
        limit: 10
      });
      const regList = res.registrations || res.data || res.items || (Array.isArray(res) ? res : []);
      const regArray = Array.isArray(regList) ? regList : [];
      setRegistrations(regArray);
      setTotalPages(res.totalPages || res.data?.totalPages || 1);
      
      // Calculate or set summary
      if (res.summary) {
        setSummary(res.summary);
      } else {
        const mockSummary = { Submitted: 0, Paid: 0, Cancelled: 0, Completed: 0 };
        regArray.forEach(r => {
          if (mockSummary[r.status] !== undefined) mockSummary[r.status]++;
        });
        setSummary(mockSummary);
      }
    } catch (error) {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [searchTerm, statusFilter, dateFrom, dateTo, sortField, sortOrder, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading && registrations.length === 0) return <Loading />;

  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Registration Management</h2>
        <Button as={Link} to="/sale/registrations/create" variant="primary">
          Create Registration
        </Button>
      </div>

      {Object.keys(summary).length > 0 && (
        <Card className="mb-4 bg-light border-0 shadow-sm">
          <Card.Body className="py-2">
            <div className="d-flex justify-content-center flex-wrap gap-4 fw-bold">
              {Object.entries(summary).map(([status, count]) => (
                <span key={status}>
                  <Badge bg={getStatusBadgeVariant(status)} className="me-2">{status}</Badge> 
                  {count}
                </span>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <SearchBar 
                onSearch={setSearchTerm} 
                placeholder="Search name/email..." 
                initialValue={searchTerm}
              />
            </Col>
            <Col md={3}>
              <Form.Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }} placeholder="From Date" />
            </Col>
            <Col md={3}>
              <Form.Control type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }} placeholder="To Date" />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th onClick={() => handleSort('studentName')} style={{cursor: 'pointer'}}>Student Name {sortField === 'studentName' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('email')} style={{cursor: 'pointer'}}>Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th>Course</th>
                <th>Package</th>
                <th onClick={() => handleSort('totalCost')} style={{cursor: 'pointer'}}>Total Cost {sortField === 'totalCost' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th>Status</th>
                <th onClick={() => handleSort('date')} style={{cursor: 'pointer'}}>Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length > 0 ? (
                registrations.map((reg, idx) => (
                  <tr key={reg.id}>
                    <td>{(currentPage - 1) * 10 + idx + 1}</td>
                    <td>{reg.studentName}</td>
                    <td>{reg.email}</td>
                    <td>{reg.courseTitle || reg.course}</td>
                    <td>{reg.packageName || reg.package}</td>
                    <td>{formatCurrency(reg.totalCost)}</td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(reg.status)}>
                        {reg.status}
                      </Badge>
                    </td>
                    <td>{formatDate(reg.date || reg.createdAt)}</td>
                    <td>
                      <Button as={Link} to={`/sale/registrations/${reg.id}`} variant="outline-info" size="sm">
                        <FaEye className="me-1" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">No registrations found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <div className="mt-4 d-flex justify-content-center">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  );
};

export default RegistrationManagementPage;
