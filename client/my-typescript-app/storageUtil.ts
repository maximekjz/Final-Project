export const getUserId = () => localStorage.getItem('userId');

export const saveToLocalStorage = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  };

export const clearUserId = () => localStorage.removeItem('userId');
