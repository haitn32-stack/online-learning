const db = require('../models');
const { Quiz, Subject, Question, QuizQuestion, QuizResult, QuizAnswer } = db;
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination.util');

const getAllQuizzes = async (query) => {
    const { page, size, search, subjectId, level, type, status } = query;
    const { limit, offset } = getPagination(page, size);

    const condition = {};
    if (search) {
        condition.title = { [Op.like]: `%${search}%` };
    }
    if (subjectId) condition.subjectId = subjectId;
    if (level) condition.level = level;
    if (type) condition.type = type;
    if (status !== undefined) condition.status = status;

    const data = await Quiz.findAndCountAll({
        where: condition,
        limit,
        offset,
        include: [{ model: Subject }]
    });

    return getPagingData(data, page, limit);
};

const getQuizById = async (id) => {
    return await Quiz.findByPk(id, {
        include: [
            { model: Subject },
            { model: Question, through: { attributes: [] } } // Through QuizQuestion
        ]
    });
};

const createQuiz = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        const quiz = await Quiz.create(data, { transaction });
        
        // Randomly select questions
        const questionCondition = { subjectId: data.subjectId };
        if (data.level && data.level !== 'Mixed') {
            questionCondition.level = data.level;
        }

        const questions = await Question.findAll({
            where: questionCondition,
            order: db.sequelize.random(),
            limit: data.questionCount,
            transaction
        });

        if (questions.length < data.questionCount) {
            throw new Error('Not enough questions available for the specified criteria');
        }

        const quizQuestions = questions.map(q => ({
            quizId: quiz.id,
            questionId: q.id
        }));

        await QuizQuestion.bulkCreate(quizQuestions, { transaction });

        await transaction.commit();
        return quiz;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateQuiz = async (id, data) => {
    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
        throw new Error('Quiz not found');
    }
    return await quiz.update(data);
};

const submitQuiz = async (userId, quizId, answers) => {
    const transaction = await db.sequelize.transaction();
    try {
        const quiz = await Quiz.findByPk(quizId, {
            include: [{ model: Question, through: { attributes: [] } }],
            transaction
        });

        if (!quiz) {
            throw new Error('Quiz not found');
        }

        let totalCorrect = 0;
        const totalQuestions = quiz.Questions.length;
        
        // Create answers array for bulk creation
        const quizAnswersData = [];

        // Check answers
        for (const answer of answers) {
            const question = quiz.Questions.find(q => q.id === answer.questionId);
            if (question) {
                const isCorrect = question.correctAnswer === answer.selectedAnswer;
                if (isCorrect) totalCorrect++;

                quizAnswersData.push({
                    questionId: question.id,
                    selectedAnswer: answer.selectedAnswer,
                    isCorrect
                });
            }
        }

        const score = (totalCorrect / totalQuestions) * 100;
        const passed = score >= quiz.passRate;

        // Assuming startTime is calculated or passed in. Defaulting to just now.
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - (quiz.duration * 60000)); // rough estimate if not provided

        const quizResult = await QuizResult.create({
            userId,
            quizId,
            score,
            totalCorrect,
            totalQuestions,
            passed,
            startTime,
            endTime
        }, { transaction });

        // Add result ID to answers
        const finalAnswersData = quizAnswersData.map(a => ({
            ...a,
            quizResultId: quizResult.id
        }));

        await QuizAnswer.bulkCreate(finalAnswersData, { transaction });

        await transaction.commit();

        return {
            ...quizResult.toJSON(),
            answers: finalAnswersData
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getQuizResults = async (userId, query) => {
    const { page, size } = query;
    const { limit, offset } = getPagination(page, size);

    const data = await QuizResult.findAndCountAll({
        where: { userId },
        limit,
        offset,
        include: [{ 
            model: Quiz, 
            include: [{ model: Subject }] 
        }],
        order: [['createdAt', 'DESC']]
    });

    return getPagingData(data, page, limit);
};

const getQuizResultById = async (resultId) => {
    return await QuizResult.findByPk(resultId, {
        include: [
            { model: Quiz },
            { 
                model: QuizAnswer,
                include: [{ model: Question }]
            }
        ]
    });
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    submitQuiz,
    getQuizResults,
    getQuizResultById
};
