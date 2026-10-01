import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUpload, FaDownload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { importQuestions } from '../../services/question.service';
import { getAllSubjects } from '../../services/subject.service';
import Loading from '../../components/Loading';

const QuestionImportPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  
  const [subjectId, setSubjectId] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [importResult, setImportResult] = useState(null);
  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getAllSubjects({ page: 1, limit: 100 });
        setSubjects(data.subjects || []);
      } catch (error) {
        toast.error('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleJsonChange = (e) => {
    const text = e.target.value;
    setJsonText(text);
    setImportResult(null);
    
    if (!text.trim()) {
      setParsedData([]);
      return;
    }

    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        setParsedData(data);
      } else {
        setParsedData([]);
      }
    } catch (e) {
      setParsedData([]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      handleJsonChange({ target: { value: event.target.result } });
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!subjectId) {
      toast.error('Please select a subject first');
      return;
    }
    if (parsedData.length === 0) {
      toast.error('No valid questions found to import');
      return;
    }

    try {
      setImporting(true);
      const result = await importQuestions(subjectId, parsedData);
      setImportResult({
        successCount: result.successCount || 0,
        failCount: result.failCount || 0,
        errors: result.errors || []
      });
      if (result.failCount === 0) {
        toast.success(`Successfully imported ${result.successCount} questions`);
        setJsonText('');
        setParsedData([]);
      } else {
        toast.warning(`Imported ${result.successCount}, Failed ${result.failCount}`);
      }
    } catch (error) {
      toast.error(error.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const templateObj = [
    {
      "content": "What is 2+2?",
      "optionA": "3",
      "optionB": "4",
      "optionC": "5",
      "optionD": "6",
      "correctAnswer": "B",
      "explanation": "Basic math",
      "level": "Easy"
    }
  ];

  if (loading) return <Loading />;

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Import Questions</h2>
        <Button variant="secondary" onClick={() => navigate('/expert/questions')}>Back to Question Bank</Button>
      </div>

      <Row>
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">1. Select Target</h5>
              <Form.Group className="mb-4">
                <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
                <Form.Select 
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </Form.Select>
              </Form.Group>

              <h5 className="mb-3">2. Data Source</h5>
              <Alert variant="info" className="py-2 mb-3">
                <small>
                  Provide a JSON array of questions. Ensure keys match the template.<br/>
                  <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(templateObj, null, 2))}`} download="question_template.json" className="text-decoration-none fw-bold mt-1 d-inline-block">
                    <FaDownload className="me-1" /> Download Template
                  </a>
                </small>
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>Upload JSON File</Form.Label>
                <Form.Control type="file" accept=".json" onChange={handleFileUpload} />
              </Form.Group>

              <div className="text-center text-muted mb-3">OR</div>

              <Form.Group className="mb-4">
                <Form.Label>Paste JSON Data</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={8}
                  value={jsonText}
                  onChange={handleJsonChange}
                  placeholder="[{...}, {...}]"
                  style={{ fontFamily: 'monospace', fontSize: '0.9em' }}
                />
              </Form.Group>

              <Button 
                variant="primary" 
                className="w-100" 
                onClick={handleImport}
                disabled={importing || !subjectId || parsedData.length === 0}
              >
                {importing ? 'Importing...' : <><FaUpload className="me-2" /> Start Import</>}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {importResult && (
            <Alert variant={importResult.failCount > 0 ? "warning" : "success"} className="mb-4 shadow-sm">
              <div className="d-flex align-items-center mb-2">
                {importResult.failCount === 0 ? <FaCheckCircle className="fs-4 me-2" /> : <FaExclamationTriangle className="fs-4 me-2" />}
                <h5 className="mb-0">Import Results</h5>
              </div>
              <p className="mb-0">
                <strong>{importResult.successCount}</strong> questions imported successfully. 
                {importResult.failCount > 0 && <strong> {importResult.failCount}</strong>} failed.
              </p>
              {importResult.errors && importResult.errors.length > 0 && (
                <ul className="mt-2 text-danger small">
                  {importResult.errors.map((err, idx) => <li key={idx}>{err}</li>)}
                </ul>
              )}
            </Alert>
          )}

          <Card className="shadow-sm h-100">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Data Preview</h5>
              <Badge bg="secondary">{parsedData.length} Valid Entries Found</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              {parsedData.length > 0 ? (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <Table striped hover className="mb-0" style={{ fontSize: '0.9rem' }}>
                    <thead className="sticky-top bg-white shadow-sm">
                      <tr>
                        <th>#</th>
                        <th>Content</th>
                        <th>Options (A/B/C/D)</th>
                        <th>Correct</th>
                        <th>Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.map((q, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td style={{ maxWidth: '200px' }} className="text-truncate" title={q.content}>{q.content}</td>
                          <td style={{ maxWidth: '300px' }}>
                            <small className="d-block text-truncate">A: {q.optionA}</small>
                            <small className="d-block text-truncate">B: {q.optionB}</small>
                            {q.optionC && <small className="d-block text-truncate">C: {q.optionC}</small>}
                            {q.optionD && <small className="d-block text-truncate">D: {q.optionD}</small>}
                          </td>
                          <td><strong>{q.correctAnswer}</strong></td>
                          <td><Badge bg="info">{q.level || 'Easy'}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-5 text-muted">
                  <p>Paste valid JSON array or upload a file to see preview.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionImportPage;
