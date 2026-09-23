import { AuthApiError } from '@supabase/supabase-js';

export function authError(error: unknown): string {
  if (error instanceof AuthApiError) {
    if (error.status === 429) return 'Too many requests. Please wait a few minutes and try again.';
    if (error.code === 'email_not_confirmed') return 'Please verify your email before signing in.';
    return error.message;
  }
  return error instanceof Error ? error.message : 'We could not complete your request. Please try again.';
}
