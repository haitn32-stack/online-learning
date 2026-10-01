const questionService = require('../services/question.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

const getAllQuestions = async (req, res) => {
    try {
        const data = await questionService.getAllQuestions(req.query);
        return paginatedResponse(res, data, 'Questions retrieved successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const getQuestionById = async (req, res) => {
    try {
        const question = await questionService.getQuestionById(req.params.id);
        if (!question) {
            return errorResponse(res, 'Question not found', 404);
        }
        return successResponse(res, question, 'Question retrieved successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const createQuestion = async (req, res) => {
    try {
        const question = await questionService.createQuestion(req.body);
        return successResponse(res, question, 'Question created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const updateQuestion = async (req, res) => {
    try {
        const question = await questionService.updateQuestion(req.params.id, req.body);
        return successResponse(res, question, 'Question updated successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const toggleQuestionStatus = async (req, res) => {
    try {
        const question = await questionService.toggleQuestionStatus(req.params.id);
        return successResponse(res, question, 'Question status toggled successfully');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

const importQuestions = async (req, res) => {
    try {
        const { subjectId, questions } = req.body;
        const importedQuestions = await questionService.importQuestions(subjectId, questions);
        return successResponse(res, importedQuestions, 'Questions imported successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    toggleQuestionStatus,
    importQuestions
};
