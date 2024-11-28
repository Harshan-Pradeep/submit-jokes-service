import { IsString, MinLength } from "class-validator";

export class CreateJokeDto {
    @IsString()
    @MinLength(5)
    content: string;

    @IsString()
    type: string;
}