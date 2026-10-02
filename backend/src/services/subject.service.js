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
        if (status !== undefined && status !== '') {
            whereCondition.status = status === 'Active' || status === 'true' || status === true;
        }
        if (published !== undefined && published !== '') {
            whereCondition.published = published === 'true' || published === true;
        }

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

        const result = getPagingData(subjects, page, limit);
        if (result.items) {
            result.items = result.items.map(s => {
                const sObj = s.toJSON();
                sObj.thumbnailUrl = sObj.thumbnail || sObj.thumbnailUrl || '';
                sObj.categoryName = sObj.category ? sObj.category.name : '';
                sObj.ownerName = sObj.owner ? sObj.owner.fullName : '';
                sObj.status = sObj.status ? 'Active' : 'Inactive';
                sObj.isPublished = sObj.published;
                return sObj;
            });
        }
        return result;
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

        let lessonsCount = 0;
        if (Lesson) {
            lessonsCount = await Lesson.count({ where: { subjectId: id } });
        }

        const subjectData = subject.toJSON();
        subjectData.lessonsCount = lessonsCount;
        subjectData.thumbnailUrl = subjectData.thumbnail || subjectData.thumbnailUrl || '';
        subjectData.categoryName = subjectData.category ? subjectData.category.name : '';
        subjectData.status = subjectData.status ? 'Active' : 'Inactive';
        subjectData.isPublished = subjectData.published;
        return subjectData;
    }

    async createSubject(data, ownerId) {
        const subjectData = { ...data, ownerId };

        if (subjectData.thumbnailUrl && !subjectData.thumbnail) {
            subjectData.thumbnail = subjectData.thumbnailUrl;
        }

        if (subjectData.status !== undefined) {
            subjectData.status = subjectData.status === 'Active' || subjectData.status === true || subjectData.status === 'true';
        }

        if (subjectData.categoryId) {
            subjectData.categoryId = parseInt(subjectData.categoryId, 10);
            const category = await Category.findByPk(subjectData.categoryId);
            if (!category) {
                const categoryNames = { 1: 'IT', 2: 'Business', 3: 'Language' };
                await Category.create({
                    id: subjectData.categoryId,
                    name: categoryNames[subjectData.categoryId] || `Category ${subjectData.categoryId}`,
                    type: 'Subject'
                });
            }
        }

        const subject = await Subject.create(subjectData);
        const subjectObj = subject.toJSON();
        subjectObj.thumbnailUrl = subjectObj.thumbnail || '';
        subjectObj.status = subjectObj.status ? 'Active' : 'Inactive';
        subjectObj.isPublished = subjectObj.published;
        return subjectObj;
    }

    async updateSubject(id, data) {
        const subject = await Subject.findByPk(id);
        if (!subject) throw new Error('Subject not found');

        const updateData = { ...data };
        if (updateData.thumbnailUrl && !updateData.thumbnail) {
            updateData.thumbnail = updateData.thumbnailUrl;
        }

        if (updateData.status !== undefined) {
            updateData.status = updateData.status === 'Active' || updateData.status === true || updateData.status === 'true';
        }

        if (updateData.categoryId) {
            updateData.categoryId = parseInt(updateData.categoryId, 10);
            const category = await Category.findByPk(updateData.categoryId);
            if (!category) {
                const categoryNames = { 1: 'IT', 2: 'Business', 3: 'Language' };
                await Category.create({
                    id: updateData.categoryId,
                    name: categoryNames[updateData.categoryId] || `Category ${updateData.categoryId}`,
                    type: 'Subject'
                });
            }
        }

        await subject.update(updateData);
        const subjectObj = subject.toJSON();
        subjectObj.thumbnailUrl = subjectObj.thumbnail || '';
        subjectObj.status = subjectObj.status ? 'Active' : 'Inactive';
        subjectObj.isPublished = subjectObj.published;
        return subjectObj;
    }

    async togglePublish(id, published) {
        const subject = await Subject.findByPk(id);
        if (!subject) throw new Error('Subject not found');

        subject.published = published === true || published === 'true';
        await subject.save();
        const subjectObj = subject.toJSON();
        subjectObj.status = subjectObj.status ? 'Active' : 'Inactive';
        subjectObj.isPublished = subjectObj.published;
        return subjectObj;
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

        const result = getPagingData(subjects, page, limit);
        if (result.items) {
            result.items = result.items.map(s => {
                const sObj = s.toJSON();
                sObj.thumbnailUrl = sObj.thumbnail || sObj.thumbnailUrl || '';
                sObj.categoryName = sObj.category ? sObj.category.name : '';
                sObj.status = sObj.status ? 'Active' : 'Inactive';
                sObj.isPublished = sObj.published;
                return sObj;
            });
        }
        return result;
    }
}

module.exports = new SubjectService();
