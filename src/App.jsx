import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import './App.css'
import './styles/viral-brand.css'

// Components
import ProfessionalLanding from './components/ProfessionalLanding'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import SettingsPage from './components/SettingsPage'
import ContentHistory from './components/ContentHistory'
import ViralAdminDashboard from './components/ViralAdminDashboard'
import LoadingSpinner from './components/LoadingSpinner'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
export const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <ProfessionalLanding />} 
          />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/dashboard" /> : <AuthPage />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/settings" 
            element={user ? <SettingsPage user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/history" 
            element={user ? <ContentHistory user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/admin" 
            element={user ? <ViralAdminDashboard user={user} /> : <Navigate to="/auth" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
