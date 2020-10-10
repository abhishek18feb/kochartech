import { IAgent } from './../types/agent';
import { model, Schema } from 'mongoose'

const agentSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    }

   
}, { timestamps: true })


export default model<IAgent>('Agent', agentSchema)