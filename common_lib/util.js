'use strict'

var util={};

util.notoken = { 'result': 'fail', 'errorno': 1, 'message': 'no token' };
util.invaildtoken = { 'result': 'fail', 'errorno': 2, 'message': 'invalid token...' };
util.paramserror = { 'result': 'fail', 'errorno': 3, 'message': 'params error!' };
util.servererror = { 'result': 'fail', 'errorno': 4, 'message': 'server error' };
util.nofind = { 'result': 'fail', 'errorno': 5, 'message': 'no find' };
util.vercodeerror = { 'result': 'fail', 'errorno': 6, 'message': 'get ver code error' };
util.checkvercodeerror = { 'result': 'fail', 'errorno': 7, 'message': 'check ver code error' };
util.noautherror = { 'result': 'fail', 'errorno': 8, 'message': 'The credentials you supplied did not pass authentication' }

util.hadregister = { 'result': 'fail', 'errorno': 21, 'message': 'had register' };
util.nouuiddevice = { 'result': 'fail', 'errorno': 22, 'message': 'uuid device no find' };
util.loginerror = { 'result': 'fail', 'errorno': 23, 'message': 'login error' };
util.passworderror = { 'result': 'fail', 'errorno': 24, 'message': 'password error' };
util.hadusername = { 'result': 'fail', 'errorno': 25, 'message': 'username or phone had register' };
util.hadphone = { 'result': 'fail', 'errorno': 26, 'message': 'phone had register' };
util.putinerror = { 'result': 'fail', 'errorno': 27, 'message': 'phone or password orvercode error' };
util.devicehadadd = { 'result': 'fail', 'errorno': 28, 'message': 'device had  add' };
util.haddisplayname = { 'result': 'fail', 'errorno': 29, 'message': 'displayname had  exist' };
util.deviceparamhadexist = { 'result': 'fail', 'errorno': 30, 'message': 'this device params had  add' };
util.vercodedoesnotmatchuuid = { 'result': 'fail', 'errorno': 31, 'message': 'the vercode does not macth the uuid' };
util.openidhadbind = { 'result': 'fail', 'errorno': 32, 'message': 'had  bind openid' };
util.saveerror = {'result': 'fail', 'errorno': 33, 'message': 'save in db error' };
util.normalsuccess = { 'result': 'success' };
util.operationfailed = {'result':'fail','message':'operation failed'};
util.added = {'result':'fail','errorno': 34, 'message':'Has been added'};
util.empty = {'result':'fail','errorno':35,'message':'Data is empty'};
util.nodata = {'result':'fail','errorno':36,'message':'no data'};
util.fileupload = {'result':'fail','errorno': 37,'message':'fail upload'};
util.publishfail = {'result':'fail','errorno':38,'message':'publish fail'};
util.noauth = {'result':'fail','errorno':39,'message':'no auth'};

util.checkparas = (arr, data) => {
    var re = true;
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] in data) {

        } else {
            re = false;
            break;
        }
    }

    return re;
}

util.checkparasArray = (arr,data) => {
    var flag = true;
    for(var i=0;i<data.length;i++){
        for(var j=0;j<arr.length;j++){
            if(arr[j] in data[i]){

            } else {
                flag = false;
                break;
            }
        }
    }
    return flag
}


util.normalsuccess = { 'result': 'success' };
module.exports = util;