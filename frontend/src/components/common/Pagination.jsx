import React from 'react';
import { Pagination as BsPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const items = [];
  
  // Basic implementation, can be enhanced with ellipsis for many pages
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <BsPagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </BsPagination.Item>
    );
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <BsPagination>
        <BsPagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
        <BsPagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
        {items}
        <BsPagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <BsPagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
      </BsPagination>
    </div>
  );
};

export default Pagination;
