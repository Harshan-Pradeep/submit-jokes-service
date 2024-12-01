import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException, HttpStatus, InternalServerErrorException, Res, NotFoundException } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { CreateJokeDto } from './dto/create-joke.dto';
import { isValidObjectId } from 'mongoose';
import { UpdateJokeDto } from './dto/update-joke.dto';
import { TypesHttpService } from './types-http.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Jokes APIs')
@Controller('api/v1/jokes')
export class JokesController {
    constructor(
        private readonly jokesService: JokesService,
        private readonly typesHttpService: TypesHttpService
    ) { }

    @Post('submit')
    @ApiOperation({ summary: 'Submit a new joke' })
    @ApiBody({ type: CreateJokeDto })
    @ApiResponse({
        status: 201,
        description: 'Joke created successfully',
        content: {
            'application/json': {
                example: {
                    statusCode: 201,
                    message: "Joke created successfully",
                    data: {
                        "content": "Why did the chicken cross the road? To get to the other side!",
                        "type": "sample type",
                        "status": "pending",
                        "author": "John Doe",
                        "_id": "sample id",
                        "createdAt": "2024-12-01T12:50:44.322Z"
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request & Validation errors.',
        content: {
            'application/json': {
                example: {
                    statusCode: 400,
                    message: [
                        "Content must be at least 20 characters long",
                        "Content cannot be empty",
                        "Content must be a string",
                        "Joke type cannot be empty",
                        "Joke type should be selected from the dropdown"
                    ],
                    error: "Bad Request",
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Error creating joke'
    })
    async createJoke(@Body() createJokeDto: CreateJokeDto, @Res() res: Response) {
        try {
            const joke = await this.jokesService.createJoke(createJokeDto);
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                message: 'Joke created successfully',
                data: joke,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error creating joke');
        }
    }

    @Get('types')
    @ApiOperation({ summary: 'Retrieve all joke types' })
    @ApiResponse({
        status: 200,
        description: 'List of joke types retrieved successfully',
        content: {
            'application/json': {
                example: {
                    statusCode: 200,
                    message: "List of joke types retrieved successfully",
                    data: [
                        {
                            "id": 1,
                            "name": "Knock-Knock"
                        },
                        {
                            "id": 2,
                            "name": "One-Liner"
                        }
                    ]
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Joke types not found.',
        content: {
            'application/json': {
                example: {
                    statusCode: 404,
                    message: "No joke types found"
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving joke types'
    })
    async findAllJokes(@Res() res: Response) {
        try {
            const types = await this.typesHttpService.getAllTypes();
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'List of joke types retrieved successfully',
                data: types,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving joke types');
        }
    }

    @Get('pending')
    @ApiOperation({ summary: 'Retrieve pending jokes with pagination' })
    @ApiResponse({
        status: 200,
        description: 'Pending jokes retrieved successfully',
        content: {
            'application/json': {
                example: {
                    statusCode: 200,
                    message: "Pending jokes retrieved successfully",
                    data: [
                        {
                        "content": "Why did the chicken cross the road? To get to the other side!",
                        "type": "sample type",
                        "status": "pending",
                        "author": "John Doe",
                        "_id": "sample id",
                        "createdAt": "2024-12-01T12:50:44.322Z"
                        }
                    ]
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request. Page and limit must be positive numbers.',
        content: {
            'application/json': {
                example: {
                    statusCode: 400,
                    message: "Page and limit must be positive numbers."
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving pending jokes'
    })
    async findingPendingJokes(@Query('page') page = 1, @Query('limit') limit = 10, @Res() res: Response) {
        try {
            const parsedPage = parseInt(page as any, 10);
            const parsedLimit = parseInt(limit as any, 10);

            if (parsedPage <= 0 || parsedLimit <= 0) {
                throw new BadRequestException('Page and limit must be positive numbers.');
            }

            const jokes = await this.jokesService.findPendingJokes(parsedPage, parsedLimit);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Pending jokes retrieved successfully',
                data: jokes,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException('Error retrieving pending jokes');
        }
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Delete a joke by ID' })
    @ApiResponse({
        status: 200,
        description: 'Joke deleted successfully',
        content: {
            'application/json': {
                example: {
                    statusCode: 200,
                    message: "Joke deleted successfully",
                    data: {
                        success: true
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid joke ID format',
        content: {
            'application/json': {
                example: {
                    statusCode: 400,
                    message: "Invalid joke ID format."
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Joke not found',
        content: {
            'application/json': {
                example: {
                    statusCode: 404,
                    message: "Joke not found"
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Error deleting joke'
    })
    async deleteJoke(@Param('id') id: string, @Res() res: Response) {
        try {
            if (!isValidObjectId(id)) {
                throw new BadRequestException('Invalid joke ID format.');
            }
            const result = await this.jokesService.deleteJoke(id);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Joke deleted successfully',
                data: result,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error.message,
                });
            }
            if (error instanceof NotFoundException) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException('Error deleting joke');
        }
    }

    @Put('update/:id')
    @ApiOperation({ summary: 'Update a joke by ID' })
    @ApiBody({ type: UpdateJokeDto })
    @ApiResponse({
        status: 200,
        description: 'Joke updated successfully',
        content: {
            'application/json': {
                example: {
                    statusCode: 200,
                    message: "Joke updated successfully",
                    data: {
                        "id": "60d21b4667d0d8992e610c85",
                        "content": "Updated joke content",
                        "type": "Knock-Knock",
                        "status": "approved",
                        "author": "John Doe"
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid joke ID format',
        content: {
            'application/json': {
                example: {
                    statusCode: 400,
                    message: "Invalid joke ID format."
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Joke not found',
        content: {
            'application/json': {
                example: {
                    statusCode: 404,
                    message: "Joke with ID not found"
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Error updating joke'
    })
    async updateJoke(@Param('id') id: string, @Body() updateJokeDto: UpdateJokeDto, @Res() res: Response) {
        try {
            if (!isValidObjectId(id)) {
                throw new BadRequestException('Invalid joke ID format.');
            }
            const updatedJoke = await this.jokesService.updateJoke(id, updateJokeDto);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Joke updated successfully',
                data: updatedJoke,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error.message,
                });
            }
            if (error instanceof NotFoundException) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: error.message,
                });
            }
            throw new InternalServerErrorException('Error updating joke');
        }
    }
}


