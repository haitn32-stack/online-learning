const db = require('../models');

/**
 * Find all dimensions for a subject
 * @param {number} subjectId
 */
const getDimensionsBySubject = async (subjectId) => {
  return await db.SubjectDimension.findAll({
    where: { subjectId }
  });
};

/**
 * Find by PK with Subject info
 * @param {number} id
 */
const getDimensionById = async (id) => {
  return await db.SubjectDimension.findByPk(id, {
    include: [{ model: db.Subject, as: 'subject' }]
  });
};

/**
 * Create dimension, verify subject exists
 * @param {object} data
 */
const createDimension = async (data) => {
  const subject = await db.Subject.findByPk(data.subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }
  return await db.SubjectDimension.create(data);
};

/**
 * Update dimension fields
 * @param {number} id
 * @param {object} data
 */
const updateDimension = async (id, data) => {
  const dimension = await db.SubjectDimension.findByPk(id);
  if (!dimension) {
    throw new Error('Dimension not found');
  }
  return await dimension.update(data);
};

module.exports = {
  getDimensionsBySubject,
  getDimensionById,
  createDimension,
  updateDimension
};
