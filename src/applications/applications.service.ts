import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/application.dto.js';
import { calculateInstallment, getAnnualRate } from '../utils/util.js';

@Injectable()
export class ApplicationsService {
  createApplicationService(applicationDto: CreateApplicationDto) {
    const { amount, months } = applicationDto;
    const annualRate = getAnnualRate();
    const installment = calculateInstallment({
      amount,
      months,
      annualRate,
    });
    return { ...applicationDto, annualRate, installment };
  }

  getApplicationsService() {}
}
