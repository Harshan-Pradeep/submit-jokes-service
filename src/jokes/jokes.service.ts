import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Joke } from './schemas/joke.schema';
import { Model } from 'mongoose';
import { CreateJokeDto } from './dto/create-joke.dto';
import { JokeStatus } from './enums/joke-status.enum';
import { UpdateJokeDto } from './dto/update-joke.dto';

@Injectable()
export class JokesService {
    constructor(
        @InjectModel(Joke.name) private jokeModel: Model<Joke>
    ) { }

    async createJoke(createJokeDto: CreateJokeDto): Promise<Joke> {
        const createdJoke = new this.jokeModel(createJokeDto);
        return createdJoke.save();
    }

    async findAllJokes(): Promise<Joke[]> {
        return this.jokeModel.find().exec();
    }

    async findPendingJokes(page: number, limit: number): Promise<{ jokes: Joke[], total: number }> {
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

    async deleteJoke(jokeId: string): Promise<{ success: boolean }> {

        const result = await this.jokeModel.deleteOne({ _id: jokeId });

        if (result.deletedCount > 0) {
            return {
                success: true
            };
        }

        throw new NotFoundException('Joke not found');
    }

    async updateJoke(jokeId: string, updateJokeDto: UpdateJokeDto): Promise<Joke> {

        const existingJoke = await this.jokeModel.findById(jokeId);

        if (!existingJoke) {
            throw new NotFoundException(`Joke with ID ${jokeId} not found`);
        }

        return this.jokeModel.findByIdAndUpdate(
            jokeId,
            { $set: updateJokeDto },
            { new: true }
        );
    }
}
