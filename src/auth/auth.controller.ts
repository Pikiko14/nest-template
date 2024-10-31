import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/users.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserRoleGuard } from './guards/user-role.guard';
import { Getuser } from './decorators/get-user.decorator';
import { RawHeaders } from 'src/common/decoratos/get-headers.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/private')
  privateRoute(@Req() req, @Getuser('id') user: User, @RawHeaders() headers) {
    console.log(headers);
    return 'This route is private';
  }

  @SetMetadata('roles', ['admin', 'user'])
  @UseGuards(AuthGuard('jwt'), UserRoleGuard)
  @Get('/private-with-role')
  privateRouteWithRole() {
    return 'This route is private with roles';
  }
}
