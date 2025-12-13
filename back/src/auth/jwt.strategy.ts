import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express'; 


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  private static extractJWT(req: Request): string | null {
    try {

      if (req.cookies && req.cookies.access_token) {
        return req.cookies.access_token;
      }
      return null;
    } catch (err) {
      console.error('Error extrayendo cookie:', err);
      return null; 
    }
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}

