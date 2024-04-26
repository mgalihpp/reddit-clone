import jwt from 'jsonwebtoken';

class JwtToken {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  private static readonly characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor(accessTokenSecret: string, refreshTokenSecret: string) {
    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;
  }

  generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: '1h' });
  }

  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '1h' });
  }

  public generateSessionToken(length: number): string {
    let token = '';
    for (let i = 0; i < length; i++) {
      token += JwtToken.characters.charAt(
        Math.floor(Math.random() * JwtToken.characters.length),
      );
    }
    return token;
  }
}

export default new JwtToken(process.env.JWT_SECRET!, process.env.JWT_SECRET!);
