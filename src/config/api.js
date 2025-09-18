// API Configuration
export const getApiBaseUrl = () => {
  // In production, use the deployed API URL, in development use localhost
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || 'https://contentflow-api.vercel.app'
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
}

export const API_BASE_URL = getApiBaseUrl()

// API endpoints
export const API_ENDPOINTS = {
  // Content endpoints
  CONTENT_PROCESS: `${API_BASE_URL}/api/content/process`,
  CONTENT_HISTORY: `${API_BASE_URL}/api/content/history`,
  CONTENT_USAGE_STATS: `${API_BASE_URL}/api/content/usage/stats`,
  CONTENT_DETAIL: `${API_BASE_URL}/api/content`,
  
  // Payment endpoints
  PAYMENTS_CHECKOUT: `${API_BASE_URL}/api/payments/create-checkout-session`,
  PAYMENTS_SUBSCRIPTION: `${API_BASE_URL}/api/payments/subscription`,
  PAYMENTS_PORTAL: `${API_BASE_URL}/api/payments/create-portal-session`,
  
  // Admin endpoints
  ADMIN_ANALYTICS: `${API_BASE_URL}/api/admin/analytics`,
  ADMIN_PROMOS: `${API_BASE_URL}/api/admin/promos`,
  ADMIN_PROMO_VIEW: `${API_BASE_URL}/api/admin/promos`,
  ADMIN_PROMO_CLICK: `${API_BASE_URL}/api/admin/promos`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`
}