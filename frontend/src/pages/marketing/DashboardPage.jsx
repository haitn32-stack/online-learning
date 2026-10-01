import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { FaBook, FaClipboardList, FaDollarSign, FaUsers } from 'react-icons/fa';
import { getDashboardStats } from '../../services/dashboard.service';
import { formatCurrency, formatDate, getStatusBadgeVariant } from '../../utils/formatters';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading />;
  if (!stats) return <Container className="mt-4"><p>No data available.</p></Container>;

  const {
    totalSubjects,
    totalRegistrations,
    totalRevenue,
    totalStudents,
    registrationTrend = [],
    revenueTrend = [],
    popularCourses = [],
    recentRegistrations = []
  } = stats;

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Marketing Dashboard</h2>

      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow-sm border-start border-primary border-4 h-100">
            <Card.Body className="d-flex align-items-center">
              <FaBook size={40} className="text-primary me-3" />
              <div>
                <h6 className="text-muted mb-1">Total Subjects</h6>
                <h3 className="mb-0">{totalSubjects || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow-sm border-start border-success border-4 h-100">
            <Card.Body className="d-flex align-items-center">
              <FaClipboardList size={40} className="text-success me-3" />
              <div>
                <h6 className="text-muted mb-1">Total Registrations</h6>
                <h3 className="mb-0">{totalRegistrations || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow-sm border-start border-warning border-4 h-100">
            <Card.Body className="d-flex align-items-center">
              <FaDollarSign size={40} className="text-warning me-3" />
              <div>
                <h6 className="text-muted mb-1">Total Revenue</h6>
                <h3 className="mb-0">{formatCurrency(totalRevenue || 0)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="shadow-sm border-start border-info border-4 h-100">
            <Card.Body className="d-flex align-items-center">
              <FaUsers size={40} className="text-info me-3" />
              <div>
                <h6 className="text-muted mb-1">Total Students</h6>
                <h3 className="mb-0">{totalStudents || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Registration Trend (Last 6 Months)</h5>
            </Card.Header>
            <Card.Body>
              {registrationTrend.length > 0 ? (
                <div className="chart-container">
                  {registrationTrend.map((item, idx) => {
                    const maxVal = Math.max(...registrationTrend.map(i => i.count));
                    const width = maxVal ? (item.count / maxVal) * 100 : 0;
                    return (
                      <div key={idx} className="d-flex align-items-center mb-2">
                        <div style={{ width: '80px', fontSize: '0.85rem' }}>{item.month}</div>
                        <div className="flex-grow-1 bg-light me-2 rounded">
                          <div className="bg-primary rounded text-end px-2 text-white" style={{ width: `${width}%`, minWidth: '20px', fontSize: '0.8rem' }}>
                            {item.count}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted">No data</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Revenue by Month (Last 6 Months)</h5>
            </Card.Header>
            <Card.Body>
              {revenueTrend.length > 0 ? (
                <div className="chart-container">
                  {revenueTrend.map((item, idx) => {
                    const maxVal = Math.max(...revenueTrend.map(i => i.revenue));
                    const width = maxVal ? (item.revenue / maxVal) * 100 : 0;
                    return (
                      <div key={idx} className="d-flex align-items-center mb-2">
                        <div style={{ width: '80px', fontSize: '0.85rem' }}>{item.month}</div>
                        <div className="flex-grow-1 bg-light me-2 rounded">
                          <div className="bg-warning rounded text-end px-2 text-dark" style={{ width: `${width}%`, minWidth: '40px', fontSize: '0.8rem' }}>
                            {formatCurrency(item.revenue)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted">No data</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Top 5 Popular Courses</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Rank</th>
                    <th>Course Name</th>
                    <th>Registrations</th>
                  </tr>
                </thead>
                <tbody>
                  {popularCourses.length > 0 ? (
                    popularCourses.map((course, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{course.name}</td>
                        <td>{course.count}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="text-center">No popular courses found</td></tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Recent Registrations</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.length > 0 ? (
                    recentRegistrations.map((reg, idx) => (
                      <tr key={idx}>
                        <td>{reg.user}</td>
                        <td>{reg.course}</td>
                        <td>
                          <span className={`badge bg-${getStatusBadgeVariant(reg.status)}`}>
                            {reg.status}
                          </span>
                        </td>
                        <td>{formatDate(reg.date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center">No recent registrations</td></tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
