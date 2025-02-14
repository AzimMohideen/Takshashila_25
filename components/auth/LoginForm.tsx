import { showCassetteToast } from '@/components/CassetteToast';

const handleLogin = async (e: FormEvent) => {
  e.preventDefault();
  try {
    // Login logic...
    showCassetteToast('Welcome back!', 'success');
  } catch (error) {
    showCassetteToast('Invalid credentials', 'error');
  }
}; 