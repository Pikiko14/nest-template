import { Repository } from 'typeorm';
import { Strategy } from 'passport-jwt';
import { User } from '../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || '',
      jwtFromRequest: (req) => {
        const token = req?.headers?.authorization?.replace('Bearer ', '');
        return token;
      },
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
    const { id } = payload;

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.isActive) throw new UnauthorizedException('User not active');

    return user;
  }
}
