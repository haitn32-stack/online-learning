import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getAllSliders, updateSlider } from '../../services/slider.service';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';

const SliderManagementPage = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const data = await getAllSliders({
        search: searchTerm,
        status: statusFilter,
        page: currentPage,
        limit: 10
      });
      setSliders(data.sliders || data); 
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load sliders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, [searchTerm, statusFilter, currentPage]);

  const handleToggleStatus = async (slider) => {
    try {
      const newStatus = slider.status === 'active' ? 'inactive' : 'active';
      await updateSlider(slider.id, { ...slider, status: newStatus });
      toast.success(`Slider status updated to ${newStatus}`);
      fetchSliders();
    } catch (error) {
      toast.error('Failed to update slider status');
    }
  };

  if (loading && sliders.length === 0) return <Loading />;

  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Slider Management</h2>
        <Button as={Link} to="/marketing/sliders/create" variant="primary">
          Create New Slider
        </Button>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <SearchBar 
                onSearch={setSearchTerm} 
                placeholder="Search by title..." 
                initialValue={searchTerm}
              />
            </Col>
            <Col md={6}>
              <Form.Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
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
                <th>Preview</th>
                <th>Title</th>
                <th>Backlink</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sliders.length > 0 ? (
                sliders.map((slider, idx) => (
                  <tr key={slider.id}>
                    <td>{(currentPage - 1) * 10 + idx + 1}</td>
                    <td>
                      <img src={slider.imageUrl || 'https://via.placeholder.com/80x40'} alt="preview" style={{width: '80px', height: '40px', objectFit: 'cover'}} className="border rounded" />
                    </td>
                    <td>{slider.title}</td>
                    <td>
                      {slider.backlink ? (
                        <a href={slider.backlink} target="_blank" rel="noreferrer" className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                          {slider.backlink}
                        </a>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>{slider.orderNum || slider.order}</td>
                    <td>
                      <Badge bg={slider.status === 'active' ? 'success' : 'danger'}>
                        {slider.status}
                      </Badge>
                    </td>
                    <td>
                      <Button as={Link} to={`/marketing/sliders/edit/${slider.id}`} variant="outline-primary" size="sm" className="me-2" title="Edit">
                        <FaEdit />
                      </Button>
                      <Button variant={slider.status === 'active' ? 'outline-warning' : 'outline-success'} size="sm" onClick={() => handleToggleStatus(slider)} title={slider.status === 'active' ? 'Hide Slider' : 'Show Slider'}>
                        {slider.status === 'active' ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">No sliders found</td>
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

export default SliderManagementPage;
