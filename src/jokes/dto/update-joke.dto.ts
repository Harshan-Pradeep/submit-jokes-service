import { IsString, MinLength, IsIn, IsOptional, IsNotEmpty } from "class-validator";
import { JokeStatus } from "../enums/joke-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateJokeDto {
    @ApiProperty({ description: 'The content of the joke', example: 'Updated joke content', required: false })
    @IsOptional()
    @IsString({ message: "Content must be a string" })
    @MinLength(5, { message: "Content must be at least 5 characters long" })
    content?: string;

    @ApiProperty({ description: 'The type of the joke', example: 'Knock-Knock', required: false })
    @IsOptional()
    @IsString({ message: "Joke type should be selected from the dropdown" })
    type?: string;

    @ApiProperty({ description: 'The status of the joke', example: 'pending', enum: JokeStatus, required: false })
    @IsOptional()
    @IsIn(Object.values(JokeStatus), { message: "Status must be a valid JokeStatus" })
    status?: JokeStatus;

    @ApiProperty({ description: 'The author of the joke', example: 'John Doe', required: false })
    @IsOptional()
    @IsString({ message: "Author must be a string" })
    author?: string;
}