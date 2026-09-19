import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/application.dto.js';
import { QueryApplicationDto } from './dto/query.dto.js';
import { PrismaService } from '../prisma.service.js';
import { calculateInstallment, getAnnualRate } from '../utils/util.js';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../utils/constants.js';

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

  async getApplicationsService(query: QueryApplicationDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;
    const where = query.status ? { status: query.status } : {};
    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
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
      }),
      this.prisma.application.count({ where }),
    ]);
    return {
      status: true,
      data,
      total,
      page,
      limit,
    };
  }
}
