export function validateEmailForLogin(email: string): string | null {
  if (!email.trim()) {
    return 'Informe seu e-mail para entrar.';
  }

  return null;
}