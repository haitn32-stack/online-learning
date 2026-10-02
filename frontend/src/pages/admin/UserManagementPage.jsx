import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllUsers } from '../../services/user.service';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers({ 
        page: currentPage, 
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });
      const userList = res.users || res.data || res.items || (Array.isArray(res) ? res : []);
      setUsers(Array.isArray(userList) ? userList : []);
      setTotalPages(res.totalPages || res.data?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Admin': return 'danger';
      case 'Expert': return 'info';
      case 'Marketing': return 'warning';
      case 'Sale': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <Button as={Link} to="/admin/users/create" variant="primary">
          <FaPlus className="me-2" /> Create User
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <SearchBar onSearch={handleSearch} placeholder="Search by name, email, phone..." />
            </Col>
            <Col md={4}>
              <Form.Select 
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Student">Student</option>
                <option value="Marketing">Marketing</option>
                <option value="Expert">Expert</option>
                <option value="Sale">Sale</option>
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
                    <th>Avatar</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>
                          <img 
                            src={user.avatarUrl || 'https://via.placeholder.com/40'} 
                            alt={user.fullName} 
                            className="rounded-circle"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        </td>
                        <td className="fw-bold">{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || '-'}</td>
                        <td>
                          <Badge bg={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={user.status === 'Active' ? 'success' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                          >
                            <FaEdit />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">No users found.</td>
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
    </Container>
  );
};

export default UserManagementPage;
