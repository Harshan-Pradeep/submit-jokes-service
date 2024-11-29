import { Module } from '@nestjs/common';
import { JokesController } from './jokes.controller';
import { JokesService } from './jokes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Joke, JokeSchema } from './schemas/joke.schema';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypesHttpService } from './types-http.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Joke.name, schema: JokeSchema }])],
  controllers: [JokesController],
  providers: [JokesService, TypesHttpService]
})
export class JokesModule { }
