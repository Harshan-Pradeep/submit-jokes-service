import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { CreateJokeDto } from './dto/create-joke.dto';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UpdateJokeDto } from './dto/update-joke.dto';

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
    async findingPendingJokes(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        const parsedPage = parseInt(page as any, 10);
        const parsedLimit = parseInt(limit as any, 10);
        
        return this.jokesService.findPendingJokes(parsedPage, parsedLimit);
    }

    @Delete('delete/:id')
    async deleteJoke(@Param('id') id: string) {
        const jokeId = id;
        const result = await this.jokesService.deleteJoke(jokeId);
        return result;
    }

    @Put('update')
    async updateJoke(
        @Query('id') id: string,
        @Body() updateJokeDto: UpdateJokeDto
    ) {
        return this.jokesService.updateJoke(id, updateJokeDto);
    }
}
