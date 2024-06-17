interface apiResponse {
    statusCode : number,
    data : object,
    success : boolean
}

class ApiResponse implements apiResponse {
    constructor(public statusCode : number, public data : object, public success : boolean = statusCode < 400){}
}

export default ApiResponse
