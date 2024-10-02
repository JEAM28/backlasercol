import { Injectable, Scope } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';
import { Users } from 'src/users/users.entity';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });
Injectable();
export class loginGoogleStrategy extends PassportStrategy(
  Strategy,
  'google-login',
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/api/callback/google/login',
      Scope: ['profile', 'email'],
      state: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user: Users | string = await this.authService.googleLogin({
      email: profile.emails[0].value,
    });
    return user || null;
  }
}
