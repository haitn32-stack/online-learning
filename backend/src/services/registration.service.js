const { Registration, PricePackage, Subject, User } = require('../models');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination.util');
const { sendPaymentSuccessEmail } = require('../jobs/email.job');

/**
 * Create a new registration for a student
 */
const createRegistration = async (userId, data) => {
  const { subjectId, packageId } = data;

  // Verify no duplicate active registration
  const existingRegistration = await Registration.findOne({
    where: {
      userId,
      subjectId,
      status: {
        [Op.in]: ['Submitted', 'Paid']
      }
    }
  });

  if (existingRegistration) {
    throw new Error('You already have an active registration for this subject.');
  }

  // Get package details
  const pricePackage = await PricePackage.findByPk(packageId);
  if (!pricePackage) {
    throw new Error('Price package not found');
  }

  // Create registration
  const registration = await Registration.create({
    userId,
    subjectId,
    packageId,
    totalCost: pricePackage.salePrice,
    status: 'Submitted'
  });

  return registration;
};

/**
 * Get paginated list of registrations for a student
 */
const getMyRegistrations = async (userId, query) => {
  const { page, size, status } = query;
  const { limit, offset } = getPagination(page, size);

  const condition = { userId };
  if (status) {
    condition.status = status;
  }

  const data = await Registration.findAndCountAll({
    where: condition,
    limit,
    offset,
    include: [
      { model: Subject, attributes: ['id', 'title', 'thumbnail'] },
      { model: PricePackage, attributes: ['id', 'name', 'duration', 'salePrice'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  return getPagingData(data, page, limit);
};

/**
 * Cancel a pending registration
 */
const cancelRegistration = async (userId, registrationId) => {
  const registration = await Registration.findOne({
    where: { id: registrationId, userId }
  });

  if (!registration) {
    throw new Error('Registration not found');
  }

  if (registration.status !== 'Submitted') {
    throw new Error('Only submitted registrations can be cancelled');
  }

  registration.status = 'Cancelled';
  await registration.save();
  
  return registration;
};

/**
 * Update a student\'s own pending registration
 */
const updateMyRegistration = async (userId, registrationId, data) => {
  const { packageId } = data;
  
  const registration = await Registration.findOne({
    where: { id: registrationId, userId }
  });

  if (!registration) {
    throw new Error('Registration not found');
  }

  if (registration.status !== 'Submitted') {
    throw new Error('Only submitted registrations can be updated');
  }

  if (packageId && packageId !== registration.packageId) {
    const pricePackage = await PricePackage.findByPk(packageId);
    if (!pricePackage) {
      throw new Error('Price package not found');
    }
    registration.packageId = packageId;
    registration.totalCost = pricePackage.salePrice;
  }

  await registration.save();
  return registration;
};

/**
 * Get all registrations (for Sale/Admin)
 */
const getAllRegistrations = async (query) => {
  const { page, size, search, status, subjectId, sortBy, sortOrder } = query;
  const { limit, offset } = getPagination(page, size);

  const condition = {};
  if (status) condition.status = status;
  if (subjectId) condition.subjectId = subjectId;

  const userCondition = {};
  if (search) {
    userCondition[Op.or] = [
      { email: { [Op.like]: `%${search}%` } },
      { fullName: { [Op.like]: `%${search}%` } }
    ];
  }

  const order = [];
  if (sortBy === 'date') {
    order.push(['createdAt', sortOrder === 'asc' ? 'ASC' : 'DESC']);
  } else if (sortBy === 'totalCost') {
    order.push(['totalCost', sortOrder === 'asc' ? 'ASC' : 'DESC']);
  } else {
    order.push(['createdAt', 'DESC']);
  }

  const data = await Registration.findAndCountAll({
    where: condition,
    limit,
    offset,
    order,
    include: [
      { model: User, where: userCondition, attributes: ['id', 'email', 'fullName'] },
      { model: Subject, attributes: ['id', 'title'] },
      { model: PricePackage, attributes: ['id', 'name', 'duration'] }
    ]
  });

  const result = getPagingData(data, page, limit);
  if (result.items) {
    result.items = result.items.map(r => {
      const rObj = r.toJSON();
      rObj.studentName = rObj.User?.fullName || '';
      rObj.email = rObj.User?.email || '';
      rObj.courseTitle = rObj.Subject?.title || '';
      rObj.packageName = rObj.PricePackage?.name || '';
      return rObj;
    });
  }

  return result;
};

/**
 * Get registration by ID
 */
const getRegistrationById = async (id) => {
  const registration = await Registration.findByPk(id, {
    include: [
      { model: User, attributes: ['id', 'email', 'fullName', 'phone'] },
      { model: Subject, attributes: ['id', 'title', 'thumbnail'] },
      { model: PricePackage, attributes: ['id', 'name', 'duration', 'salePrice'] }
    ]
  });

  if (!registration) {
    throw new Error('Registration not found');
  }

  return registration;
};

/**
 * Update registration status (for Sale/Admin)
 */
const updateRegistrationStatus = async (id, status, staffNotes) => {
  const registration = await Registration.findByPk(id, {
    include: [{ model: PricePackage }, { model: User }]
  });

  if (!registration) {
    throw new Error('Registration not found');
  }

  const oldStatus = registration.status;
  registration.status = status;
  if (staffNotes !== undefined) {
    registration.staffNotes = staffNotes;
  }

  if (status === 'Paid' && oldStatus !== 'Paid') {
    const now = new Date();
    const durationDays = registration.PricePackage ? registration.PricePackage.duration : 30;
    
    registration.validFrom = now;
    const validTo = new Date(now);
    validTo.setDate(validTo.getDate() + durationDays);
    registration.validTo = validTo;
  }

  await registration.save();

  if (status === 'Paid' && oldStatus !== 'Paid' && registration.User) {
    try {
      await sendPaymentSuccessEmail(registration.User.email, registration);
    } catch (error) {
      console.error('Failed to send payment success email', error);
    }
  }

  return registration;
};

/**
 * Create a registration on behalf of a user (for Sale/Admin)
 */
const createRegistrationByStaff = async (data) => {
  const { userId, subjectId, packageId, notes } = data;

  const pricePackage = await PricePackage.findByPk(packageId);
  if (!pricePackage) {
    throw new Error('Price package not found');
  }

  const registration = await Registration.create({
    userId,
    subjectId,
    packageId,
    totalCost: pricePackage.salePrice,
    status: 'Submitted',
    staffNotes: notes
  });

  return registration;
};

module.exports = {
  createRegistration,
  getMyRegistrations,
  cancelRegistration,
  updateMyRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  createRegistrationByStaff
};
