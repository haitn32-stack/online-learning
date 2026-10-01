const { Slider } = require('../models');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination.util');

const getActiveSliders = async () => {
  return Slider.findAll({
    where: { status: true },
    order: [['orderNum', 'ASC'], ['createdAt', 'DESC']]
  });
};

const getAllSliders = async (query) => {
  const { page, size, search, status } = query;
  const { limit, offset } = getPagination(page, size);

  const condition = {};
  if (status !== undefined) {
    condition.status = status === 'true';
  }
  
  if (search) {
    condition.title = { [Op.like]: `%${search}%` };
  }

  const data = await Slider.findAndCountAll({
    where: condition,
    limit,
    offset,
    order: [['orderNum', 'ASC'], ['createdAt', 'DESC']]
  });

  return getPagingData(data, page, limit);
};

const getSliderById = async (id) => {
  const slider = await Slider.findByPk(id);
  if (!slider) throw new Error('Slider not found');
  return slider;
};

const createSlider = async (data) => {
  return Slider.create({ ...data, status: true });
};

const updateSlider = async (id, data) => {
  const slider = await Slider.findByPk(id);
  if (!slider) throw new Error('Slider not found');

  await slider.update(data);
  return slider;
};

module.exports = {
  getActiveSliders,
  getAllSliders,
  getSliderById,
  createSlider,
  updateSlider
};
