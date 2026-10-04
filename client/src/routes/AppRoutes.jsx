import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import StudentDashboard from '../pages/StudentDashboard';
import FacultyDashboard from '../pages/FacultyDashboard';
import NoticeDetails from '../pages/NoticeDetails';
import NoticeForm from '../pages/NoticeForm';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import Landing from '../pages/Landing';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute roles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/notices/new" element={<ProtectedRoute roles={['faculty']}><NoticeForm /></ProtectedRoute>} />
        <Route path="/notices/:id/edit" element={<ProtectedRoute roles={['faculty']}><NoticeForm /></ProtectedRoute>} />
        <Route path="/notices/:id" element={<NoticeDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
