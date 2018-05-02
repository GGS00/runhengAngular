/**
 * Created by shaobinhua on 2017/3/13.
 */
/**
 * Created by shaobinhua on 2017/2/20.
 */
angular
    .module('MetronicApp')
    .factory('commonUtil', commonUtil)

function commonUtil($http){
    return {
        getList:getList,
        identity:identity,
        industry:industry,
        userApply:userApply,
        isLogin:isLogin
    }
    function getList(params){
        return $http({url:"/process"/*"../../src/test.json"*/,method: "get",
            params:params
        });
    }


    function isLogin(){
        return $http({url:"/isLogin",method: "get",
            params:{

            }
        });
    }

    function identity(vm){
        return $http({url:"/sys/identity/list",method: "get",
            params:{
                identityType:vm.identityType
            }
        });
    }
    function industry(vm){
        return $http({url:"/sys/industry/list",method: "get",
            params:{
            }
        });
    }

    function userApply(params){
        return $http({url:"/user/apply",method: "post",
            params:params
        });
    }
}



