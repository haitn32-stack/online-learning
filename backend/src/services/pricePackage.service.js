const db = require('../models');

/**
 * Find all packages for a subject, include Subject info
 * @param {number} subjectId
 */
const getPackagesBySubject = async (subjectId) => {
  const pkgs = await db.PricePackage.findAll({
    where: { subjectId },
    include: [{ model: db.Subject, as: 'subject' }]
  });
  return pkgs.map(p => {
    const pObj = p.toJSON();
    pObj.status = pObj.status ? 'Active' : 'Inactive';
    return pObj;
  });
};

/**
 * Find by PK with Subject
 * @param {number} id
 */
const getPackageById = async (id) => {
  const pkg = await db.PricePackage.findByPk(id, {
    include: [{ model: db.Subject, as: 'subject' }]
  });
  if (!pkg) return null;
  const pObj = pkg.toJSON();
  pObj.status = pObj.status ? 'Active' : 'Inactive';
  return pObj;
};

/**
 * Create package, verify subject exists
 * @param {object} data
 */
const createPackage = async (data) => {
  const pkgData = { ...data };
  if (pkgData.subjectId) pkgData.subjectId = parseInt(pkgData.subjectId, 10);
  const subject = await db.Subject.findByPk(pkgData.subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }
  if (pkgData.status !== undefined) {
    pkgData.status = pkgData.status === 'Active' || pkgData.status === true || pkgData.status === 'true';
  }
  const created = await db.PricePackage.create(pkgData);
  const pObj = created.toJSON();
  pObj.status = pObj.status ? 'Active' : 'Inactive';
  return pObj;
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
  const updateData = { ...data };
  if (updateData.status !== undefined) {
    updateData.status = updateData.status === 'Active' || updateData.status === true || updateData.status === 'true';
  }
  await pricePackage.update(updateData);
  const pObj = pricePackage.toJSON();
  pObj.status = pObj.status ? 'Active' : 'Inactive';
  return pObj;
};

module.exports = {
  getPackagesBySubject,
  getPackageById,
  createPackage,
  updatePackage
};
