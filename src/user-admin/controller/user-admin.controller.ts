import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DefaultMessage } from 'src/common/default-message';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CreateUserAdminInput } from '../dto/create-user-admin.input';
import { UserAdmin } from '../entity/user-admin.entity';
import { UserAdminService } from '../service/user-admin.service';

@Controller('user-admin')
export class UserAdminController {
  constructor(private service: UserAdminService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUserAdmin(@Body() input: CreateUserAdminInput): Promise<DefaultMessage> {
    return this.service.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async byIdUserAdmin(@Param('id') id: string): Promise<UserAdmin> {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listUserAdmin(): Promise<UserAdmin[]> {
    return this.service.list();
  }
}
