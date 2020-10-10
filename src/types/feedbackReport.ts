import { Document } from 'mongoose'

export interface IFeedbackReport extends Document {
   CustomerName:String
   UserComments:String
   rating:Date
   startDate:Date
}