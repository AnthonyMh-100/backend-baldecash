import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/application.dto.js';
import { PrismaService } from '../prisma.service.js';
import { calculateInstallment, getAnnualRate } from '../utils/util.js';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createApplicationService(applicationDto: CreateApplicationDto) {
    const { amount, months } = applicationDto;
    const annualRate = getAnnualRate();
    const installment = calculateInstallment({
      amount,
      months,
      annualRate,
    });
    const application = await this.prisma.application.create({
      data: {
        ...applicationDto,
        annualRate,
        installment,
      },
      select: {
        id: true,
        fullName: true,
        dni: true,
        email: true,
        phone: true,
        amount: true,
        months: true,
        annualRate: true,
        installment: true,
        status: true,
      },
    });
    return {
      status: true,
      data: application,
    };
  }

  getApplicationsService() {}
}
