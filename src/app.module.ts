import { Module } from '@nestjs/common';
import { ApplicationsModule } from './applications/applications.module.js';

@Module({
  imports: [ApplicationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
