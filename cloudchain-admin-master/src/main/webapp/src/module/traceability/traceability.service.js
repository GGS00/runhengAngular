/**
 * 防伪码.Service
 */
angular
    .module('MetronicApp')
    .factory('Traceability', Traceability)

function Traceability($http){
    return {
        getList:getList,
        getSaveSingle:getSaveSingle,
        delSecurity:delSecurity,
        updateSecurity:updateSecurity,
        updateSureSecurity:updateSureSecurity,
        getDownloadfile:getDownloadfile

    }
    function getList(){
        return $http({url:"../js/services/list.json",method: "get",
            params:{

            }
        });
    }
    function getDownloadfile(vm) {
        return $http({url:"/securityCode/downloadTemplate",method: "post",
            params:{

            }
        });
    }

    /**
     * 防伪码添加单条
     * @param vm
     * @returns {*}
     */
    function getSaveSingle(vm){
        return $http({url:"/securityCode/saveSingle",method: "post",
            params:{
                "code": vm.code,
                "goodsName":vm.goodsName,
                "goodsId":vm.goodsId,
                "distributorId": vm.distributorId,
                "distributorName":vm.distributorName
            }
        });
    }
    /**
     * 根据**删除防伪码
     * @param vm
     * @returns {*}
     */
    function delSecurity(vm){
        return $http({url:"/securityCode/deleteSecurityCode",method: "post",
            params:vm.Params
        });
    }

    /**
     * 根据**修改防伪码
     * @param vm
     * @returns {*}
     */
    function updateSecurity(vm){
        return $http({url:"/securityCode/getSecurityCodeTotalByParams",method: "post",
            params:vm.Params
        });
    }
    /**
     * 根据**修改之后，确认
     * @param vm
     * @returns {*}
     */
    function updateSureSecurity(vm){
        return $http({url:"/securityCode/updateSecurityCode",method: "post",
            params:vm.SureParams
        });
    }
}

