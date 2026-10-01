import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success('Xác thực tài khoản thành công! Vui lòng đăng nhập.');
      setStatusMessage({ type: 'success', text: 'Tài khoản đã được xác thực thành công. Bạn có thể đăng nhập ngay!' });
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(formData.email, formData.password);
      toast.success('Đăng nhập thành công!');

      const role = user?.role || 'Student';
      switch (role) {
        case 'Admin':
          navigate('/admin/users');
          break;
        case 'Marketing':
          navigate('/marketing/dashboard');
          break;
        case 'Sale':
          navigate('/sale/registrations');
          break;
        case 'Expert':
          navigate('/expert/subjects');
          break;
        case 'Student':
        default:
          navigate('/');
          break;
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      toast.error(errMsg);
      setStatusMessage({ type: 'danger', text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-lg mt-5 mb-5">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h3 className="font-weight-light my-2">EduLearn</h3>
                <p className="mb-0">Đăng nhập tài khoản</p>
              </Card.Header>
              <Card.Body className="p-5">
                {statusMessage && (
                  <Alert variant={statusMessage.type} dismissible onClose={() => setStatusMessage(null)}>
                    {statusMessage.text}
                    {statusMessage.text.includes('kích hoạt') && (
                      <div className="mt-2">
                        <Link to={`/verify-code?email=${encodeURIComponent(formData.email)}`} className="alert-link font-weight-bold">
                          👉 Bấm vào đây để nhập mã xác thực OTP
                        </Link>
                      </div>
                    )}
                  </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Địa chỉ Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập email hợp lệ.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập mật khẩu.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                    <Form.Check 
                      type="checkbox" 
                      name="rememberMe"
                      id="rememberMe"
                      label="Ghi nhớ đăng nhập" 
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Đang đăng nhập...</>
                      ) : (
                        'Đăng nhập'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center py-3 bg-light">
                <div className="small">
                  Chưa có tài khoản? <Link to="/register">Đăng ký ngay!</Link>
                </div>
                <div className="small mt-1">
                  Đã có mã xác thực? <Link to="/verify-code">Nhập mã OTP kích hoạt</Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
