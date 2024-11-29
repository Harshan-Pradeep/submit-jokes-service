import { IsString, MinLength } from "class-validator";
import { JokeStatus } from "../enums/joke-status.enum";

export class UpdateJokeDto {
    @IsString()
    @MinLength(5)
    content: string;

    @IsString()
    type: string;

    status: JokeStatus;
}