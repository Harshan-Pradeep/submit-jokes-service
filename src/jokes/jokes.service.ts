import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
        return this.jokesRepository.create(createJokeDto);
    }

    async findAllJokes(): Promise<Joke[]> {
        return this.jokesRepository.findAll();
    }

    async findPendingJokes(page: number, limit: number): Promise<{ jokes: Joke[], total: number }> {
        return this.jokesRepository.findPending(page, limit);
    }

    async deleteJoke(jokeId: string): Promise<{ success: boolean }> {
        const isDeleted = await this.jokesRepository.delete(jokeId);
        if (isDeleted) {
            return { success: true };
        }
        throw new NotFoundException('Joke not found');
    }

    async updateJoke(jokeId: string, updateJokeDto: UpdateJokeDto): Promise<Joke> {
        const updatedJoke = await this.jokesRepository.update(jokeId, updateJokeDto);
        if (!updatedJoke) {
            throw new NotFoundException(`Joke with ID ${jokeId} not found`);
        }
        return updatedJoke;
    }
}
