class Validator{
    static validateTaskInfo(taskInfo){
        if(taskInfo.hasOwnProperty("title") &&
        taskInfo.hasOwnProperty("description")){
            return {
                "status": true,
                "message": "Task Details have been validated"
            };
        }
        else {
            return {"status": false,
            "message": "Task details have been malformed, please provide all the parameters"
            };
        }
    }
}

module.exports = Validator;