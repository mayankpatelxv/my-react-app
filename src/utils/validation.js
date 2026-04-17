// Validation utility functions

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  return { isValid: true, error: null };
};

export const validatePhone = (phone) => {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (!phone) {
    return { isValid: true, error: null }; // Phone is optional
  }
  
  if (digitsOnly.length < 10) {
    return { isValid: false, error: "Phone number must be at least 10 digits" };
  }
  
  if (digitsOnly.length > 15) {
    return { isValid: false, error: "Phone number is too long" };
  }
  
  return { isValid: true, error: null };
};

export const validateNumericInput = (value, options = {}) => {
  const {
    min = 0,
    max = Infinity,
    allowDecimal = true,
    fieldName = "Value"
  } = options;
  
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (!allowDecimal && numValue % 1 !== 0) {
    return { isValid: false, error: `${fieldName} must be a whole number` };
  }
  
  if (numValue < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (numValue > max) {
    return { isValid: false, error: `${fieldName} cannot exceed ${max}` };
  }
  
  return { isValid: true, error: null };
};

export const validateRequired = (value, fieldName = "This field") => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true, error: null };
};

// Prevent non-numeric input in number fields
export const handleNumericKeyPress = (e) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
  
  if (allowedKeys.includes(e.key)) {
    return; // Allow control keys
  }
  
  if (!allowedChars.includes(e.key)) {
    e.preventDefault(); // Block non-numeric characters
  }
  
  // Prevent multiple decimal points
  if (e.key === '.' && e.target.value.includes('.')) {
    e.preventDefault();
  }
};

// Prevent non-integer input
export const handleIntegerKeyPress = (e) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  if (allowedKeys.includes(e.key)) {
    return; // Allow control keys
  }
  
  if (!allowedChars.includes(e.key)) {
    e.preventDefault(); // Block non-integer characters
  }
};

// Prevent non-alphanumeric input (for postal codes)
export const handleAlphanumericKeyPress = (e) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
  const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'];
  
  if (allowedKeys.includes(e.key)) {
    return; // Allow control keys
  }
  
  if (!allowedChars.includes(e.key)) {
    e.preventDefault(); // Block special characters
  }
};

// Format phone number as user types
export const formatPhoneNumber = (value) => {
  const digitsOnly = value.replace(/\D/g, '');
  
  if (digitsOnly.length <= 3) {
    return digitsOnly;
  } else if (digitsOnly.length <= 6) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  } else if (digitsOnly.length <= 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else {
    return `+${digitsOnly.slice(0, digitsOnly.length - 10)} (${digitsOnly.slice(-10, -7)}) ${digitsOnly.slice(-7, -4)}-${digitsOnly.slice(-4)}`;
  }
};
