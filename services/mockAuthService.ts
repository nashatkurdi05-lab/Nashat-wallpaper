// This is a mock authentication service that uses localStorage to simulate a user database.
// In a real-world application, this would be replaced with actual API calls to a secure backend.

const USERS_KEY = 'ai_wallpaper_users';

/**
 * Retrieves the users object from localStorage.
 * @returns {Record<string, string>} A dictionary of usernames and passwords.
 */
const getUsers = (): Record<string, string> => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (e) {
    console.error("Failed to parse users from localStorage", e);
    return {};
  }
};

/**
 * Saves the users object to localStorage.
 * @param {Record<string, string>} users - The users object to save.
 */
const saveUsers = (users: Record<string, string>) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users to localStorage", e);
  }
};

/**
 * Simulates a user signup process.
 * @param {string} username - The desired username.
 * @param {string} password - The desired password.
 * @returns {Promise<void>} A promise that resolves on success or rejects on failure.
 */
export const signup = (username: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (!username || !password) {
        return reject(new Error('Username and password are required.'));
      }
      const users = getUsers();
      if (users[username]) {
        return reject(new Error('Username already exists. Please choose another one.'));
      }
      if (password.length < 4) {
        return reject(new Error('Password must be at least 4 characters long.'));
      }
      
      // In a real app, you would NEVER store plain text passwords.
      // This would be securely hashed and salted.
      users[username] = password; 
      saveUsers(users);
      resolve();
    }, 500);
  });
};

/**
 * Simulates a user login process.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<void>} A promise that resolves on success or rejects on failure.
 */
export const login = (username: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const users = getUsers();
      if (!users[username] || users[username] !== password) {
        return reject(new Error('Invalid username or password.'));
      }
      resolve();
    }, 500);
  });
};
