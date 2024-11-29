import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Joke } from './schemas/joke.schema';
import { Model } from 'mongoose';
import { CreateJokeDto } from './dto/create-joke.dto';
import { JokeStatus } from './enums/joke-status.enum';
import { TypesHttpService } from './types-http.service';

@Injectable()
export class JokesService {
    constructor(
        @InjectModel(Joke.name) private jokeModel: Model<Joke>,
        private readonly typesHttpService: TypesHttpService,
    ) {}

    async createJoke(createJokeDto: CreateJokeDto): Promise<Joke> {
        const createdJoke = new this.jokeModel(createJokeDto);
        return createdJoke.save();
    }

    async findAllJokes(): Promise<Joke[]> {
        return this.jokeModel.find().exec();
    }

    async findPendingJokes(): Promise<Joke[]> {
        return this.jokeModel.find({status: JokeStatus.PENDING}).exec();
    }

    async getAvailableTypes() {
        return this.typesHttpService.getAllTypes();
    }
}
