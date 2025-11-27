import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout'
import { Home } from './pages/Home'
import { BrandForm } from './pages/BrandForm'
import { OrganizerForm } from './pages/OrganizerForm'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AiOnboarding } from './pages/AiOnboarding'
import { BrandDashboard } from './pages/dashboard/BrandDashboard'
import { OrganizerDashboard } from './pages/dashboard/OrganizerDashboard'
import { MatchDetails } from './pages/dashboard/MatchDetails'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { CommunityPage } from './pages/CommunityPage'
import { CommunityRegistration } from './pages/CommunityRegistration'
import { CommunityMemberDetail } from './pages/CommunityMemberDetail'
import { BrandsDirectoryPage } from './pages/BrandsDirectoryPage'
import { OrganizersDirectoryPage } from './pages/OrganizersDirectoryPage'
import { SavedItemsPage } from './pages/dashboard/SavedItemsPage'
import { InspirationBoardPage } from './pages/dashboard/InspirationBoardPage'
import { LoginTroubleshooting } from './pages/LoginTroubleshooting'
import { MessagesPage } from './pages/dashboard/MessagesPage'
import { MatchesPage } from './pages/dashboard/MatchesPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DraftProfileProvider } from './context/DraftProfileContext'
import { HelpChat } from './components/HelpChat'
import { RegistrationDebugHelper } from './components/RegistrationDebugHelper'
import { initializeCommunityMembers } from './services/communityService'
import { initializeCollaborations } from './services/collaborationService'
import { initEmailJS } from './services/emailService'
import { TechCursor } from './components/effects'
import './styles/tech-effects.css'
// Protected route component
const ProtectedRoute = ({
  children,
  requiredType
}: {
  children: React.ReactNode
  requiredType?: 'brand' | 'organizer' | 'admin'
}) => {
  const { currentUser } = useAuth()
  if (!currentUser) {
    return <Navigate to='/login' replace />
  }
  if (requiredType && currentUser.type !== requiredType) {
    if (currentUser.type === 'brand') {
      return <Navigate to='/dashboard/brand' replace />
    } else if (currentUser.type === 'organizer') {
      return <Navigate to='/dashboard/organizer' replace />
    } else {
      return <Navigate to='/admin' replace />
    }
  }
  return <>{children}</>
}
const AppRoutes = () => {
  useEffect(() => {
    // Initialize sample community members
    initializeCommunityMembers()
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
      {/* Directory pages */}
      <Route path='/brands' element={<BrandsDirectoryPage />} />
      <Route path='/organizers' element={<OrganizersDirectoryPage />} />
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
    <BrowserRouter>
      <AuthProvider>
        <DraftProfileProvider>
          <AppRoutes />
          <HelpChat />
          <TechCursor />
          {typeof process !== 'undefined' &&
            process.env?.NODE_ENV === 'development' && (
              <RegistrationDebugHelper />
            )}
        </DraftProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
