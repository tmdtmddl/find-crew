export const emailValidator = (email: string): boolean => {
  if (email.length === 0) {
    return false;
  }
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

  return regex.test(email);
};

export const lengthCheck = (target: string | any[]): boolean => {
  if (target.length === 0) {
    return false;
  }
  return true;
};

export const isSameStringArray = (arr1: string[], arr2: string[]): boolean => {
  for (const item of arr1) {
    const found = arr2.find((a2) => a2 === item);
    if (!found) {
      return false;
    }
  }
  return true;
};
