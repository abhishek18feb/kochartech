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
    const pipeline:any = [{ $match: {
                    type: type
                } },
                {
                    $lookup:
                    {
                        from: "feedbacks",
                        localField: "customerId",
                        foreignField: "customerId",
                        as: "feedback_docs"
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
                    $lookup:
                    {
                        from: "agents",
                        localField: "agentId",
                        foreignField: "_id",
                        as: "agents_docs"
                    }
                },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$feedback_docs", 0 ] }, "$$ROOT" ] } }
                },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$customer_docs", 0 ] }, "$$ROOT" ] } }
                },
                
                {
                    $addFields: { CustomerName:"$name", AgentName: { $arrayElemAt: [ "$agents_docs.name", 0 ] } }
                }
    ];

      if (type==4){
          pipeline.push({ $project: { "CustomerName": 1,"userComment": 1,  "rating": 1, "startDate": 1} })
      }else {
        pipeline.push({ $project: { "CustomerName": 1, "AgentName":1, "startDate": 1,"endDate":1, "type":1, "callLog":1} })
      }
    const feedBackReport = await Report.aggregate(pipeline)
    
    
    return feedBackReport;
}

// const otherReports = async (type) => {
//     const allReports = await Report.find({type:type})
//             .select('customerId agentId startDate endDate type callLog')
//             .populate({path:'customerId', select:'name'})
//             .populate({path:'agentId', select:'name'});
    
//     const ViewResult = allReports.map((feedback:any) => {
//         return {
//             CustomerName:feedback.customerId?.name,
//             AgentName:feedback.agentId?.name,
//             startDate:feedback.startDate,
//             endDate:feedback.endDate,
//             type:feedback.type,
//             callLog:feedback.callLog
//         }
//     })
//     return ViewResult; 
// }

const genReport = async (req: Request, res: Response) => {
    let ViewResult:IViewReport[];
    let result:IFeedbackReport[];
    try{
        // if(req.params.type > 4) throw new Error("Invalid Type");
        if(isNaN(req.params.type) || (parseInt(req.params.type)<1 && parseInt(req.params.type)>4)) throw new Error('Not a valid type');
        if(req.params.type == "4"){
            result = await feedBackReport(req.params.type);
        } else {
            // ViewResult = await otherReports(req.params.type)
            ViewResult = await feedBackReport(req.params.type);
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