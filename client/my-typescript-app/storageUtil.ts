export const getFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};
export const saveToLocalStorage = (key: any, value: any): void => {
    localStorage.setItem(key, value);
  };

export const clearUserId = () => localStorage.removeItem('userId');

