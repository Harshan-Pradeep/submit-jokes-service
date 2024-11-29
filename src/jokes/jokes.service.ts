import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Joke } from './schemas/joke.schema';
import { Model} from 'mongoose';
import { CreateJokeDto } from './dto/create-joke.dto';
import { JokeStatus } from './enums/joke-status.enum';
import { TypesHttpService } from './types-http.service';
import { ObjectId } from 'mongodb';

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

    async findPendingJokes(page: number, limit: number): Promise<{ jokes: Joke[], total: number }> {
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

    async getAvailableTypes() {
        return this.typesHttpService.getAllTypes();
    }

    async deleteJoke(jokeId: string): Promise<{ success: boolean; message: string }> {
        const result = await this.jokeModel.deleteOne({ _id: jokeId });
        
        if (result.deletedCount > 0) {
            return {
                success: true,
                message: 'Joke successfully deleted'
            };
        }
        
        return {
            success: false,
            message: 'Joke not found'
        };
    }
}
