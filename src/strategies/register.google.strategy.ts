import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config as dotenvConfig } from 'dotenv';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';

dotenvConfig({ path: '.env' });
@Injectable()
export class RegisterGoogleStrategy extends PassportStrategy(
  Strategy,
  'google-register',
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        'http://localhost:3000/auth/api/callback/google/register/customer',
      scope: ['profile', 'email'],
    });
  }
  
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const user = await this.authService.googleRegisterCustomer({
        email: profile.emails[0].value,
        name: profile.name.givenName,
        lastName: profile.name.familyName,
      });
      
      console.log(user);
      
      done(null, user);
      
    } catch (error) {
      console.log(error);
    }
  }
}
