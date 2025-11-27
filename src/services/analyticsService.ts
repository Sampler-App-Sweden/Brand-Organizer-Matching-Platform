// Event types
export const EVENTS = {
  PAGE_VIEW: 'page_view',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  REGISTRATION_STARTED: 'registration_started',
  REGISTRATION_COMPLETED: 'registration_completed',
  EMAIL_VERIFIED: 'email_verified',
  FORM_SUBMITTED: 'form_submitted',
  PAGE_EXIT: 'page_exit'
} as const;
// Error types
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'validation_error',
  NETWORK_ERROR: 'network_error',
  AUTHENTICATION_ERROR: 'authentication_error',
  UNKNOWN_ERROR: 'unknown_error'
} as const;
// Track events
export const trackEvent = (eventName: string, eventData?: any, userId?: string, experimentId?: string, experimentVariant?: string) => {
  // In a real implementation, this would send data to an analytics service
  console.log('Analytics Event:', {
    event: eventName,
    data: eventData,
    userId,
    experimentId,
    experimentVariant,
    timestamp: new Date().toISOString()
  });
};
// Track errors
export const trackError = (errorType: string, errorMessage: string, errorStack?: string, metadata?: any, userId?: string, experimentId?: string, experimentVariant?: string) => {
  // In a real implementation, this would send error data to an error tracking service
  console.error('Error Event:', {
    type: errorType,
    message: errorMessage,
    stack: errorStack,
    metadata,
    userId,
    experimentId,
    experimentVariant,
    timestamp: new Date().toISOString()
  });
};