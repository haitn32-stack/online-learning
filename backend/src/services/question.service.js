const { db } = require('../models');
const { Question, Subject, SubjectDimension } = db;
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination.util');

/**
 * Get all questions with pagination, search, and filters
 * @param {Object} query 
 * @returns {Object}
 */
const getAllQuestions = async (query) => {
    const { page, size, search, subjectId, dimensionId, level, status } = query;
    const { limit, offset } = getPagination(page, size);

    const condition = {};
    if (search) {
        condition.content = { [Op.like]: `%${search}%` };
    }
    if (subjectId) condition.subjectId = subjectId;
    if (dimensionId) condition.dimensionId = dimensionId;
    if (level) condition.level = level;
    if (status !== undefined) condition.status = status;

    const data = await Question.findAndCountAll({
        where: condition,
        limit,
        offset,
        include: [
            { model: Subject, attributes: ['id', 'name'] },
            { model: SubjectDimension, attributes: ['id', 'name'] }
        ]
    });

    return getPagingData(data, page, limit);
};

/**
 * Get question by ID
 * @param {number} id 
 * @returns {Object}
 */
const getQuestionById = async (id) => {
    return await Question.findByPk(id, {
        include: [
            { model: Subject, attributes: ['id', 'name'] },
            { model: SubjectDimension, attributes: ['id', 'name'] }
        ]
    });
};

/**
 * Create a new question
 * @param {Object} data 
 * @returns {Object}
 */
const createQuestion = async (data) => {
    return await Question.create(data);
};

/**
 * Update an existing question
 * @param {number} id 
 * @param {Object} data 
 * @returns {Object}
 */
const updateQuestion = async (id, data) => {
    const question = await Question.findByPk(id);
    if (!question) {
        throw new Error('Question not found');
    }
    return await question.update(data);
};

/**
 * Toggle question status
 * @param {number} id 
 * @returns {Object}
 */
const toggleQuestionStatus = async (id) => {
    const question = await Question.findByPk(id);
    if (!question) {
        throw new Error('Question not found');
    }
    const newStatus = typeof question.status === 'boolean' ? !question.status : (question.status === 1 ? 0 : 1);
    return await question.update({ status: newStatus });
};

/**
 * Import questions in bulk
 * @param {number} subjectId 
 * @param {Array} questions 
 * @returns {Array}
 */
const importQuestions = async (subjectId, questions) => {
    const questionsToCreate = questions.map(q => ({
        ...q,
        subjectId
    }));
    return await Question.bulkCreate(questionsToCreate);
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    toggleQuestionStatus,
    importQuestions
};
