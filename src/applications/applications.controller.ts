import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/application.dto.js';

@Controller('solicitudes')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  createApplication(@Body() applicationDto: CreateApplicationDto) {
    return this.applicationsService.createApplicationService(applicationDto);
  }

  @Get()
  getApplications() {}
}
