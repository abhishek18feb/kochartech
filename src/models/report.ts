import { IReport } from './../types/report';
import mongoose, { model, Schema } from 'mongoose';

const reportSchema: Schema = new Schema({
    // _id: mongoose.Types.ObjectId,

    customerId: {type:mongoose.Types.ObjectId, ref:'Customer'},
 
    agentId: {type:mongoose.Types.ObjectId, ref:'Agent'},
 
    startDate: Date,
 
    endDate: Date,
 
    callLog: String,
 
    type: String
   
}, { timestamps: true })


export default model<IReport>('Report', reportSchema)