const { Setting } = require('../models');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination.util');

const getAllSettings = async (query) => {
  const { page, size, search, settingType, status, sortBy, sortOrder } = query;
  const { limit, offset } = getPagination(page, size);

  const condition = {};
  if (settingType) condition.settingType = settingType;
  if (status !== undefined) condition.status = status === 'true';
  
  if (search) {
    condition[Op.or] = [
      { settingKey: { [Op.like]: `%${search}%` } },
      { settingType: { [Op.like]: `%${search}%` } }
    ];
  }

  const order = [];
  if (sortBy) {
    order.push([sortBy, sortOrder === 'asc' ? 'ASC' : 'DESC']);
  } else {
    order.push(['settingType', 'ASC'], ['orderNum', 'ASC']);
  }

  const data = await Setting.findAndCountAll({
    where: condition,
    limit,
    offset,
    order
  });

  return getPagingData(data, page, limit);
};

const getSettingById = async (id) => {
  const setting = await Setting.findByPk(id);
  if (!setting) throw new Error('Setting not found');
  return setting;
};

const createSetting = async (data) => {
  const { settingType, settingKey } = data;
  
  const existing = await Setting.findOne({
    where: { settingType, settingKey }
  });
  if (existing) {
    throw new Error(`Setting with type '${settingType}' and key '${settingKey}' already exists`);
  }

  return Setting.create({ ...data, status: true });
};

const updateSetting = async (id, data) => {
  const setting = await Setting.findByPk(id);
  if (!setting) throw new Error('Setting not found');

  if (data.settingType || data.settingKey) {
    const type = data.settingType || setting.settingType;
    const key = data.settingKey || setting.settingKey;

    const existing = await Setting.findOne({
      where: { settingType: type, settingKey: key, id: { [Op.ne]: id } }
    });
    if (existing) {
      throw new Error(`Setting with type '${type}' and key '${key}' already exists`);
    }
  }

  await setting.update(data);
  return setting;
};

const toggleSettingStatus = async (id) => {
  const setting = await Setting.findByPk(id);
  if (!setting) throw new Error('Setting not found');

  setting.status = !setting.status;
  await setting.save();
  return setting;
};

module.exports = {
  getAllSettings,
  getSettingById,
  createSetting,
  updateSetting,
  toggleSettingStatus
};
