import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, ProgressBar, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizResultById } from '../../services/quiz.service';
import { formatDuration, formatDate } from '../../utils/formatters';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaRedo } from 'react-icons/fa';
import Loading from '../../components/Loading';

const QuizResultPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getQuizResultById(resultId);
        setResult(data);
      } catch (error) {
        navigate('/student');
      } finally {
        setLoading(false);
      }
    };
    if (resultId) fetchResult();
  }, [resultId, navigate]);

  if (loading) return <Loading />;
  if (!result) return null;

  const scorePercentage = (result.correctAnswers / result.totalQuestions) * 100;
  const isPassed = result.isPassed;

  return (
    <Container className="py-5">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Button variant="outline-secondary" onClick={() => navigate('/student/my-courses')}>
          <FaArrowLeft className="me-2" /> Back to Courses
        </Button>
        <Button variant="primary" onClick={() => navigate(`/student/quiz/${result.quizId}`)}>
          <FaRedo className="me-2" /> Retake Quiz
        </Button>
      </div>

      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="p-4">
          <Row className="align-items-center text-center text-md-start">
            <Col md={7}>
              <h3 className="mb-1">{result.quizTitle}</h3>
              <p className="text-muted mb-3">Taken on {formatDate(result.takenAt)}</p>
              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-md-start mb-3 mb-md-0">
                <div>
                  <h6 className="text-muted mb-1">Score</h6>
                  <h4 className="mb-0 fw-bold">{result.correctAnswers} / {result.totalQuestions}</h4>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Time Taken</h6>
                  <h4 className="mb-0 fw-bold">{formatDuration(result.timeTaken)}</h4>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Status</h6>
                  <h4>
                    <Badge bg={isPassed ? 'success' : 'danger'} className="px-3 py-2">
                      {isPassed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </h4>
                </div>
              </div>
            </Col>
            <Col md={5}>
              <div className="px-md-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Score Percentage</span>
                  <span className="fw-bold">{scorePercentage.toFixed(1)}%</span>
                </div>
                <ProgressBar 
                  now={scorePercentage} 
                  variant={isPassed ? 'success' : 'danger'} 
                  style={{ height: '12px' }} 
                  className="mb-2"
                />
                <p className="small text-muted text-end mb-0">Passing requirement: {result.passRate}%</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h4 className="mb-3">Detailed Review</h4>
      
      {result.details?.map((item, idx) => {
        const isCorrect = item.selectedAnswerId === item.correctAnswerId;
        
        return (
          <Card key={item.questionId} className={`mb-4 shadow-sm border-0 border-start border-4 ${isCorrect ? 'border-success' : 'border-danger'}`}>
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-5">Question {idx + 1}</span>
              {isCorrect ? (
                <span className="text-success d-flex align-items-center fw-semibold"><FaCheckCircle className="me-1" /> Correct</span>
              ) : (
                <span className="text-danger d-flex align-items-center fw-semibold"><FaTimesCircle className="me-1" /> Incorrect</span>
              )}
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-4 fs-5" dangerouslySetInnerHTML={{ __html: item.questionContent }} />
              
              <div className="d-flex flex-column gap-2 ms-3">
                {item.options?.map((opt, oIdx) => {
                  const isSelected = item.selectedAnswerId === opt.id;
                  const isActualCorrect = item.correctAnswerId === opt.id;
                  
                  let optStyle = "border p-3 rounded d-flex align-items-center justify-content-between";
                  if (isSelected && isActualCorrect) {
                    optStyle += " bg-success text-white border-success";
                  } else if (isSelected && !isActualCorrect) {
                    optStyle += " bg-danger text-white border-danger";
                  } else if (!isSelected && isActualCorrect) {
                    optStyle += " bg-light border-success text-success fw-bold";
                  }

                  return (
                    <div key={opt.id} className={optStyle}>
                      <div>
                        <span className="me-2 fw-bold">{String.fromCharCode(65 + oIdx)}.</span>
                        {opt.content}
                      </div>
                      {isSelected && isActualCorrect && <FaCheckCircle size={20} />}
                      {isSelected && !isActualCorrect && <FaTimesCircle size={20} />}
                      {!isSelected && isActualCorrect && <FaCheckCircle size={20} />}
                    </div>
                  );
                })}
              </div>

              {item.explanation && (
                <div className="mt-4 p-3 bg-light rounded border">
                  <strong>Explanation: </strong>
                  <span dangerouslySetInnerHTML={{ __html: item.explanation }} />
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
};

export default QuizResultPage;
