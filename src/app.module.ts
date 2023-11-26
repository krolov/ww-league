import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService, getDbConfig } from './db';
import { LeagueModule } from './modules/league/league.module';

@Module({
  imports: [TypeOrmModule.forRoot(getDbConfig(configService)), LeagueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
