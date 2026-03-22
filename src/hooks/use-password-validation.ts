/**
 * Password validation rules
 */
export function usePasswordValidation(password: string) {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password) || /[!"#$%&()*,.:<>?@^{|}]/.test(password),
    hasCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
  };
}
