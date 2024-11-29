import { IsString, MinLength, IsIn, IsOptional, IsNotEmpty } from "class-validator";
import { JokeStatus } from "../enums/joke-status.enum";

export class UpdateJokeDto {
    @IsOptional()
    @IsString({ message: "Content must be a string" })
    @MinLength(5, { message: "Content must be at least 5 characters long" })
    content?: string;

    @IsOptional()
    @IsString({ message: "Joke type should be selected from the dropdown" })
    type?: string;

    @IsOptional()
    @IsIn(Object.values(JokeStatus), { message: "Status must be a valid JokeStatus" })
    status?: JokeStatus;

    @IsOptional()
    @IsString({ message: "Author must be a string" })
    author?: string;
}