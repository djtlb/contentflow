// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Helper function to construct API URLs
export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`

// Environment checks
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD