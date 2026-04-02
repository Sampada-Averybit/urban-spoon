const SPECIAL_CHARACTER_REGEX = /[@#$%&*]/;

export const VALIDATION_ERROR_TEXT_CLASS = "text-[0.82rem] font-semibold text-[#ef2c5b]";
export const INVALID_FIELD_CLASS = "border-[#ef2c5b] ring-1 ring-[rgba(239,44,91,0.22)]";

export function getFieldClass(baseClassName, errorMessage) {
  if (!errorMessage) return baseClassName;
  return `${baseClassName} ${INVALID_FIELD_CLASS}`;
}

export function validatePhone(phone) {
  const value = String(phone ?? "").trim();
  if (!value) return "Phone number is required.";
  if (!/^\d+$/.test(value)) return "Phone number must contain only numbers.";
  if (!/^\d{10}$/.test(value)) return "Phone number must be exactly 10 digits.";
  return "";
}

export function validateEmail(email) {
  const value = String(email ?? "").trim();
  if (!value) return "Email is required.";
  if (!value.includes("@")) return 'Email must include "@".';
  if (!value.toLowerCase().endsWith(".com")) return 'Email must end with ".com".';
  return "";
}

export function validatePassword(password) {
  const value = String(password ?? "");
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  if (!SPECIAL_CHARACTER_REGEX.test(value)) {
    return "Password must include at least one special character (@, #, $, %, &, *).";
  }
  return "";
}
