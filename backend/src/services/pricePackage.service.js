const { db } = require('../models');

/**
 * Find all packages for a subject, include Subject info
 * @param {number} subjectId
 */
const getPackagesBySubject = async (subjectId) => {
  return await db.PricePackage.findAll({
    where: { subjectId },
    include: [{ model: db.Subject, as: 'subject' }]
  });
};

/**
 * Find by PK with Subject
 * @param {number} id
 */
const getPackageById = async (id) => {
  return await db.PricePackage.findByPk(id, {
    include: [{ model: db.Subject, as: 'subject' }]
  });
};

/**
 * Create package, verify subject exists
 * @param {object} data
 */
const createPackage = async (data) => {
  const subject = await db.Subject.findByPk(data.subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }
  return await db.PricePackage.create(data);
};

/**
 * Update package fields
 * @param {number} id
 * @param {object} data
 */
const updatePackage = async (id, data) => {
  const pricePackage = await db.PricePackage.findByPk(id);
  if (!pricePackage) {
    throw new Error('Price Package not found');
  }
  return await pricePackage.update(data);
};

module.exports = {
  getPackagesBySubject,
  getPackageById,
  createPackage,
  updatePackage
};
