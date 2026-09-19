import { IsEmail, IsIn, IsInt, IsNotEmpty, IsNumber, IsString, Matches, Max, Min } from 'class-validator';

export class CreateApplicationDto {
  @IsString({ message: 'El nombre completo debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio.' })
  fullName: string;

  @Matches(/^\d{8}$/, { message: 'El DNI debe tener exactamente 8 dígitos numéricos.' })
  dni: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido.' })
  email: string;

  @Matches(/^9\d{8}$/, { message: 'El teléfono debe tener 9 dígitos y empezar en 9.' })
  phone: string;

  @IsNumber({}, { message: 'El monto debe ser un número.' })
  @Min(1000, { message: 'El monto mínimo es S/ 1,000.' })
  @Max(10000, { message: 'El monto máximo es S/ 10,000.' })
  amount: number;

  @IsInt({ message: 'El plazo debe ser un número entero.' })
  @IsIn([6, 12, 18, 24], { message: 'El plazo debe ser 6, 12, 18 o 24 meses.' })
  months: number;
}
