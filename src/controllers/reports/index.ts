import { Response, Request } from 'express';
import Report from '../../models/report';
import Feedback from '../../models/feedback';
import { IReport } from './../../types/report';
import { IFeedback } from '../../types/feedback';
import {IViewReport} from '../../types/viewReport';
import {IFeedbackReport} from '../../types/feedbackReport';
import {successReponse, errorReponse} from '../../util';


const addReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<IReport, 'customerId' | 'agentId' | 'startDate' | 'endDate' | 'callLog' | 'type'>
        console.log('request body', req.body);
        const report: IReport = new Report({...body}) 

        const newReport: IReport = await report.save()
        const allReports: IReport[] = await Report.find()

        res.status(201).json({ message: 'Report added', report: newReport, reports: allReports })
    } catch (error) {
        throw error
    }
}

const addFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<IFeedback, 'rating' | 'customerId' | 'userComment'>
        console.log('request body', req.body);
        const feedback: IFeedback = new Feedback({...body}) 

        const newFeedBack: IFeedback = await feedback.save()
        const allFeedBack: IFeedback[] = await Feedback.find()

        res.status(201).json({ message: 'FeedBack added', feedback: newFeedBack, feedbacks: allFeedBack })
    } catch (error) {
        throw error
    }
}
const feedBackReport = async (type) => {
    const feedBackReport = await Report.aggregate(
        [   { $match: {
                type: type
            } },
            {
                $lookup:
                  {
                    from: "feedbacks",
                    localField: "customerId",
                    foreignField: "customerId",
                    as: "report_docs"
                  }
             },
             {
                $lookup:
                  {
                    from: "customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer_docs"
                  }
             },
             {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$report_docs", 0 ] }, "$$ROOT" ] } }
             },
             {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$customer_docs", 0 ] }, "$$ROOT" ] } }
             },
             { $project: { "name": 1, "userComment": 1,  "rating": 1, "startDate": 1,} }
        ]
    )
    const result = feedBackReport.map((feedback:any)=>({
        "CustomerName":feedback.name,
        "UserComments":feedback.userComment,
        "rating":feedback.rating,
        "startDate":feedback.startDate
    }));
    return result;
}

const otherReports = async (type) => {
    const allReports = await Report.find({type:type})
            .select('customerId agentId startDate endDate type callLog')
            .populate({path:'customerId', select:'name'})
            .populate({path:'agentId', select:'name'});
    const ViewResult = allReports.map((feedback:any) => {
        return {
            CustomerName:feedback.customerId?.name,
            AgentName:feedback.agentId?.name,
            startDate:feedback.startDate,
            endDate:feedback.endDate,
            type:feedback.type,
            callLog:feedback.callLog
        }
    })
    return ViewResult;
}

const genReport = async (req: Request, res: Response) => {
    let ViewResult:IViewReport[];
    let result:IFeedbackReport[];
    try{
        if(req.params.type > 4) throw new Error("Invalid Type");
        if(req.params.type == "4"){
            result = await feedBackReport(req.params.type);
        } else {
            ViewResult = await otherReports(req.params.type)
        }

        return successReponse(res, {
            result:req.params.type == "4" ? result : ViewResult,
            message: "Record fetched Successfully"
        })
    } catch (error) {
        return errorReponse(res, {
            status_code:400,
            message:error.message
        })
    }
}


export { addReport, addFeedback, genReport }