import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllSettings, toggleSettingStatus } from '../../services/setting.service';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import ConfirmModal from '../../components/ConfirmModal';

const SettingManagementPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  
  const navigate = useNavigate();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getAllSettings({ 
        page: currentPage, 
        search: searchTerm,
        type: typeFilter,
        status: statusFilter
      });
      setSettings(data.settings || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [currentPage, searchTerm, typeFilter, statusFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleToggleClick = (setting) => {
    setSelectedSetting(setting);
    setShowConfirm(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedSetting) return;
    try {
      await toggleSettingStatus(selectedSetting.id);
      toast.success('Status updated successfully');
      fetchSettings();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setShowConfirm(false);
      setSelectedSetting(null);
    }
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>System Settings</h2>
        <Button as={Link} to="/admin/settings/create" variant="primary">
          <FaPlus className="me-2" /> Add Setting
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <SearchBar onSearch={handleSearch} placeholder="Search key or value..." />
            </Col>
            <Col md={4}>
              <Form.Select 
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Types</option>
                <option value="Role">Role</option>
                <option value="Subject Category">Subject Category</option>
                <option value="System">System</option>
                <option value="Email Template">Email Template</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <Loading />
          ) : (
            <>
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.length > 0 ? (
                    settings.map((setting, index) => (
                      <tr key={setting.id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td><Badge bg="info">{setting.settingType}</Badge></td>
                        <td className="fw-bold">{setting.settingKey}</td>
                        <td title={setting.settingValue}>{truncateText(setting.settingValue)}</td>
                        <td>{setting.orderNum}</td>
                        <td>
                          <Badge bg={setting.status === 'Active' ? 'success' : 'secondary'}>
                            {setting.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="me-2"
                            onClick={() => navigate(`/admin/settings/edit/${setting.id}`)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant={setting.status === 'Active' ? 'outline-danger' : 'outline-success'}
                            size="sm"
                            onClick={() => handleToggleClick(setting)}
                            title={setting.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            {setting.status === 'Active' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">No settings found.</td>
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
        onConfirm={confirmToggleStatus}
        title="Confirm Status Change"
        body={`Are you sure you want to change the status of '${selectedSetting?.settingKey}'?`}
        confirmText="Yes, Proceed"
        variant={selectedSetting?.status === 'Active' ? 'danger' : 'success'}
      />
    </Container>
  );
};

export default SettingManagementPage;
