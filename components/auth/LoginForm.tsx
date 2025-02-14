import { FormEvent } from 'react';
import { showCassetteToast } from '@/components/CassetteToast';

export const handleLogin = async (e: FormEvent) => {
  e.preventDefault();
  try {
    // Login logic...
    showCassetteToast('Welcome back!', 'success');
  } catch (err) {
    console.error('Login error:', err);
    showCassetteToast('Invalid credentials', 'error');
  }
}; 