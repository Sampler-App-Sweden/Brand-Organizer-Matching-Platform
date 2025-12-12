import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { HelpChat } from './components/HelpChat'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RegistrationDebugHelper } from './components/RegistrationDebugHelper'
import { AuthProvider } from './context/AuthContext'
import { DraftProfileProvider } from './context/DraftProfileContext'
import { NotificationsProvider } from './context'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AiOnboarding } from './pages/AiOnboarding'
import { BrandForm } from './pages/BrandForm'
import { ContactPage } from './pages/ContactPage'
import { NotificationsPage } from './pages/dashboard/NotificationsPage'
import { BrandsDirectoryPage } from './pages/BrandsDirectoryPage'
import { CommunityMemberDetail, CommunityPage } from './pages/community'
import { BrandDashboard, OrganizerDashboard } from './pages/dashboard'
import { EditProfilePage } from './pages/dashboard/EditProfilePage'
import { MatchDetails } from './pages/dashboard/MatchDetails'
import { MatchesPage } from './pages/dashboard/MatchesPage'
import { MessagesPage } from './pages/dashboard/MessagesPage'
import { SavedItemsPage } from './pages/dashboard/SavedItemsPage'
import { Home } from './pages/Home'
import { InspirationBoardPage } from './pages/InspirationBoardPage'
import { Login } from './pages/Login'
import { LoginTroubleshooting } from './pages/LoginTroubleshooting'
import { OrganizerForm } from './pages/OrganizerForm'
import { OrganizersDirectoryPage } from './pages/OrganizersDirectoryPage'
import { ProfileDetailPage } from './pages/ProfileDetailPage'
import { CommunityRegistration } from './pages/register/CommunityRegistration'
import { Register } from './pages/register/Register'
import { initializeCollaborations } from './services/collaborationService'
import { initEmailJS } from './services/emailService'

import './styles/tech-effects.css'

// Alias to avoid undefined references in route configs
const Contact = ContactPage

const AppRoutes = () => {
  useEffect(() => {
    // Initialize sample collaborations
    initializeCollaborations()
    // Initialize EmailJS
    initEmailJS()
  }, [])
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/onboarding' element={<AiOnboarding />} />
      <Route path='/brand' element={<BrandForm />} />
      <Route path='/organizer' element={<OrganizerForm />} />
      <Route path='/login' element={<Login />} />
      <Route path='/login/help' element={<LoginTroubleshooting />} />
      <Route path='/register' element={<Register />} />
      <Route path='/contact' element={<Contact />} />
      {/* Directory pages */}
      <Route path='/brands' element={<BrandsDirectoryPage />} />
      <Route path='/organizers' element={<OrganizersDirectoryPage />} />
      <Route path='/profiles/:profileId' element={<ProfileDetailPage />} />
      {/* Community routes */}
      <Route path='/community' element={<CommunityPage />} />
      <Route path='/community/:memberId' element={<CommunityMemberDetail />} />
      <Route path='/community/register' element={<CommunityRegistration />} />

      {/* Brand routes */}
      <Route
        path='/dashboard/brand'
        element={
          <ProtectedRoute requiredType='brand'>
            <BrandDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/brand/matches/:matchId'
        element={
          <ProtectedRoute requiredType='brand'>
            <MatchDetails />
          </ProtectedRoute>
        }
      />
      {/* Organizer routes */}
      <Route
        path='/dashboard/organizer'
        element={
          <ProtectedRoute requiredType='organizer'>
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/organizer/matches/:matchId'
        element={
          <ProtectedRoute requiredType='organizer'>
            <MatchDetails />
          </ProtectedRoute>
        }
      />
      {/* Shared dashboard routes */}
      <Route
        path='/dashboard/edit-profile'
        element={
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/saved'
        element={
          <ProtectedRoute>
            <SavedItemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/inspiration'
        element={
          <ProtectedRoute>
            <InspirationBoardPage />
          </ProtectedRoute>
        }
      />
      {/* New messages and matches routes */}
      <Route
        path='/dashboard/messages'
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/matches'
        element={
          <ProtectedRoute>
            <MatchesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/notifications'
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      {/* Admin routes */}
      <Route
        path='/admin'
        element={
          <ProtectedRoute requiredType='admin'>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      {/* Catch-all redirect */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}
export function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <DraftProfileProvider>
          <NotificationsProvider>
            <AppRoutes />
            <HelpChat />
            {typeof process !== 'undefined' &&
              process.env?.NODE_ENV === 'development' && (
                <RegistrationDebugHelper />
              )}
          </NotificationsProvider>
        </DraftProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
