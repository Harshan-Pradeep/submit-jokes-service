import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJokesRepository } from './jokes.repository.interface';
import { CreateJokeDto } from '../dto/create-joke.dto';
import { JokeStatus } from '../enums/joke-status.enum';
import { UpdateJokeDto } from '../dto/update-joke.dto';
import { Joke } from '../schemas/joke.schema';

@Injectable()
export class JokesRepository implements IJokesRepository {
    constructor(
        @InjectModel(Joke.name) private jokeModel: Model<Joke>
    ) { }

    async create(createJokeDto: CreateJokeDto): Promise<Joke> {
        const createdJoke = new this.jokeModel(createJokeDto);
        return createdJoke.save();
    }

    async findAll(): Promise<Joke[]> {
        return this.jokeModel.find().exec();
    }

    async findPending(page: number, limit: number): Promise<{ jokes: Joke[], total: number }> {
        if (page <= 0 || limit <= 0) {
            throw new BadRequestException('Page and limit must be positive numbers.');
        }

        const skip = (page - 1) * limit;
        const jokes = await this.jokeModel
            .find({ status: JokeStatus.PENDING })
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await this.jokeModel.countDocuments({ status: JokeStatus.PENDING });

        return {
            jokes,
            total,
        };
    }

    async delete(jokeId: string): Promise<boolean> {
        const result = await this.jokeModel.deleteOne({ _id: jokeId });
        return result.deletedCount > 0;
    }

    async update(jokeId: string, updateJokeDto: UpdateJokeDto): Promise<Joke | null> {
        return this.jokeModel.findByIdAndUpdate(
            jokeId,
            { $set: updateJokeDto },
            { new: true }
        );
    }
}
