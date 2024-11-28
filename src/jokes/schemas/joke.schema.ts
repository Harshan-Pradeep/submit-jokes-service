import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { JokeStatus } from "../enums/joke-status.enum";

@Schema()
export class Joke extends Document {
    @Prop({required: true})
    content: string;

    @Prop({required: true})
    type: string;

    @Prop({enum: JokeStatus, default: JokeStatus.PENDING})
    status: JokeStatus;

}

export const JokeSchema = SchemaFactory.createForClass(Joke)