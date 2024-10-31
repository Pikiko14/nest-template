import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthValidator } from './decorators';
import { ValidRoles } from './interfaces';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/users.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserRoleGuard } from './guards/user-role.guard';
import { Getuser } from './decorators/get-user.decorator';
import { RawHeaders } from 'src/common/decoratos/get-headers.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';

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

  @Get('/private-with-role')
  @RoleProtected(ValidRoles.user)
  @UseGuards(AuthGuard('jwt'), UserRoleGuard)
  privateRouteWithRole() {
    return 'This route is private with roles';
  }

  @AuthValidator(ValidRoles.user)
  @Get('/private-with-role-two')
  privateRouteWithRoleTwo() {
    return 'This route is private with roles';
  }
}
