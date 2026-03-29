// This file stores hardcoded user data for login/register demo
// You can add more users to the array as needed

export const users = [
  {
    username: "testuser",
    password: "password123"
  }
];

/**
 * Check if a user exists with the given username and password
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
export function checkUser(username, password) {
  return users.some(u => u.username === username && u.password === password);
}

/**
 * Add a new user to the array
 * @param {string} username
 * @param {string} password
 * @returns {boolean} true if added, false if username exists
 */
export function addUser(username, password) {
  if (users.some(u => u.username === username)) return false;
  users.push({ username, password });
  return true;
}
