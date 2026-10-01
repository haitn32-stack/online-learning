import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Public Pages
import HomePage from './pages/public/HomePage';
import CourseListPage from './pages/public/CourseListPage';
import CourseDetailPage from './pages/public/CourseDetailPage';
import BlogListPage from './pages/public/BlogListPage';
import BlogDetailPage from './pages/public/BlogDetailPage';

// Student Pages
import ProfilePage from './pages/student/ProfilePage';
import ChangePasswordPage from './pages/student/ChangePasswordPage';
import MyCoursesPage from './pages/student/MyCoursesPage';
import MyRegistrationsPage from './pages/student/MyRegistrationsPage';
import RegisterCoursePage from './pages/student/RegisterCoursePage';
import LessonPage from './pages/student/LessonPage';
import QuizPage from './pages/student/QuizPage';
import QuizResultPage from './pages/student/QuizResultPage';

// Marketing Pages
import DashboardPage from './pages/marketing/DashboardPage';
import BlogManagementPage from './pages/marketing/BlogManagementPage';
import BlogFormPage from './pages/marketing/BlogFormPage';
import SliderManagementPage from './pages/marketing/SliderManagementPage';
import SliderFormPage from './pages/marketing/SliderFormPage';

// Expert Pages
import SubjectManagementPage from './pages/expert/SubjectManagementPage';
import SubjectFormPage from './pages/expert/SubjectFormPage';
import DimensionManagementPage from './pages/expert/DimensionManagementPage';
import LessonManagementPage from './pages/expert/LessonManagementPage';
import LessonFormPage from './pages/expert/LessonFormPage';
import QuestionManagementPage from './pages/expert/QuestionManagementPage';
import QuestionFormPage from './pages/expert/QuestionFormPage';
import QuestionImportPage from './pages/expert/QuestionImportPage';
import QuizManagementPage from './pages/expert/QuizManagementPage';
import QuizFormPage from './pages/expert/QuizFormPage';

// Sale Pages
import RegistrationManagementPage from './pages/sale/RegistrationManagementPage';
import RegistrationDetailPage from './pages/sale/RegistrationDetailPage';
import RegistrationFormPage from './pages/sale/RegistrationFormPage';

// Admin Pages
import UserManagementPage from './pages/admin/UserManagementPage';
import UserFormPage from './pages/admin/UserFormPage';
import SettingManagementPage from './pages/admin/SettingManagementPage';
import SettingFormPage from './pages/admin/SettingFormPage';
import SubjectPublishPage from './pages/admin/SubjectPublishPage';
import PricePackageManagementPage from './pages/admin/PricePackageManagementPage';

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
        </Route>

        {/* Auth Routes (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute role="Student"><StudentLayout /></ProtectedRoute>}>
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/change-password" element={<ChangePasswordPage />} />
          <Route path="/student/my-courses" element={<MyCoursesPage />} />
          <Route path="/student/my-registrations" element={<MyRegistrationsPage />} />
          <Route path="/student/register-course/:subjectId" element={<RegisterCoursePage />} />
          <Route path="/student/lessons/:subjectId" element={<LessonPage />} />
          <Route path="/student/quiz/:quizId" element={<QuizPage />} />
          <Route path="/student/quiz-result/:resultId" element={<QuizResultPage />} />
        </Route>

        {/* Marketing Routes */}
        <Route element={<ProtectedRoute role="Marketing"><AdminLayout /></ProtectedRoute>}>
          <Route path="/marketing/dashboard" element={<DashboardPage />} />
          <Route path="/marketing/blogs" element={<BlogManagementPage />} />
          <Route path="/marketing/blogs/create" element={<BlogFormPage />} />
          <Route path="/marketing/blogs/edit/:id" element={<BlogFormPage />} />
          <Route path="/marketing/sliders" element={<SliderManagementPage />} />
          <Route path="/marketing/sliders/create" element={<SliderFormPage />} />
          <Route path="/marketing/sliders/edit/:id" element={<SliderFormPage />} />
        </Route>

        {/* Expert Routes */}
        <Route element={<ProtectedRoute role="Expert"><AdminLayout /></ProtectedRoute>}>
          <Route path="/expert/subjects" element={<SubjectManagementPage />} />
          <Route path="/expert/subjects/create" element={<SubjectFormPage />} />
          <Route path="/expert/subjects/edit/:id" element={<SubjectFormPage />} />
          <Route path="/expert/dimensions/:subjectId" element={<DimensionManagementPage />} />
          <Route path="/expert/lessons/:subjectId" element={<LessonManagementPage />} />
          <Route path="/expert/lessons/create/:subjectId" element={<LessonFormPage />} />
          <Route path="/expert/lessons/edit/:id" element={<LessonFormPage />} />
          <Route path="/expert/questions" element={<QuestionManagementPage />} />
          <Route path="/expert/questions/create" element={<QuestionFormPage />} />
          <Route path="/expert/questions/edit/:id" element={<QuestionFormPage />} />
          <Route path="/expert/questions/import" element={<QuestionImportPage />} />
          <Route path="/expert/quizzes" element={<QuizManagementPage />} />
          <Route path="/expert/quizzes/create" element={<QuizFormPage />} />
          <Route path="/expert/quizzes/edit/:id" element={<QuizFormPage />} />
        </Route>

        {/* Sale Routes */}
        <Route element={<ProtectedRoute role="Sale"><AdminLayout /></ProtectedRoute>}>
          <Route path="/sale/registrations" element={<RegistrationManagementPage />} />
          <Route path="/sale/registrations/create" element={<RegistrationFormPage />} />
          <Route path="/sale/registrations/:id" element={<RegistrationDetailPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute role="Admin"><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/users/create" element={<UserFormPage />} />
          <Route path="/admin/users/edit/:id" element={<UserFormPage />} />
          <Route path="/admin/settings" element={<SettingManagementPage />} />
          <Route path="/admin/settings/create" element={<SettingFormPage />} />
          <Route path="/admin/settings/edit/:id" element={<SettingFormPage />} />
          <Route path="/admin/subjects" element={<SubjectPublishPage />} />
          <Route path="/admin/price-packages/:subjectId" element={<PricePackageManagementPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
