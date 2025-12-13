import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';
import { AUDIT_ACTION_KEY } from '../decorators/audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (response) => {
        const action = this.reflector.get<string>(
          AUDIT_ACTION_KEY,
          context.getHandler(),
        );

        if (!action) return; 

        const request = context.switchToHttp().getRequest();
        const userFromReq = request.user;
        let finalUserId = userFromReq?.userId || userFromReq?.id || userFromReq?.sub;

        if (!finalUserId && response) {
          finalUserId = response.user?.id || response.userId || response.id;
        }
      
        if (!finalUserId) {
          console.warn('No se pudo auditar: Falta ID de usuario');
          return;
        }

        let description = `Acción realizada: ${action}`;
        
        if (response) {
            if (response.name) description = `${action}: ${response.name}`;
            else if (response.email) description = `${action}: ${response.email}`;
        }

        this.prisma.auditLog
          .create({
            data: {
              action,
              description,
              userId: finalUserId, 
              metadata: response || {}, 
            },
          })
          .catch((err) => console.error('Error guardando audit en DB:', err));
      }),
    );
  }
}
