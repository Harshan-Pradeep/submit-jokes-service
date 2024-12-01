import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsIn, IsOptional, IsNotEmpty } from "class-validator";

export class CreateJokeDto {
    @ApiProperty({ description: 'The content of the joke', example: 'Why did the chicken cross the road? To get to the other side!' })
    @IsString({ message: "Content must be a string" })
    @IsNotEmpty({ message: "Content cannot be empty" })
    @MinLength(20, { message: "Content must be at least 20 characters long" })
    content: string;

    @ApiProperty({ description: 'The type of the joke', example: 'Knock-Knock' })
    @IsString({ message: "Joke type should be selected from the dropdown" })
    @IsNotEmpty({ message: "Joke type cannot be empty" })
    type: string;

    @ApiProperty({ description: 'The author of the joke', example: 'John Doe', required: false })
    @IsOptional()
    @IsString({ message: "Author must be a string" })
    author?: string;
}