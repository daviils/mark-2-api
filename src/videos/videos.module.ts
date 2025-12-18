import { Module } from '@nestjs/common';
import { VideosService } from './service/videos.service';
import { VideosResolver } from './resolver/videos.resolver';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Videos} from './entity/videos.entity';

@Module({
  imports:[
   TypeOrmModule.forFeature([
    Videos,
   ]),
  ],
  providers: [VideosService, VideosResolver]
})
export class VideosModule {}
