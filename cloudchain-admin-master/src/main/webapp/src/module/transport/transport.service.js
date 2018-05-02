/**
 * Created by shaobinhua on 2017/2/20.
 */
angular
    .module('MetronicApp')
    .factory('tmsOrder', TmsOrder)
    .factory('tmsSepOrder', sepOrder)
    .factory('tmsNewWaybill', tmsNewWaybill)
    .factory('orderDetail', orderDetail)
    .factory('sepOrderByAmount', sepOrderByAmount)
    .factory('logisticsTrack', logisticsTrack)
    .factory('logisticsInfo', logisticsInfo)
    .factory('editOrderDetail', editOrderDetail)
    .factory('pointSet', pointSet)
    .factory('tmsVehicle', tmsVehicle)
    .factory('tmsVehicleType', tmsVehicleType)
    .factory('dispatch', dispatch)
    .factory('loadUp', loadUp)
    .factory('receipt', receipt)
    .factory('commonInfo', commonInfo)
    .factory('denialReason', denialReason)
    .factory('billType', billType)

function TmsOrder($http){
    return {
        activeBatch:activeBatch,
        openBatch:openBatch,
        getBillTypeList:getBillTypeList
    }
    //批量生效运单
    function activeBatch(vm){
        return $http({url:"/transport/order/active/" +  vm.selectListActive.join()/*"/process"*/,method: "post",
            params:{

            }
        });
    }

    //批量失效运单
    function openBatch(vm){
        return $http({url:"/transport/order/invalid/" +  vm.openBatchList.join()/*"/process"*/,method: "post",
            params:{

            }
        });
    }

    function getBillTypeList(vm){
        return $http({url:"/sys/dict/list"/*"/process"*/,method: "get",
            params:{
                dictTypeName:vm.dictTypeName,
            }
        });
    }


}

function sepOrder($http){
    return {
        getInfo:getInfo,
    }
    function getInfo(vm){
        return $http({url:"/transport/order/splitbysite/" + vm.id,method: "post",
            params:{
            }
        });
    }

}

function sepOrderByAmount($http){
    return {
        updateOrder:updateOrder,
    }
    function updateOrder(){
        return $http({url:"/transport/order/splitbyamount"/*"/process"*/,method: "get",
            params:{
                "bean":"tmsOrder",
                "method":"page",
                "page":1,
                "rows":20
            }
        });
    }

}

//新建运单
function tmsNewWaybill($http){
    return {
        getList:getList,
        getBillTypeList:getBillTypeList,
        addNewGoods:addNewGoods,
        addUserAddress:addUserAddress
    }
    function getList(vm){
        return $http({url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params:{
                bean: 'user',
                method: 'pageOUsersByUserId',
                page: 1,
                rows: 100,
                userType:4,
                ownerType:0
            }
        });
    }
    function getBillTypeList(vm){
        return $http({url:"/sys/dict/list"/*"/process"*/,method: "get",
            params:{
                dictTypeName:vm.dictTypeName,
            }
        });
    }

    function addNewGoods(vm){
        return $http({url:"/transport/order/addGoods"/*"/process"*/,method: "post",
            params:{
                spuName:vm.newgoodsName,
                unit:vm.newgoodsCountUnit
            }
        });
    }

    function addUserAddress(vm) {
        return $http({url: "/user/address/addUserAddress/" +vm.ownerId , method: "post",
            params: {
                company : vm.newCompanyName,
                contactName:vm.newContactorName,
                mobile : vm.newContactMobile,
                province : vm.newContactorProvince,
                provinceName : vm.newContactorProvinceName,
                city : vm.newContactorCity,
                cityName: vm.newContactorCityName,
                county : vm.newContactorCounty,
                countyName : vm.newContactorCountyName,
                address : vm.newContactorAddress,
                postcode :''
            }
        });
    }

}

//修改运单
function editOrderDetail($http){
    return {
        getDetail:getDetail,
        getList:getList,
        getBillTypeList:getBillTypeList
    }


    function getDetail(vm){
        return $http({url:"/transport/order/detail/" + vm.id/*"/process"*/,method: "get",
            params:{

            }
        });
    }

    function getList(vm){
        return $http({url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params:{
                bean: 'user',
                method: 'pageOUsersByUserId',
                page: 1,
                rows: 100,
                userType:4,
                ownerType:0
            }
        });
    }

    function getBillTypeList(vm){
        return $http({url:"/sys/dict/list"/*"/process"*/,method: "get",
            params:{
                dictTypeName:vm.dictTypeName,
            }
        });
    }

}


//订单详情
function orderDetail($http){
    return {
        getDetail:getDetail,
    }
    function getDetail(vm){
        return $http({url:"/transport/order/detail/" + vm.id/*"/process"*/,method: "get",
            params:{

            }
        });
    }

}

//物流追踪
function logisticsTrack($http){
    return {
        sign:sign,
        modify:modify
    }
    function sign(vm){
        return $http({url:"/transport/track/sign",method: "post",
            params:{
                "traceIds":vm.signList
            }
        });
    }

    function modify(vm){
        return $http({url:"/transport/track/update/"+vm.id,method: "post",
            params:{
                "id":vm.id,
                "driverName":vm.driverName,
                "driverTel":vm.driverTel
            }
        });
    }

}

//物流详情
function logisticsInfo($http){
    return {
        getList:getList,
    }
    function getList(vm){
        return $http({url:"/transport/track/detail/"+vm.id,method: "get",
            params:{

            }
        });
    }
}

//站点设置
function pointSet($http){
    return {
        getList:getList,
        commitInfo:commitInfo,
        removePonit:removePonit
    }
    function getList(vm){
        return $http({url:"/transport/tmsTrace/load/"+vm.id,method: "post",
            params:{

            }
        });
    }

    function commitInfo(vm){
        return $http({url:"/transport/setting/platform/add",method: "post",
            params:{
                "name":vm.name,
                "controller":vm.controller,
                "tel":vm.tel,
                "address":vm.address,
                "provinceId":vm.provinceId ,
                "cityId":vm.cityId,
                "districtId":vm.districtId,
                "description":vm.description
            }
        });
    }

    //删除站点信息
    function removePonit(vm){
        return $http({url:"/transport/setting/platform/del/" + vm.selectListRemove.join()/*"/process"*/,method: "post",
            params:{
            }
        });
    }
}

//载具管理
function tmsVehicle($http){
    return {
        getInfo:getInfo,
        deleteVehicle:deleteVehicle

    };
    function getInfo(vm){
        return $http({url:"/transport/setting/vehicle/detail/"+ vm.id,method: "get",
            params:{

            }
        });
    }

    function deleteVehicle(vm){
        return $http({url:"/transport/setting/vehicle/del/"+ vm.deleteList.join(),method: "post",
            params:{

            }
        });
    }

}

//车辆类型
function tmsVehicleType($http){
    return {
        deleteVehicleType:deleteVehicleType
    }

    function deleteVehicleType(vm){
        return $http({url:"/transport/setting/vehicletype/del/" + vm.selectListActive.join()/*"/process"*/,method: "post",
            params:{

            }
        });
    }


}


//调度
function dispatch($http){
    return {
        activeBatch:activeBatch,
        openBatch:openBatch,
        deleteDispatch:deleteDispatch
    }

    function activeBatch(vm){
        return $http({url:"/transport/dispatch/allocate/active/"+vm.selectListActive.join()/*"/process"*/,method: "post",
            params:{

            }
        });
    }

    function openBatch(vm){
        return $http({url:"/transport/dispatch/allocate/invalid/"+  vm.openBatchList.join()/*"/process"*/,method: "post",
            params:{

            }
        });
    }

    //删除调度单
    function deleteDispatch(vm){
        return $http({url:"/transport/dispatch/allocate/del/"+  vm.deleteList.join()/*"/process"*/,method: "get",
            params:{

            }
        });
    }

}

//装车
function loadUp($http){
    return {
        getList:getList,
        getGoodsList:getGoodsList,
        shipment:shipment
    }

    function getList(vm){
        return $http({url:"/transport/dispatch/loadup/detail/"+vm.id/*"/process"*/,method: "get",
            params:{
            }
        });
    }

    function getGoodsList(vm){
        return $http({url:"/transport/dispatch/loadup/scanGoods/"+vm.tmsOrderId/*"/process"*/,method: "get",
            params:{
            }
        });
    }

    function shipment(vm){
        return $http({url:"/transport/dispatch/loadup/shipment/"+vm.id/*"/process"*/,method: "post",
            params:{
            }
        });
    }

}

//回单管理
function receipt($http){
    return {
        getList:getList,
    }

    //签收详情
    function getList(vm){
        return $http({url:"/transport/receipt/sign/detail/"+vm.id/*"/process"*/,method: "get",
            params:{
            }
        });
    }

}


//常用联系人
function commonInfo($http){
    return {
        commonAddress:commonAddress,
        commonContactor:commonContactor,
        commonGoods:commonGoods,
        removeCommonAddress:removeCommonAddress,
        removeCommonContactor:removeCommonContactor,
        removeCommonGoods:removeCommonGoods
    }

    //常用地址
    function commonAddress(vm){
        return $http({url:"/transport/setting/commonInfo/addAddress"/*"/process"*/,method: "post",
            params:{
                provinceId:vm.provinceId,
                cityId:vm.cityId,
                districtId:vm.districtId,
                provinceName:vm.provinceName,
                cityName:vm.cityName,
                districtName:vm.districtName,
                address:vm.address
            }
        });
    }

    //删除常用地址
    function removeCommonAddress(vm){
        return $http({url:"/transport/setting/commonInfo/deleteAddress/" + vm.selectListRemove.join(),method: "post",
            params:{

            }
        });
    }

    //常用联系人
    function commonContactor(vm){
        return $http({url:"/transport/setting/commonInfo/addContactor"/*"/process"*/,method: "post",
            params:{
                name:vm.name,
                companyName:vm.companyName,
                mobile:vm.mobile
            }
        });
    }

    //删除常用联系人
    function removeCommonContactor(vm){
        return $http({url:"/transport/setting/commonInfo/deleteContactor/" + vm.selectListRemove.join()/*"/process"*/,method: "post",
            params:{

            }
        });
    }

    //常用货品
    function commonGoods(vm){
        return $http({url:"/transport/setting/commonInfo/addGoods"/*"/process"*/,method: "post",
            params:{
                name:vm.name,
                unit:vm.unit
            }
        });
    }

    //删除常用货品
    function removeCommonGoods(vm){
        return $http({url:"/transport/setting/commonInfo/deleteGoods/" + vm.selectListRemove.join()/*"/process"*/,method: "post",
            params:{
            }
        });
    }

}



//拒签原因
function denialReason($http){
    return {
        commitDenialReason:commitDenialReason,
        removeDenialReason:removeDenialReason
    }

    //提交拒签原因
    function commitDenialReason(vm){
        return $http({url:"/transport/setting/denialreason/add"/*"/process"*/,method: "post",
            params:{
                code:vm.code,
                name:vm.name,
                description:vm.description
            }
        });
    }

    //删除拒签原因
    function removeDenialReason(vm){
        return $http({url:"/transport/setting/denialreason/delete/" + vm.selectListRemove.join()/*"/process"*/,method: "post",
            params:{
            }
        });
    }

}

//单据类型
function billType($http){
    return {
        commitBillType:commitBillType,
        removeBillType:removeBillType
    }

    //提交单据类型
    function commitBillType(vm){
        return $http({url:"/transport/setting/billtype/add"/*"/process"*/,method: "post",
            params:{
                code:vm.code,
                name:vm.name
            }
        });
    }

    //删除单据类型
    function removeBillType(vm){
        return $http({url:"/transport/setting/billtype/del/" + vm.selectListRemove.join()/*"/process"*/,method: "post",
            params:{
            }
        });
    }

}



