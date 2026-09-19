import { Controller, Get, Post } from '@nestjs/common';

@Controller('solicitudes')
export class ApplicationsController {
  @Post()
  createApplication() {
  }

  @Get()
  getApplications() {
  }
}
