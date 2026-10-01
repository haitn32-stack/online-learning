const lessonService = require('../services/lesson.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const { db } = require('../models');
const { ROLES } = require('../constants');

const getLessonsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userRole = req.user.role; // Assuming req.user is populated by authenticate
    let includeInactive = false;

    if (userRole === ROLES.EXPERT || userRole === ROLES.ADMIN) {
      includeInactive = true;
    } else if (userRole === ROLES.STUDENT) {
      // Check if student has paid/completed registration for the subject
      const registration = await db.Registration.findOne({
        where: {
          userId: req.user.id,
          subjectId: subjectId,
          status: 'completed' // Assuming 'completed' is a valid status
        }
      });
      if (!registration) {
        return errorResponse(res, 'Forbidden: Active registration required to view lessons', 403);
      }
    }

    const lessons = await lessonService.getLessonsBySubject(subjectId, includeInactive);
    return successResponse(res, 'Lessons retrieved successfully', lessons);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await lessonService.getLessonById(id);
    if (!lesson) {
      return errorResponse(res, 'Lesson not found', 404);
    }
    return successResponse(res, 'Lesson retrieved successfully', lesson);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const createLesson = async (req, res) => {
  try {
    const lesson = await lessonService.createLesson(req.body);
    return successResponse(res, 'Lesson created successfully', lesson, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await lessonService.updateLesson(id, req.body);
    return successResponse(res, 'Lesson updated successfully', lesson);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const toggleLessonStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await lessonService.toggleLessonStatus(id);
    return successResponse(res, 'Lesson status toggled successfully', lesson);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getLessonsBySubject,
  getLessonById,
  createLesson,
  updateLesson,
  toggleLessonStatus
};
