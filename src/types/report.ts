import { Document } from 'mongoose'

export interface IReport extends Document {
    name: string

   customerId:string

   agentId: string

   startDate: Date

   endDate: Date

   callLog: string

   type: number

   createdAt: Date
}