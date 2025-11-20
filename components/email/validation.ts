export const validateEmailWithoutRegex = (email: string): string | null => {
  if (!email) {
    return "Email address is required.";
  }

  // Check for presence and position of '@'
  const atSymbolIndex = email.indexOf("@");
  if (atSymbolIndex < 1) {
    // Cannot be the first character or missing
    return 'Invalid email format: missing or misplaced "@" symbol.';
  }

  if (atSymbolIndex > 2) {
    return 'Invalid email format';
  }

  // Check for presence and position of '.' after '@'
  const dotIndex = email.lastIndexOf(".");
  if (dotIndex < atSymbolIndex + 2 || dotIndex === email.length - 1) {
    // Must have chars between @ and ., and not be the last char
    return 'Invalid email format: missing or misplaced "." symbol.';
  }

  // Ensure no spaces in the email
  if (email.indexOf(" ") !== -1) {
    return "Invalid email format: no spaces allowed.";
  }

  return null; 
};
