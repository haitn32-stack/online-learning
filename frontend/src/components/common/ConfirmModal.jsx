import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, onHide, onConfirm, title, message, variant = 'primary' }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant={variant} onClick={() => { onConfirm(); onHide(); }}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
