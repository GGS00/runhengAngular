/**
 * Created by shaobinhua on 2017/2/20.
 */
angular
    .module('MetronicApp')
    .factory('loanRule',loanRule)
    .factory('editLoanRule',editLoanRule)
    .factory('customer',customer)
    .factory('editCustomer',editCustomer)
    .factory('bankAccount',bankAccount)
    .factory('editBankAccount',editBankAccount)
    .factory('approveApplyCredit',approveApplyCredit)
function loanRule($http) {
    return {
        activeBatch:activeBatch,
        batchInvalid:batchInvalid
    }

    //生效贷款规则
    function activeBatch(vm) {
        return $http({url:"/lmsLoanRule/updateStatus",
            method: "post",
            params:{
                ids:vm.selectListActive.join(),
                command:"active"
            }
        });
    }
    //失效贷款规则
    function batchInvalid(vm) {
        return $http({url:"/lmsLoanRule/updateStatus",
            method: "post",
            params:{
                ids:vm.selectListActive.join(),
                command:"invalid"
            }
        });
    }
}
function editLoanRule($http) {
    return {
        getDetail:getDetail
    }
    //获取详细信息
    function getDetail(vm) {
        return $http({url:"/lmsLoanRule/load",
            method: "post",
            params:{
                id:vm.id
            }
        });
    }
}
function customer($http) {
    return {
        activeBatch:activeBatch,
        batchInvalid:batchInvalid
    }

    //生效客户
    function activeBatch(vm) {
        return $http({url:"/lmsCustomer/updateStatus",
            method: "post",
            params:{
                ids:vm.selectListActive.join(),
                command:"active"
            }
        });
    }
    //失效客户
    function batchInvalid(vm) {
        return $http({url:"/lmsCustomer/updateStatus",
            method: "post",
            params:{
                ids:vm.selectListActive.join(),
                command:"invalid"
            }
        });
    }
}
function editCustomer($http) {
    return {
        getDetail:getDetail
    }
    //获取详细信息
    function getDetail(vm) {
        return $http({url:"/lmsCustomer/load",
            method: "post",
            params:{
                id:vm.id
            }
        });
    }
}
function bankAccount($http) {
    return {
        activeBatch:activeBatch,
        batchInvalid:batchInvalid
    }

    //生效银行账号
    function activeBatch(vm) {
        return $http({url:"/lmsBankAccount/updateStatus",
            method: "post",
            params:{
                ids:vm.selectListActive.join(),
                command:"active"
            }
        });
    }
    //失效银行账号
    function batchInvalid(vm) {
        return $http({url:"/lmsBankAccount/updateStatus",
            method: "post",
            params:{
                ids:vm.selectListActive.join(),
                command:"invalid"
            }
        });
    }
}
function editBankAccount($http) {
    return {
        getDetail:getDetail
    }
    //获取详细信息
    function getDetail(vm) {
        return $http({url:"/lmsBankAccount/load",
            method: "post",
            params:{
                id:vm.id
            }
        });
    }
}
function approveApplyCredit($http) {
    return {
        getDetail:getDetail
    }
    //获取详细信息
    function getDetail(vm) {
        return $http({url:"/lmsPreApplyCredit/load",
            method: "post",
            params:{
                id:vm.id
            }
        });
    }
}
