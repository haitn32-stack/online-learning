const { Subject, Category, User, SubjectDimension, PricePackage, Lesson } = require('../models');
const { Op } = require('sequelize');
const { getPagingData, getPagination } = require('../utils/pagination.util');

class SubjectService {
    async getAllSubjects(query) {
        const { page = 1, size = 10, search, categoryId, status, published, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
        const { limit, offset } = getPagination(page, size);

        const whereCondition = {};
        if (search) whereCondition.title = { [Op.like]: `%${search}%` };
        if (categoryId) whereCondition.categoryId = categoryId;
        if (status !== undefined) whereCondition.status = status === 'true';
        if (published !== undefined) whereCondition.published = published === 'true';

        const subjects = await Subject.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [[sortBy, sortOrder]],
            include: [
                { model: Category, as: 'category' },
                { model: User, as: 'owner', attributes: ['id', 'fullName', 'email'] }
            ]
        });

        return getPagingData(subjects, page, limit);
    }

    async getSubjectById(id) {
        const subject = await Subject.findByPk(id, {
            include: [
                { model: Category, as: 'category' },
                { model: User, as: 'owner', attributes: ['id', 'fullName', 'email'] },
                { model: SubjectDimension, as: 'dimensions' },
                { model: PricePackage, as: 'pricePackages' }
            ]
        });
        if (!subject) throw new Error('Subject not found');

        // Assuming lessons count logic
        let lessonsCount = 0;
        if (Lesson) {
            lessonsCount = await Lesson.count({ where: { subjectId: id } });
        }

        const subjectData = subject.toJSON();
        subjectData.lessonsCount = lessonsCount;
        return subjectData;
    }

    async createSubject(data, ownerId) {
        const subject = await Subject.create({
            ...data,
            ownerId
        });
        return subject;
    }

    async updateSubject(id, data) {
        const subject = await Subject.findByPk(id);
        if (!subject) throw new Error('Subject not found');

        await subject.update(data);
        return subject;
    }

    async togglePublish(id, published) {
        const subject = await Subject.findByPk(id);
        if (!subject) throw new Error('Subject not found');

        subject.published = published;
        await subject.save();
        return subject;
    }

    async getPublishedSubjects(query) {
        const { page = 1, size = 10, search, categoryId, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
        const { limit, offset } = getPagination(page, size);

        const whereCondition = { published: true, status: true };
        if (search) whereCondition.title = { [Op.like]: `%${search}%` };
        if (categoryId) whereCondition.categoryId = categoryId;

        const subjects = await Subject.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [[sortBy, sortOrder]],
            include: [
                { model: Category, as: 'category' },
                { model: User, as: 'owner', attributes: ['id', 'fullName'] }
            ]
        });

        return getPagingData(subjects, page, limit);
    }
}

module.exports = new SubjectService();
