import { CreateJokeDto } from "../dto/create-joke.dto";
import { UpdateJokeDto } from "../dto/update-joke.dto";
import { Joke } from "../schemas/joke.schema";

export interface IJokesRepository {
    create(createJokeDto: CreateJokeDto): Promise<Joke>;
    findAll(): Promise<Joke[]>;
    findPending(page: number, limit: number): Promise<{ jokes: Joke[], total: number }>;
    delete(jokeId: string): Promise<boolean>;
    update(jokeId: string, updateJokeDto: UpdateJokeDto): Promise<Joke | null>;
}
