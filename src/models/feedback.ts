import { IFeedback } from './../types/feedback';
import mongoose, { model, Schema } from 'mongoose'

const feedbackSchema: Schema = new Schema({
    // _id: mongoose.Types.ObjectId,

   rating: Number,

   customerId: {type:mongoose.Types.ObjectId, ref:"Customer"},

   userComment: String

   
}, { timestamps: true })


export default model<IFeedback>('Feedback', feedbackSchema)