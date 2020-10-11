"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorReponse = exports.successReponse = void 0;
exports.successReponse = (response, params) => {
    return response.status(200).json({
        status_code: 200,
        data: params.result,
        message: params.message
    });
};
exports.errorReponse = (response, params) => {
    return response.status(params.status_code).json({
        status_code: params.status_code,
        message: params.message
    });
};
