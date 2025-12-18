export type UserType = 'brand' | 'organizer'
export type ExperimentVariant = 'A' | 'B' | 'C'

export interface PasswordErrors {
  length: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
}

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastState {
  isVisible: boolean
  type: ToastType
  message: string
}
