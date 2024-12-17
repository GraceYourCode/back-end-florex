export const isValidPassword = (password: string): boolean => {
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

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateCode = () => {
  let code = "";
  for (let i = 0; i < 5; i++) {
    let digit = Math.floor(Math.random() * 9)
    code += digit;
  }
  return code;
}