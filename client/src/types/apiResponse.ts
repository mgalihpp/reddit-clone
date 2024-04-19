export type LoginResponse = {
  message: string;
  user: User;
  token: string;
  sessionToken: string;
  error?: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
  token: string;
  sessionToken: string;
  error?: string;
};
