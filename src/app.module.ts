import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationsModule } from './applications/applications.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ApplicationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
