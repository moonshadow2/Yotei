import { writable } from 'svelte/store';
 
// The current logged-in user object: { username, password } or null
export const user = writable(null);
 
/**
 * Create a new user object and store it.
 * @param {string} username
 * @param {string} password
 */
export function createUser(username, password) {
  user.set({ username, password });
}
 
/**
 * Delete the current user object (clears it to null).
 */
export function deleteUser() {
  user.set(null);
}
 
/**
 * Edit the current user object.
 * Pass only the fields you want to change: { username?, password? }
 * @param {{ username?: string, password?: string }} changes
 */
export function editUser(changes) {
  user.update(current => {
    if (!current) return null;
    return { ...current, ...changes };
  });
}