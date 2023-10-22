export class checkPasswordValidation {
  public static isWhiteSpace(value: string): string | null {
    const whiteSpaceRegex = /^(?=.*\s)/;
    if (whiteSpaceRegex.test(value)) {
      return 'Password must no contain Whitespaces';
    }
    return null;
  }

  public static isContainsUppercase(value: string): string | null {
    const containsUppercase = /^(?=.*[A-Z])/;
    if (!containsUppercase.test(value)) {
      return 'Password must have at least one Uppercase Character';
    }
    return null;
  }

  public static isContainsLowercase(value: string): string | null {
    const containsLowercase = /^(?=.*[a-z])/;
    if (!containsLowercase.test(value)) {
      return 'Password must have at least one Lowercase Character';
    }
    return null;
  }

  public static isContainsNumber(value: string): string | null {
    const containsNumber = /^(?=.*[0-9])/;
    if (!containsNumber.test(value)) {
      return 'Password must contain at least one Digit';
    }
    return null;
  }

  public static isContainsSymbol(value: string): string | null {
    const containsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
    if (!containsSymbol.test(value)) {
      return 'Password must contain at least one Special Symbol';
    }
    return null;
  }

  public static isValidLength(value: string): string | null {
    const validLength = /^.{8,16}$/;
    if (!validLength.test(value)) {
      return 'Password must be 8-16 characters long.';
    }
    return null;
  }
}
