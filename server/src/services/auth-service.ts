import { db } from '@configs/db';
import type { Account, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwtToken from '@/utils/auth';
import { HttpError } from '@middlewares/error-handlers';
import HttpStatus from 'http-status-codes';

class AuthService {
  async login(email: string, password: string) {
    // Logic to authenticate user

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, 'Invalid Credentials');
    }

    // Compare passwords

    const isPasswordMatch = await bcrypt.compare(password, user.password as string);

    if (!isPasswordMatch) {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid Passwords');
    }

    // Generate access token
    const accessToken = jwtToken.generateAccessToken(user);

    // Create or update account entity
    await this.createOrUpdateAccount(user.id, {
      userId: user.id,
      provider: 'email',
      type: 'email',
      providerAccountId: email,
      access_token: accessToken,
      token_type: 'jwt',
      expires_at: 3600,
    });

    // Create session entity
    const sessionToken = jwtToken.generateSessionToken(20);
    await db.session.create({
      data: {
        userId: user.id,
        sessionToken,
        expires: new Date(Date.now() + 3600),
      },
    });

    return { user, accessToken, sessionToken };
  }

  async register(userData: Partial<User>) {
    // Logic to register user
    try {
      if (!userData.password) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Password is required');
      }

      const isUserEmailExists = await this.checkUserEmail(userData.email as string);

      if (isUserEmailExists) {
        throw new HttpError(HttpStatus.CONFLICT, 'User email already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const validName = userData?.name?.split(' ').join('').toLowerCase();

      const newUser = await db.user.create({
        data: {
          ...userData,
          image: `https://avatar.vercel.sh/${validName}.svg`,
          password: hashedPassword,
        },
      });

      // Generate access token
      const accessToken = jwtToken.generateAccessToken(newUser);

      // Create or update account entity
      await this.createOrUpdateAccount(newUser.id, {
        userId: newUser.id,
        provider: 'email',
        type: 'email',
        providerAccountId: newUser.email as string,
        access_token: accessToken,
        token_type: 'jwt',
        expires_at: 3600,
      });

      // Create session entity
      const sessionToken = jwtToken.generateSessionToken(20);
      await db.session.create({
        data: {
          userId: newUser.id,
          sessionToken,
          expires: new Date(Date.now() + 3600),
        },
      });

      return { newUser, accessToken, sessionToken };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      // Throw a generic Internal Server Error for other errors
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  }

  async verifyEmail(userId: string) {
    // Logic to verify user's email (optional)
  }

  async checkUserEmail(email: string) {
    let isUserEmailExists: boolean;

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      isUserEmailExists = true;
    } else {
      isUserEmailExists = false;
    }

    return isUserEmailExists;
  }

  async createOrUpdateAccount(
    userId: string,
    data: Omit<Account, 'id' | 'id_token' | 'refresh_token' | 'scope' | 'session_state'>,
  ) {
    const existingAccount = await db.account.findFirst({
      where: {
        userId: userId,
        providerAccountId: data.providerAccountId,
      },
    });

    if (existingAccount) {
      await db.account.update({
        where: {
          id: existingAccount.id,
        },
        data,
      });
    } else {
      await db.account.create({ data });
    }
  }
}

export default new AuthService();
