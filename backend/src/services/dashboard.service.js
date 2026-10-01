const { Registration, Subject, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async () => {
  // 1. Total Subjects
  const totalSubjects = await Subject.count();

  // 2. Registrations stats
  const totalRegistrations = await Registration.count();
  const registrationsByStatus = await Registration.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['status'],
    raw: true
  });

  // 3. Total Revenue (from Paid/Completed)
  const revenueData = await Registration.sum('totalCost', {
    where: {
      status: {
        [Op.in]: ['Paid', 'Completed']
      }
    }
  });
  const totalRevenue = revenueData || 0;

  // 4. Total Customers/Students
  const totalCustomers = await User.count({
    where: {
      role: 'Student'
    }
  });

  // Dates for current month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 5. New registrations this month
  const newRegistrationsThisMonth = await Registration.count({
    where: {
      createdAt: {
        [Op.gte]: firstDayOfMonth
      }
    }
  });

  // 6. Revenue this month
  const revenueThisMonthData = await Registration.sum('totalCost', {
    where: {
      status: {
        [Op.in]: ['Paid', 'Completed']
      },
      createdAt: {
        [Op.gte]: firstDayOfMonth
      }
    }
  });
  const revenueThisMonth = revenueThisMonthData || 0;

  // 7. Top 5 Popular Subjects
  const topSubjects = await Registration.findAll({
    attributes: ['subjectId', [sequelize.fn('COUNT', sequelize.col('Registration.id')), 'registrationCount']],
    include: [{ model: Subject, attributes: ['id', 'title'] }],
    group: ['subjectId', 'Subject.id', 'Subject.title'],
    order: [[sequelize.literal('registrationCount'), 'DESC']],
    limit: 5,
    raw: true,
    nest: true
  });

  // 8. Registration trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const registrationTrend = await Registration.findAll({
    attributes: [
      [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
      [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: {
      createdAt: {
        [Op.gte]: sixMonthsAgo
      }
    },
    group: [
      sequelize.fn('YEAR', sequelize.col('createdAt')), 
      sequelize.fn('MONTH', sequelize.col('createdAt'))
    ],
    order: [
      [sequelize.fn('YEAR', sequelize.col('createdAt')), 'ASC'],
      [sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']
    ],
    raw: true
  });

  return {
    totalSubjects,
    totalRegistrations,
    registrationsByStatus,
    totalRevenue,
    totalCustomers,
    newRegistrationsThisMonth,
    revenueThisMonth,
    topSubjects,
    registrationTrend
  };
};

module.exports = {
  getDashboardStats
};
