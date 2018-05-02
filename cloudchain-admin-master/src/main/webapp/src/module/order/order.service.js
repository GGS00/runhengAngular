/**
 * Created by shaobinhua on 2017/2/20.
 */
angular
    .module('MetronicApp')
    .factory('order', order)


function order($http){
    return {
        getLogList:getLogList,
        getList:getList,
        addPerson:addPerson,
        saveFlowSettings:saveFlowSettings,
        getAccessPerson:getAccessPerson,
        addPurchase:addPurchase,
        removePurchase:removePurchase,
        updatePurchase:updatePurchase,
        examinePurchase:examinePurchase,
        itemToArrival:itemToArrival,
        arrivalConfirm:arrivalConfirm,
        arrivalDetail:arrivalDetail,
        getNewOrderDetail:getNewOrderDetail,
        confirmSetWarehouse:confirmSetWarehouse,
        examineAgree:examineAgree,
        examineRefuse:examineRefuse,
        getAllotWarehouses:getAllotWarehouses,
        getSuppliers:getSuppliers,
        getSaleOrderDetail:getSaleOrderDetail,
        seizeInventory:seizeInventory,
        givebackInventory:givebackInventory,
        ownToWms:ownToWms,
        getSaleOriginOrderDetail:getSaleOriginOrderDetail,
        getSupplierInv:getSupplierInv,
        ownToTms:ownToTms,
        sendExpress:sendExpress,
        queryAllotRule:queryAllotRule,
        saveAllotRule:saveAllotRule,
        deleteWarehousePriorityRule:deleteWarehousePriorityRule,
        queryWarehousePriorityRule:queryWarehousePriorityRule,
        moveWarehousePriority:moveWarehousePriority,
        saveWarehousePriorityRule:saveWarehousePriorityRule,
        queryCoverAreaWarehouses:queryCoverAreaWarehouses,
        queryExamineRule:queryExamineRule,
        saveExamineRule:saveExamineRule
    }


    function getLogList(){
        return $http({url:"/sale/getExpressList",method: "get",
            params:{

            }
        });
    }

    //查询业务流程的所有配置
    function getList(){
        return $http({url:"/flowsetting/getFlows",method: "get",
            params:{

            }
        });
    }

    //保存流程配置
    function saveFlowSettings(vm){
        return $http({url:"/flowsetting/saveFlowSettings",method: "post",
            params:{
                flowSettings:JSON.stringify(vm.flowList)
            }
        });
    }

    //给每一个步骤绑定员工
    function addPerson(vm){
        return $http({url:"/flowsetting/bindEmp",method: "post",
            params:{
                emps:JSON.stringify(vm.personList)
            }
        });
    }

    //查询流程下已有权限的员工
    function getAccessPerson(vm){
        return $http({url:"/flowsetting/getBindedEmp/" + vm.flowId,method: "get",
            params:{

            }
        });
    }

    //新建采购单
    function addPurchase(vm){
        return $http({url:"/purchase/add",method: "post",
            params:{
                itemData:vm.goodList,
                arrivalDate:vm.arrivalDate,
                supplierId:vm.supplierId,
                supplierName:vm.supplierName,
                warehouseId:vm.warehouseId,
                warehouseName:vm.warehouseName,
                goodsDeliveryWay:vm.goodsDeliveryWay,
                settlementWay:vm.settlementWay,
                prepayProportion:vm.prepayProportion,
                balanceSettlementDays:vm.balanceSettlementDays,
                remark:vm.remarks
            }
        });
    }

    //删除采购单
    function removePurchase(vm){
        return $http({url:"/purchase/delete/"+vm.selectListRemove.join(),method: "post",
            params:{
            }
        });
    }

    //审核采购单
    function examinePurchase(vm){
        return $http({url:"/purchase/audit/"+vm.selectListExamine.join(),method: "post",
            params:{
            }
        });
    }

    //更新采购单
    function updatePurchase(vm){
        return $http({url:"/purchase/update",method: "post",
            params:{
                purchaseId:vm.purchaseSelect.purchaseId,
                itemData:vm.goodList,
                arrivalDate:vm.arrivalDate,
                supplierId:vm.supplierId,
                warehouseId:vm.warehouseId,
                goodsDeliveryWay:vm.goodsDeliveryWaySelected,
                settlementWay:vm.settlementWaySelected,
                prepayProportion:vm.prepayProportion,
                balanceSettlementDays:vm.balanceSettlementDays,
                remark:vm.remarks
            }
        });
    }

    //到货单信息
    function itemToArrival(vm){
        return $http({url:"/purchase/itemToArrival/"+vm.arrivalId,method: "get",
            params:{
            }
        });
    }

    //到货确认
    function arrivalConfirm(vm){
        return $http({url:"/purchase/arrival",method: "post",
            params:{
                dataList:vm.arrivalList
            }
        });
    }

    //到货明细
    function arrivalDetail(vm){
        return $http({url:"/purchase/item/"+vm.arrivalId,method: "get",
            params:{
            }
        });
    }

    //查询仓库
    function getAllotWarehouses(vm){
        return $http({url:"/sale/getAllotWarehouses",method: "get",
            params:{
                provinceId:vm.provinceId,
                cityId:vm.cityId,
                districtId:vm.districtId,
                orderId:vm.orderId
            }
        });
    }

    //查询自有仓
    function getSuppliers(vm){
        return $http({url:"/sale/getSuppliers",method: "get",
            params:{
                warehouseId:vm.clicked.warehouseId,
                skuId:vm.clicked.itemId.split(",")[1],
                itemId:vm.clicked.itemId.split(",")[0]
            }
        });
    }

    //查询供应商仓
    function getSupplierInv(vm){
        return $http({url:"/sale/getSupplierInv",method: "get",
            params:{
                supplierId:vm.clicked.warehouseId,
                skuId:vm.clicked.itemId.split(",")[1],
                itemId:vm.clicked.itemId.split(",")[0]
            }
        });
    }


    //新订单详情
    function getNewOrderDetail(vm){
        return $http({url:"/sale/getAllotedDetail/"+vm.orderId,method: "get",
            params:{
            }
        });
    }

    //供应商分配提交
    function confirmSetWarehouse(vm){
        return $http({url:"/sale/allot",method: "post",
            params:{
                "orderId":vm.orderId,
                "warehouseId":vm.clicked.warehouseId,
                "itemModels":JSON.stringify(vm.itemModels)
            }
        });
    }

    //配仓提交
    function seizeInventory(vm){
        return $http({url:"/sale/allotConfirm/"+vm.orderId,method: "post",
            params:{
            }
        });
    }

    //取消预分配
    function givebackInventory(vm){
        return $http({url:"/sale/givebackInventory/"+vm.orderId,method: "post",
            params:{
            }
        });
    }

    //新订单详情
    function getSaleOrderDetail(vm){
        return $http({url:"/sale/getSaleOrderDetail/"+vm.orderId,method: "get",
            params:{
            }
        });
    }

    //审单通过提交
    function examineAgree(vm){
        return $http({url:"/sale/agree/"+vm.action+"/"+ vm.orderId,method: "post",
            params:{

            }
        });
    }

    //审单不通过提交
    function examineRefuse(vm){
        return $http({url:"/sale/refuse/"+vm.action+"/"+ vm.orderId,method: "post",
            params:{
               remark:vm.examineRemark
            }
        });
    }

    /*代发货*/

    //自有仓发货
    function ownToWms(vm){
        return $http({url:"/ordersend/toWms/"+ vm.orderId,method: "get",
            params:{
            }
        });
    }

    //揽件供应商发货
    function ownToTms(vm){
        return $http({url:"/ordersend/toTms/"+ vm.orderId,method: "get",
            params:{
                carrierId:vm.carrierId,
                carrierName:vm.carrierName,
                carrierType:vm.carrierType,
                province:vm.sendprovince,
                city:vm.sendcity,
                district:vm.senddistrict,
                address:vm.sendaddress,
                contactor:vm.sendcontactor,
                mobile:vm.sendmobile
    }
        });
    }

    function sendExpress(vm){
        return $http({url:"/ordersend/sendExpress/" + vm.orderId,method: "get",
            params:{
                logisticsNo:vm.logisticsNo,
                expressName:vm.logisticsCompany,
                logisticsCompanyId:vm.logisticsCompanyId,
                remark:vm.logisticsRemark,
                address:vm.sendAddress,
                provinceName:vm.sendProvince,
                cityName:vm.sendCity,
                districtName:vm.sendDistrict,
                contactor:vm.sendcontactor,
                mobile:vm.sendmobile,
                sendId:vm.sendId
            }
        });
    }

    function getSaleOriginOrderDetail(vm){
        return $http({url:"/originOrder/getOriginOrderDetail/" + vm.orderId,method: "get",
            params:{
            }
        });
    }

    /* wareset & warerule */
    function queryAllotRule(vm){
        return $http({url:"/allotsetting/queryAllotRule",method: "get",
            params:{
            }
        });
    }

    function saveAllotRule(vm){
        return $http({url:"/allotsetting/saveAllotRule",method: "post",
            params:{
                allowChangeWarehouse:vm.allowChangeWarehouse,
                giftNotEnough:vm.giftNotEnough,
                invNotenoughAllotRule:vm.invNotenoughAllotRule,
                isOpen:vm.isOpen,
                ruleId:vm.ruleId
            }
        });
    }

    function deleteWarehousePriorityRule(vm){
        return $http({url:"/allotsetting/deleteWarehousePriorityRule/"+vm.deleteId,method: "post",
            params:{
            }
        });
    }

    function queryWarehousePriorityRule(vm){
        return $http({url:"/allotsetting/queryWarehousePriorityRule/"+vm.editId,method: "get",
            params:{
            }
        });
    }

    function moveWarehousePriority(vm){
        return $http({url:"/allotsetting/moveWarehousePriority",method: "post",
            params:{
                jsonStr:JSON.stringify(vm.handleList)
            }
        });
    }

    function saveWarehousePriorityRule(vm){
        return $http({url:"/allotsetting/saveWarehousePriorityRule",method: "post",
            data:{
                effectForever: vm.effectForever,
                effectTime: vm.effectTime,
               /* effectTimeStr: vm.effectTime,*/
                invalidTime:  vm.invalidTime,
               /* invalidTimeStr: vm.invalidTime,*/
                newWarehousePriority:  vm.newWarehousePriority,
                receiverCityId: vm.receiverCityId,
                receiverCityName: vm.receiverCityName,
                receiverDistrictId:  vm.receiverDistrictId,
                receiverDistrictName:  vm.receiverDistrictName,
                receiverProvinceId:  vm.receiverProvinceId,
                receiverProvinceName:  vm.receiverProvinceName,
                ruleId:  vm.ruleId,
                ruleName:  vm.ruleName,
               /* rulePriority:  vm.rulePriority,
                shipAbleCount:  vm.shipAbleCount,*/
                state: vm.state,
                usedSpu:  vm.usedSpu,
                wRuleId:  vm.wRuleId,
                warehouseTypePriority: vm.warehouseTypePriority,
                 warehousePriorityList: vm.warehousePriorityList
            }
        });
    }

    function queryCoverAreaWarehouses(vm){
        return $http({url:"/allotsetting/queryCoverAreaWarehouses",method: "get",
            params:{
                privinceId:vm.privinceId,
                cityId:vm.cityId,
                districtId:vm.districtId
            }
        });
    }


    function queryExamineRule(vm){
        return $http({url:"/orderDealRule/examineRule/queryExamineRule",method: "post",
            params:{
                ruleType:vm.ruleType
            }
        });
    }

    function saveExamineRule(vm){
        return $http({url:"/orderDealRule/examineRule/saveExamineRule",method: "post",
            params:{
                autoExamine:vm.autoExamine,
                autoDelivery:vm.autoDelivery,
                ruleType:vm.ruleType,
                ruleName:vm.ruleName,
            }
        });
    }







}



