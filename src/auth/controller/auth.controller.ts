import { Body, Controller, Post } from '@nestjs/common';
import { AuthInputAdmin } from '../dto/auth.input';
import { AuthTypeAdmin } from '../dto/auth.type';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login-admin')
  async loginAdmin(@Body() data: AuthInputAdmin): Promise<AuthTypeAdmin> {
    const response = await this.authService.validateUserAdmin(data);
    return {
      user: response.user,
      token: response.token,
    };
  }
}
