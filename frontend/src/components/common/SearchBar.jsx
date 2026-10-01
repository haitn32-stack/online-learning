import React from 'react';
import { Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, onSearch, placeholder = 'Search...', filters = [], onFilterChange }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row className="g-2">
        <Col md={filters.length > 0 ? 8 : 12}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
            <Button variant="outline-secondary" type="submit">
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
        
        {filters.map((filter, index) => (
          <Col md={2} key={index}>
            <Form.Select 
              onChange={(e) => onFilterChange(filter.name, e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>{filter.name}</option>
              <option value="">All</option>
              {filter.options.map((opt, i) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </Form.Select>
          </Col>
        ))}
      </Row>
    </Form>
  );
};

export default SearchBar;
