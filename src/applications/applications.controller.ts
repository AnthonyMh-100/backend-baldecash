import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/application.dto.js';
import { QueryApplicationDto } from './dto/query.dto.js';

@Controller('solicitudes')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  createApplication(@Body() applicationDto: CreateApplicationDto) {
    return this.applicationsService.createApplicationService(applicationDto);
  }

  @Get()
  getApplications(@Query() query: QueryApplicationDto) {
    return this.applicationsService.getApplicationsService(query);
  }
}
