import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { verifyCode, resendCode } from '../../services/auth.service';

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthSession } = useAuth();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const qEmail = searchParams.get('email');
    const qCode = searchParams.get('code');
    if (qEmail) setEmail(qEmail);
    if (qCode) setCode(qCode);

    // Auto verify if both email and code exist in URL
    if (qEmail && qCode && qCode.length === 6) {
      handleAutoVerify(qEmail, qCode);
    }
  }, [searchParams]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleAutoVerify = async (verifyEmail, verifyOtp) => {
    try {
      setIsSubmitting(true);
      const res = await verifyCode(verifyEmail, verifyOtp);
      const data = res.data?.data || res.data;
      if (data?.token && data?.user) {
        setAuthSession(data.token, data.user);
      }
      toast.success('Xác thực tài khoản thành công!');
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Mã xác thực không hợp lệ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email.');
      return;
    }
    if (!code.trim() || code.trim().length !== 6) {
      setErrorMsg('Vui lòng nhập đúng mã xác thực 6 chữ số.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const res = await verifyCode(email.trim(), code.trim());
      const data = res.data?.data || res.data;
      
      if (data?.token && data?.user) {
        setAuthSession(data.token, data.user);
      }
      
      toast.success('Xác thực tài khoản thành công!');
      
      // Redirect based on role or to home
      const role = data?.user?.role || 'Student';
      if (role === 'Admin') navigate('/admin/users');
      else if (role === 'Marketing') navigate('/marketing/dashboard');
      else if (role === 'Expert') navigate('/expert/subjects');
      else if (role === 'Sale') navigate('/sale/registrations');
      else navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Mã xác thực không đúng hoặc đã hết hạn.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập email để gửi lại mã.');
      return;
    }
    try {
      setIsResending(true);
      setErrorMsg(null);
      await resendCode(email.trim());
      toast.success('Đã gửi lại mã OTP vào email của bạn!');
      setCountdown(60);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Không thể gửi lại mã. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
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
                <p className="mb-0">Xác thực tài khoản bằng mã OTP</p>
              </Card.Header>
              <Card.Body className="p-5">
                <p className="text-muted text-center mb-4">
                  Mã xác thực gồm <strong>6 chữ số</strong> đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư (cả mục Spam/Thư rác nếu không thấy).
                </p>

                {errorMsg && (
                  <Alert variant="danger" dismissible onClose={() => setErrorMsg(null)}>
                    {errorMsg}
                  </Alert>
                )}

                <Form onSubmit={handleVerify}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email đăng ký</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="code">
                    <Form.Label>Mã xác thực OTP (6 chữ số)</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={6}
                      placeholder="VD: 123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      style={{
                        letterSpacing: '8px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid gap-2 mb-3">
                    <Button variant="primary" type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Đang kiểm tra...</>
                      ) : (
                        'Kích hoạt tài khoản'
                      )}
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={handleResend}
                      disabled={isResending || countdown > 0}
                      className="text-decoration-none"
                    >
                      {countdown > 0 ? `Gửi lại mã sau (${countdown}s)` : 'Chưa nhận được mã? Gửi lại'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center py-3 bg-light">
                <div className="small">
                  Đã kích hoạt xong? <Link to="/login">Quay lại trang Đăng nhập</Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VerifyCodePage;
