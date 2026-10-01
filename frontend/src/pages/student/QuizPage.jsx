import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Card, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, submitQuiz } from '../../services/quiz.service';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import ConfirmModal from '../../components/ConfirmModal';
import { formatDuration } from '../../utils/formatters';
import { FaClock } from 'react-icons/fa';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const [showConfirm, setShowConfirm] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(quizId);
        setQuiz(data);
        setTimeLeft(data.duration * 60); // duration in minutes
      } catch (error) {
        toast.error('Failed to load quiz');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    if (quizId) fetchQuiz();
  }, [quizId, navigate]);

  const handleSubmitQuiz = useCallback(async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const res = await submitQuiz(quizId, { answers });
      toast.success('Quiz submitted successfully!');
      navigate(`/student/quiz-result/${res.resultId}`);
    } catch (error) {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  }, [quizId, answers, navigate, submitting]);

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz(); // Auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, timeLeft, handleSubmitQuiz]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing >= 0) {
        const newAnswers = [...prev];
        newAnswers[existing] = { questionId, selectedAnswer: optionId };
        return newAnswers;
      }
      return [...prev, { questionId, selectedAnswer: optionId }];
    });
  };

  const onConfirmSubmitClick = () => {
    const unanswered = (quiz?.questions?.length || 0) - answers.length;
    if (unanswered > 0) {
      setShowConfirm(true);
    } else {
      handleSubmitQuiz();
    }
  };

  if (loading) return <Loading />;
  if (!quiz) return null;

  if (!started) {
    return (
      <Container className="py-5 d-flex justify-content-center">
        <Card className="shadow" style={{ maxWidth: '600px', width: '100%' }}>
          <Card.Header className="bg-primary text-white text-center py-3">
            <h4 className="mb-0">Quiz Details</h4>
          </Card.Header>
          <Card.Body className="p-4 text-center">
            <h2 className="mb-3">{quiz.title}</h2>
            <Row className="mb-4 text-muted">
              <Col><strong>Duration:</strong> {quiz.duration} minutes</Col>
              <Col><strong>Questions:</strong> {quiz.questions?.length || 0}</Col>
              <Col><strong>Pass Rate:</strong> {quiz.passRate}%</Col>
            </Row>
            <Alert variant="info">
              The timer will start immediately once you click "Start Quiz".
            </Alert>
            <Button size="lg" variant="success" onClick={handleStart} className="px-5 mt-2">
              Start Quiz
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 60;
  const unansweredCount = (quiz.questions?.length || 0) - answers.length;

  return (
    <Container className="py-4">
      <div className={`sticky-top p-3 mb-4 rounded shadow-sm d-flex justify-content-between align-items-center ${isLowTime ? 'bg-danger text-white' : 'bg-white border'}`} style={{ top: '10px', zIndex: 1000 }}>
        <h5 className="mb-0 text-truncate me-3">{quiz.title}</h5>
        <div className="d-flex align-items-center fw-bold fs-5">
          <FaClock className="me-2" /> {formatTime(timeLeft)}
        </div>
      </div>

      <Row>
        <Col lg={9}>
          {quiz.questions?.map((q, idx) => (
            <Card key={q.id} className="mb-4 shadow-sm border-0" id={`question-${q.id}`}>
              <Card.Header className="bg-light fw-bold">
                Question {idx + 1}
              </Card.Header>
              <Card.Body>
                <div className="mb-3 fs-5" dangerouslySetInnerHTML={{ __html: q.content }} />
                <div className="d-flex flex-column gap-2 ms-3">
                  {q.options?.map((opt, oIdx) => (
                    <Form.Check 
                      key={opt.id}
                      type="radio"
                      id={`q-${q.id}-opt-${opt.id}`}
                      name={`question-${q.id}`}
                      label={`${String.fromCharCode(65 + oIdx)}. ${opt.content}`}
                      className="fs-6 py-2 px-3 rounded hover-bg-light"
                      checked={answers.some(a => a.questionId === q.id && a.selectedAnswer === opt.id)}
                      onChange={() => handleAnswerSelect(q.id, opt.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </Card.Body>
            </Card>
          ))}
          
          <div className="text-end mb-5">
            <Button size="lg" variant="primary" onClick={onConfirmSubmitClick} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          </div>
        </Col>

        <Col lg={3} className="d-none d-lg-block">
          <Card className="sticky-top shadow-sm" style={{ top: '80px' }}>
            <Card.Header className="bg-light">Quiz Navigation</Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                {quiz.questions?.map((q, idx) => {
                  const isAnswered = answers.some(a => a.questionId === q.id);
                  return (
                    <Button 
                      key={q.id}
                      variant={isAnswered ? 'success' : 'outline-secondary'}
                      size="sm"
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px' }}
                      onClick={() => {
                        document.getElementById(`question-${q.id}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                    >
                      {idx + 1}
                    </Button>
                  );
                })}
              </div>
              <hr />
              <div className="text-muted small">
                <p className="mb-1"><span className="badge bg-success me-2">&nbsp;</span> Answered: {answers.length}</p>
                <p className="mb-0"><span className="badge bg-outline-secondary border text-dark me-2">&nbsp;</span> Unanswered: {unansweredCount}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmModal 
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          handleSubmitQuiz();
        }}
        title="Submit Quiz"
        message={`Are you sure you want to submit? You have ${unansweredCount} unanswered questions.`}
        confirmText="Yes, Submit"
        confirmVariant="primary"
      />
    </Container>
  );
};

export default QuizPage;
