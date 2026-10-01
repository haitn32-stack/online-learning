const blogService = require('../services/blog.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

const getPublicBlogs = async (req, res) => {
  try {
    const data = await blogService.getPublicBlogs(req.query);
    return paginatedResponse(res, data, 'Public blogs fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getBlogById = async (req, res) => {
  try {
    const data = await blogService.getBlogById(req.params.id);
    return successResponse(res, data, 'Blog fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const data = await blogService.getAllBlogs(req.query);
    return paginatedResponse(res, data, 'All blogs fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const createBlog = async (req, res) => {
  try {
    const data = await blogService.createBlog(req.user.id, req.body);
    return successResponse(res, data, 'Blog created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const updateBlog = async (req, res) => {
  try {
    const data = await blogService.updateBlog(req.params.id, req.body);
    return successResponse(res, data, 'Blog updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const data = await blogService.toggleFeatured(req.params.id);
    return successResponse(res, data, 'Blog featured status toggled successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getPublicBlogs,
  getBlogById,
  getAllBlogs,
  createBlog,
  updateBlog,
  toggleFeatured
};
