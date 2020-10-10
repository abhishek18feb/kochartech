import { Document } from 'mongoose'

export interface IAgent extends Document {
    name: string
}