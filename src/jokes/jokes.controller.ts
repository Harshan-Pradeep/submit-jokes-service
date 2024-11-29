import { Body, Controller, Get, Post } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { CreateJokeDto } from './dto/create-joke.dto';

@Controller('api/v1/jokes')
export class JokesController {
    constructor(private readonly jokesService: JokesService) {}

    @Post('submit')
    async createJoke(@Body() createJokeDto: CreateJokeDto) {
        return this.jokesService.createJoke(createJokeDto);
    }

    @Get('types')
    async findAllJokes() {
        return this.jokesService.getAvailableTypes();
    }

    @Get('pending')
    async findingPendingJokes() {
        return this.jokesService.findPendingJokes();
    }
}
