import { Document } from 'mongoose'

export interface IFeedback extends Document {
    rating: Number

   customerId: String

   userComment: string

   createdAt: Date
}