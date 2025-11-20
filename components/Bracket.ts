function areBracketsBalanced(str: string): boolean {
  // An array is used to simulate a stack, storing opening brackets as they are encountered.
  const stack: string[] = [];
  const bracketMap: { [key: string]: string } = {
    "(": ")",
    "[": "]",
    "{": "}",
  };

  for (const char of str) {
    if (bracketMap[char]) {
      // If it's an opening bracket
      stack.push(char);
    } else if (Object.values(bracketMap).includes(char)) {
      // If it's a closing bracket
      if (stack.length === 0) {
        // No opening bracket to match
        return false;
      }
      const lastOpenBracket = stack.pop();
      if (bracketMap[lastOpenBracket!] !== char) {
        // Mismatched brackets
        return false;
      }
    }
  }

  return stack.length === 0; // Stack should be empty if all brackets are matched
}

console.log(areBracketsBalanced("([{}])")); // true
console.log(areBracketsBalanced("({[})")); // false (mismatched)
console.log(areBracketsBalanced("({[")); // false (unclosed)
console.log(areBracketsBalanced("})")); // false (closing without opening)
