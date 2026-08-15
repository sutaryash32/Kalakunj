import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Apply this guard to any route that only the admin dashboard should reach.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
