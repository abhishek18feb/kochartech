import { Document } from 'mongoose'

export interface IViewReport extends Document {
   CustomerName:String
   AgentName:String
   startDate:Date
   endDate:Date
   type:String
   callLog:String
}