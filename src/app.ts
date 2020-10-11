import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import reportRoutes from './routes';
import userRoutes from './routes/user';
import agentRoutes from './routes/agent';
import * as bodyParser from 'body-parser';

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

app.use(bodyParser.json());
app.use(cors())
app.use(reportRoutes)
app.use(userRoutes)
app.use(agentRoutes)

const uri: string = `mongodb://localhost/kochartech`
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.set('useFindAndModify', false)

mongoose
    .connect(uri, options)
    .then(() =>
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        )
    )
    .catch((error) => {
        throw error
    })
