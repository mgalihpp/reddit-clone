export type LoginResponse = {
  message: string;
  user: User;
  token: string;
  sessionToken: string;
};

export type RegisterResponse = {
  message: string;
  newUser: User;
  token: string;
  sessionToken: string;
};
