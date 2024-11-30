import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException, HttpStatus } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { CreateJokeDto } from './dto/create-joke.dto';
import { isValidObjectId } from 'mongoose';
import { UpdateJokeDto } from './dto/update-joke.dto';
import { TypesHttpService } from './types-http.service';

@Controller('api/v1/jokes')
export class JokesController {
    constructor(
        private readonly jokesService: JokesService,
        private readonly typesHttpService: TypesHttpService
    ) { }

    @Post('submit')
    async createJoke(@Body() createJokeDto: CreateJokeDto) {
        const joke = await this.jokesService.createJoke(createJokeDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Joke created successfully',
            data: joke
        };
    }

    @Get('types')
    async findAllJokes() {
        const types = await this.typesHttpService.getAllTypes();
        return {
            statusCode: HttpStatus.OK,
            message: 'List of joke types retrieved successfully',
            data: types
        };
    }

    @Get('pending')
    async findingPendingJokes(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        const parsedPage = parseInt(page as any, 10);
        const parsedLimit = parseInt(limit as any, 10);

        if (parsedPage <= 0 || parsedLimit <= 0) {
            throw new BadRequestException('Page and limit must be positive numbers.');
        }

        const jokes = await this.jokesService.findPendingJokes(parsedPage, parsedLimit);
        return {
            statusCode: HttpStatus.OK,
            message: 'Pending jokes retrieved successfully',
            data: jokes
        };
    }

    @Delete('delete/:id')
    async deleteJoke(@Param('id') id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid joke ID format.');
        }
        const result = await this.jokesService.deleteJoke(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Joke deleted successfully',
            data: result
        };
    }

    @Put('update/:id')
    async updateJoke(
        @Param('id') id: string,
        @Body() updateJokeDto: UpdateJokeDto
    ) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid joke ID format.');
        }
        const updatedJoke = await this.jokesService.updateJoke(id, updateJokeDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Joke updated successfully',
            data: updatedJoke
        };
    }
}

