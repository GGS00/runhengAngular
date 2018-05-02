angular
    .module('MetronicApp')
    .factory('questionService', questionService)
    .factory('bankService', bankService);

function questionService($http) {
    return {
        getPwdQuestionList:getPwdQuestionList
    };

    function getPwdQuestionList() {
        return $http({url:"/fmsPwdQuestion/getPwdQuestionList", method: "get"});
    }
}

function bankService($http) {
    return {
        getBankList: getBankList
    };

    function getBankList() {
        return $http({url:"/fmsBank/getBankList", method: "get"});
    }
}