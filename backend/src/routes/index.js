const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const subjectRoutes = require('./subject.routes');
const dimensionRoutes = require('./dimension.routes');
const pricePackageRoutes = require('./pricePackage.routes');
const lessonRoutes = require('./lesson.routes');
const questionRoutes = require('./question.routes');
const quizRoutes = require('./quiz.routes');
const registrationRoutes = require('./registration.routes');
const blogRoutes = require('./blog.routes');
const sliderRoutes = require('./slider.routes');
const settingRoutes = require('./setting.routes');
const dashboardRoutes = require('./dashboard.routes');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/subjects', subjectRoutes);
  app.use('/api/dimensions', dimensionRoutes);
  app.use('/api/price-packages', pricePackageRoutes);
  app.use('/api/lessons', lessonRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/quizzes', quizRoutes);
  app.use('/api/registrations', registrationRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/sliders', sliderRoutes);
  app.use('/api/settings', settingRoutes);
  app.use('/api/dashboard', dashboardRoutes);
};
