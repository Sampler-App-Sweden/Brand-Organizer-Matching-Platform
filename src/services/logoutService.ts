import { supabase } from './supabaseClient'

export const logoutAndRedirect = async () => {
  await supabase.auth.signOut()
  window.location.href = '/login'
}
