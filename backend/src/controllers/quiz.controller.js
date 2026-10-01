const quizService = require('../services/quiz.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

const getAllQuizzes = async (req, res) => {
    try {
        const data = await quizService.getAllQuizzes(req.query);
        return paginatedResponse(res, data, 'Quizzes retrieved successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const getQuizById = async (req, res) => {
    try {
        // If getting by subject for students:
        // You could modify getQuizById or have a separate getQuizzesBySubject 
        // Based on instructions, we'll just handle it basically.
        const quiz = await quizService.getQuizById(req.params.id || req.params.subjectId);
        if (!quiz) {
            return errorResponse(res, 'Quiz not found', 404);
        }
        return successResponse(res, quiz, 'Quiz retrieved successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const createQuiz = async (req, res) => {
    try {
        const quiz = await quizService.createQuiz(req.body);
        return successResponse(res, quiz, 'Quiz created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const updateQuiz = async (req, res) => {
    try {
        const quiz = await quizService.updateQuiz(req.params.id, req.body);
        return successResponse(res, quiz, 'Quiz updated successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const result = await quizService.submitQuiz(req.user.id, quizId, answers);
        return successResponse(res, result, 'Quiz submitted successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const getMyQuizResults = async (req, res) => {
    try {
        const results = await quizService.getQuizResults(req.user.id, req.query);
        return paginatedResponse(res, results, 'Quiz results retrieved successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const getQuizResultById = async (req, res) => {
    try {
        const result = await quizService.getQuizResultById(req.params.resultId);
        if (!result) {
            return errorResponse(res, 'Quiz result not found', 404);
        }
        // Ideally verify if result.userId === req.user.id
        return successResponse(res, result, 'Quiz result retrieved successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    submitQuiz,
    getMyQuizResults,
    getQuizResultById
};
