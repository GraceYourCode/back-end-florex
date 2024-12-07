function isValidPassword(password: string): boolean {
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  const isLongEnough = password.length >= 8;

  // Check if password satisfies all the requirements
  return (
    hasUpperCase.test(password) &&
    hasLowerCase.test(password) &&
    hasNumber.test(password) &&
    hasSpecialChar.test(password) &&
    isLongEnough
  );
}