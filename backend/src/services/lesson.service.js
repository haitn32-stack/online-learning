const db = require('../models');

/**
 * Find all lessons for subject ordered by orderNum
 * @param {number} subjectId
 * @param {boolean} includeInactive
 */
const getLessonsBySubject = async (subjectId, includeInactive) => {
  const where = { subjectId };
  if (!includeInactive) {
    where.status = true; // Assuming status boolean means active
  }
  return await db.Lesson.findAll({
    where,
    order: [['orderNum', 'ASC']]
  });
};

/**
 * Find by PK with Subject info
 * @param {number} id
 */
const getLessonById = async (id) => {
  return await db.Lesson.findByPk(id, {
    include: [{ model: db.Subject, as: 'subject' }]
  });
};

/**
 * Create lesson, verify subject exists
 * @param {object} data
 */
const createLesson = async (data) => {
  const subject = await db.Subject.findByPk(data.subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }
  return await db.Lesson.create(data);
};

/**
 * Update lesson fields
 * @param {number} id
 * @param {object} data
 */
const updateLesson = async (id, data) => {
  const lesson = await db.Lesson.findByPk(id);
  if (!lesson) {
    throw new Error('Lesson not found');
  }
  return await lesson.update(data);
};

/**
 * Toggle status boolean
 * @param {number} id
 */
const toggleLessonStatus = async (id) => {
  const lesson = await db.Lesson.findByPk(id);
  if (!lesson) {
    throw new Error('Lesson not found');
  }
  return await lesson.update({ status: !lesson.status });
};

module.exports = {
  getLessonsBySubject,
  getLessonById,
  createLesson,
  updateLesson,
  toggleLessonStatus
};
