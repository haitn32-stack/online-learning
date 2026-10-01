const { Blog, User, Category } = require('../models');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination.util');

const getPublicBlogs = async (query) => {
  const { page, size, search, categoryId, featured } = query;
  const { limit, offset } = getPagination(page, size);

  const condition = { status: true }; // active blogs only
  if (categoryId) condition.categoryId = categoryId;
  if (featured !== undefined) condition.featured = featured === 'true';

  if (search) {
    condition[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { briefInfo: { [Op.like]: `%${search}%` } }
    ];
  }

  const data = await Blog.findAndCountAll({
    where: condition,
    limit,
    offset,
    include: [
      { model: User, as: 'author', attributes: ['id', 'fullName', 'avatar'] },
      { model: Category, attributes: ['id', 'name'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  return getPagingData(data, page, limit);
};

const getBlogById = async (id) => {
  const blog = await Blog.findByPk(id, {
    include: [
      { model: User, as: 'author', attributes: ['id', 'fullName', 'avatar'] },
      { model: Category, attributes: ['id', 'name'] }
    ]
  });

  if (!blog) throw new Error('Blog not found');
  return blog;
};

const getAllBlogs = async (query) => {
  const { page, size, search, categoryId, status, featured, sortBy, sortOrder } = query;
  const { limit, offset } = getPagination(page, size);

  const condition = {};
  if (categoryId) condition.categoryId = categoryId;
  if (status !== undefined) condition.status = status === 'true';
  if (featured !== undefined) condition.featured = featured === 'true';

  if (search) {
    condition[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { briefInfo: { [Op.like]: `%${search}%` } }
    ];
  }

  const order = [];
  if (sortBy) {
    order.push([sortBy, sortOrder === 'asc' ? 'ASC' : 'DESC']);
  } else {
    order.push(['createdAt', 'DESC']);
  }

  const data = await Blog.findAndCountAll({
    where: condition,
    limit,
    offset,
    include: [
      { model: User, as: 'author', attributes: ['id', 'fullName', 'email'] },
      { model: Category, attributes: ['id', 'name'] }
    ],
    order
  });

  return getPagingData(data, page, limit);
};

const createBlog = async (authorId, data) => {
  const blog = await Blog.create({
    ...data,
    authorId,
    status: true // default to active
  });
  return blog;
};

const updateBlog = async (id, data) => {
  const blog = await Blog.findByPk(id);
  if (!blog) throw new Error('Blog not found');

  await blog.update(data);
  return blog;
};

const toggleFeatured = async (id) => {
  const blog = await Blog.findByPk(id);
  if (!blog) throw new Error('Blog not found');

  blog.featured = !blog.featured;
  await blog.save();
  return blog;
};

module.exports = {
  getPublicBlogs,
  getBlogById,
  getAllBlogs,
  createBlog,
  updateBlog,
  toggleFeatured
};
