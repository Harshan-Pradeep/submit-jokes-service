import { Module } from '@nestjs/common';
import { JokesController } from './jokes.controller';
import { JokesService } from './jokes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Joke, JokeSchema } from './schemas/joke.schema';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypesHttpService } from './types-http.service';
import { JokesRepository } from './repositories/jokes.repository';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Joke.name, schema: JokeSchema }]),
  ],
  controllers: [JokesController],
  providers: [
    JokesService,
    TypesHttpService,
    { provide: 'IJokesRepository', useClass: JokesRepository },
  ]
})
export class JokesModule {}
