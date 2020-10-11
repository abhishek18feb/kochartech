export const successReponse = (response:any, params:any) => {
    return response.status(200).json({
        status_code: 200,
        data: params.result,
        message: params.message
    });
}

export const errorReponse = (response:any, params:any) => {
    return response.status(params.status_code).json({
        status_code: params.status_code,
        message:params.message
    });
}
