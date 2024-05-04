import jwt from 'jsonwebtoken';

class JwtToken {
  private accessTokenSecret: string;

  private static readonly characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor(accessTokenSecret: string) {
    this.accessTokenSecret = accessTokenSecret;
  }

  generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: '1h' });
  }

  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: '1h' });
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

export default new JwtToken(process.env.JWT_SECRET!);
