import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class QueryApplicationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero.' })
  @Min(1, { message: 'La página mínima es 1.' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero.' })
  @Min(1, { message: 'El límite mínimo es 1.' })
  @Max(100, { message: 'El límite máximo es 100.' })
  limit?: number = 10;

  @IsOptional()
  @IsIn(['pendiente', 'aprobada', 'rechazada'], { message: 'El estado debe ser pendiente, aprobada o rechazada.' })
  status?: 'pendiente' | 'aprobada' | 'rechazada';
}
