import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { HelpCenter } from './components/HelpCenter'
import { HelpChat } from './components/HelpChat'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RegistrationDebugHelper } from './components/RegistrationDebugHelper'
import { Toast } from './components/ui'
import { NotificationsProvider } from './context'
import { AuthProvider } from './context/AuthContext'
import { DraftProfileProvider } from './context/DraftProfileContext'
import { useNotifications } from './context/NotificationsContext'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AllBrandsPage } from './pages/admin/AllBrandsPage'
import { AllOrganizersPage } from './pages/admin/AllOrganizersPage'
import { AllMatchesPage } from './pages/admin/AllMatchesPage'
import { AllTicketsPage } from './pages/admin/AllTicketsPage'
import { AllConnectionsPage } from './pages/admin/AllConnectionsPage'
import { AiOnboarding } from './pages/AiOnboarding'
import { BrandForm } from './pages/BrandForm'
import { BrandsDirectoryPage } from './pages/BrandsDirectoryPage'
import { ContactPage } from './pages/ContactPage'
import { BrandDashboard, OrganizerDashboard, SettingsPage } from './pages/dashboard'
import { AccountPage } from './pages/dashboard/AccountPage'
import { ConnectionsPage } from './pages/dashboard/ConnectionsPage'
import { MatchDetails } from './pages/dashboard/MatchDetails'
import { MessagesPage } from './pages/dashboard/MessagesPage'
import { NotificationsPage } from './pages/dashboard/NotificationsPage'
import { SavedItemsPage } from './pages/dashboard/SavedItemsPage'
import { Home } from './pages/Home'
import { InspirationBoardPage } from './pages/InspirationBoardPage'
import { Login } from './pages/Login'
import { LoginTroubleshooting } from './pages/LoginTroubleshooting'
import { OrganizerForm } from './pages/OrganizerForm'
import { OrganizersDirectoryPage } from './pages/OrganizersDirectoryPage'
import { ProfileDetailPage } from './pages/ProfileDetailPage'
import { Register } from './pages/register/Register'
import { initializeCollaborations } from './services/collaborationService'
import { initEmailJS } from './services/emailService'

import './styles/tech-effects.css'

// Alias to avoid undefined references in route configs
const Contact = ContactPage

// Component defining all application routes
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
      <Route path='/help' element={<HelpCenter />} />
      {/* Directory pages */}
      <Route path='/brands' element={<BrandsDirectoryPage />} />
      <Route path='/organizers' element={<OrganizersDirectoryPage />} />
      <Route path='/profiles/:profileId' element={<ProfileDetailPage />} />
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
        path='/dashboard/account'
        element={
          <ProtectedRoute>
            <AccountPage />
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
      {/* New messages and connections routes */}
      <Route
        path='/dashboard/messages'
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/connections'
        element={
          <ProtectedRoute>
            <ConnectionsPage />
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
      <Route
        path='/dashboard/settings'
        element={
          <ProtectedRoute>
            <SettingsPage />
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
      <Route
        path='/admin/brands'
        element={
          <ProtectedRoute requiredType='admin'>
            <AllBrandsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/organizers'
        element={
          <ProtectedRoute requiredType='admin'>
            <AllOrganizersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/matches'
        element={
          <ProtectedRoute requiredType='admin'>
            <AllMatchesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/tickets'
        element={
          <ProtectedRoute requiredType='admin'>
            <AllTicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/connections'
        element={
          <ProtectedRoute requiredType='admin'>
            <AllConnectionsPage />
          </ProtectedRoute>
        }
      />
      {/* Redirects for backward compatibility */}
      <Route
        path='/dashboard/interests'
        element={<Navigate to='/dashboard/connections' replace />}
      />
      <Route
        path='/dashboard/edit-profile'
        element={<Navigate to='/dashboard/account' replace />}
      />
      <Route
        path='/dashboard/matches'
        element={<Navigate to='/dashboard/connections?tab=mutual' replace />}
      />
      <Route
        path='/dashboard/products'
        element={<Navigate to='/dashboard/account?tab=products' replace />}
      />
      <Route
        path='/dashboard/events'
        element={<Navigate to='/dashboard/account?tab=events' replace />}
      />
      {/* Catch-all redirect */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

// Separate component to use hooks
function AppContent() {
  const { toast, setToast } = useNotifications()
  return (
    <>
      <AppRoutes />
      <HelpChat />
      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      {typeof process !== 'undefined' &&
        process.env?.NODE_ENV === 'development' && <RegistrationDebugHelper />}
    </>
  )
}

// Main application component with context providers and routing
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
            <AppContent />
          </NotificationsProvider>
        </DraftProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
