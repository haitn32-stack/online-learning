import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Image, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaUser, FaEdit, FaCamera } from 'react-icons/fa';
import { getProfile, updateProfile, updateAvatar } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '', gender: 'Male' });
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setEditForm({
        fullName: data.fullName || '',
        phone: data.phone || '',
        gender: data.gender || 'Male'
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await updateProfile(editForm);
      toast.success('Profile updated successfully');
      setShowEdit(false);
      loadProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      await updateAvatar(formData);
      toast.success('Avatar updated successfully');
      setAvatarFile(null);
      setAvatarPreview(null);
      loadProfile();
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loading />;
  if (!profile) return null;

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><FaUser className="me-2" /> My Profile</h5>
              <Button variant="light" size="sm" onClick={() => setShowEdit(true)}>
                <FaEdit className="me-1" /> Edit
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-4 mb-md-0">
                  <div className="position-relative d-inline-block">
                    <Image 
                      src={avatarPreview || profile.avatarUrl || 'https://via.placeholder.com/150'} 
                      roundedCircle 
                      width={150} 
                      height={150} 
                      className="border object-fit-cover mb-3"
                    />
                  </div>
                  <Form.Group className="mb-2">
                    <Form.Control type="file" size="sm" accept="image/*" onChange={handleAvatarChange} />
                  </Form.Group>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100" 
                    disabled={!avatarFile || uploading}
                    onClick={handleUploadAvatar}
                  >
                    {uploading ? <Spinner size="sm" /> : <><FaCamera className="me-1" /> Upload Avatar</>}
                  </Button>
                </Col>
                <Col md={8}>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control type="text" readOnly value={profile.fullName || 'N/A'} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control type="email" readOnly value={profile.email || 'N/A'} disabled />
                      <Form.Text className="text-muted">Email cannot be changed.</Form.Text>
                    </Form.Group>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control type="text" readOnly value={profile.phone || 'N/A'} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Control type="text" readOnly value={profile.gender || 'N/A'} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control type="text" readOnly value={profile.role || user?.role || 'Student'} disabled />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                type="text" 
                name="fullName" 
                value={editForm.fullName} 
                onChange={handleEditChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control 
                type="text" 
                name="phone" 
                value={editForm.phone} 
                onChange={handleEditChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={editForm.gender} onChange={handleEditChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit} disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
