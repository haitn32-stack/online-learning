const subjectService = require('../services/subject.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

const getAllSubjects = async (req, res) => {
    try {
        const result = await subjectService.getAllSubjects(req.query);
        return paginatedResponse(res, result.items, result.currentPage, req.query.size || 10, result.totalItems, 'Subjects fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const getSubjectById = async (req, res) => {
    try {
        const subject = await subjectService.getSubjectById(req.params.id);
        return successResponse(res, subject, 'Subject fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
};

const createSubject = async (req, res) => {
    try {
        const subject = await subjectService.createSubject(req.body, req.user.id);
        return successResponse(res, subject, 'Subject created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const updateSubject = async (req, res) => {
    try {
        const subject = await subjectService.updateSubject(req.params.id, req.body);
        return successResponse(res, subject, 'Subject updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const togglePublish = async (req, res) => {
    try {
        const subject = await subjectService.togglePublish(req.params.id, req.body.published);
        return successResponse(res, subject, `Subject ${req.body.published ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const getPublishedSubjects = async (req, res) => {
    try {
        const result = await subjectService.getPublishedSubjects(req.query);
        return paginatedResponse(res, result.items, result.currentPage, req.query.size || 10, result.totalItems, 'Published subjects fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    togglePublish,
    getPublishedSubjects
};
