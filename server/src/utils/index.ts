export function exclude<User, Key extends keyof User>(user: User, keys: Key[]): User {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}
