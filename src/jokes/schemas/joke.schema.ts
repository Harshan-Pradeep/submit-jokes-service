import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { JokeStatus } from "../enums/joke-status.enum";
import { IsString, MinLength, IsIn, IsNotEmpty } from "class-validator";

@Schema()
export class Joke extends Document {
    @Prop({ required: true })
    @IsString({ message: "Content must be a string" })
    @IsNotEmpty({ message: "Content cannot be empty" })
    @MinLength(20, { message: "Content must be at least 20 characters long" })
    content: string;

    @Prop({ required: true })
    @IsString({ message: "Joke type should be selected from the dropdown" })
    type: string;

    @Prop({ enum: JokeStatus, default: JokeStatus.PENDING })
    @IsIn(Object.values(JokeStatus), { message: "Status must be a valid JokeStatus" })
    status: JokeStatus;

    @Prop({ required: false })
    @IsString({ message: "Author must be a string" })
    author: string;
}

export const JokeSchema = SchemaFactory.createForClass(Joke);