import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateJokeDto } from './dto/create-joke.dto';
import { UpdateJokeDto } from './dto/update-joke.dto';
import { Joke } from './schemas/joke.schema';
import { IJokesRepository } from './repositories/jokes.repository.interface';

@Injectable()
export class JokesService {
    constructor(
        @Inject('IJokesRepository')
        private readonly jokesRepository: IJokesRepository,
    ) { }

    async createJoke(createJokeDto: CreateJokeDto): Promise<Joke> {
        try {
            return await this.jokesRepository.create(createJokeDto);
        } catch (error) {
            throw new InternalServerErrorException('Error creating joke');
        }
    }

    async findAllJokes(): Promise<Joke[]> {
        try {
            return await this.jokesRepository.findAll();
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving all jokes');
        }
    }

    async findPendingJokes(page: number, limit: number): Promise<{ jokes: Joke[], total: number }> {
        try {
            return await this.jokesRepository.findPending(page, limit);
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving pending jokes');
        }
    }

    async deleteJoke(jokeId: string): Promise<{ success: boolean }> {
        try {
            const isDeleted = await this.jokesRepository.delete(jokeId);
            if (isDeleted) {
                return { success: true };
            }
            throw new NotFoundException('Joke not found');
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deleting joke');
        }
    }

    async updateJoke(jokeId: string, updateJokeDto: UpdateJokeDto): Promise<Joke> {
        try {
            const updatedJoke = await this.jokesRepository.update(jokeId, updateJokeDto);
            if (!updatedJoke) {
                throw new NotFoundException(`Joke with ID ${jokeId} not found`);
            }
            return updatedJoke;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error updating joke');
        }
    }
}
