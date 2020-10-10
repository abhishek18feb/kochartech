import { ICustomer } from '../types/customer';
import { model, Schema } from 'mongoose'

const customerSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    }

   
}, { timestamps: true })


export default model<ICustomer>('Customer', customerSchema)