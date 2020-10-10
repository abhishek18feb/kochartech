import { Response, Request } from 'express'
import { IAgent } from './../../types/agent'
import Agent from '../../models/agent';
import Customer from '../../models/customer';
import { ICustomer } from '../../types/customer';

const getAgents = async (req: Request, res: Response): Promise<void> => {
    try {
        const agents: IAgent[] = await Agent.find()
        res.status(200).json({ agents })
    } catch (error) {
        throw error
    }
}

const getCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const customers: ICustomer[] = await Customer.find();
        res.status(200).json({ customers })
    } catch (error) {
        throw error
    }
}

export { getAgents, getCustomers }