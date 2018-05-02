/**
 * WMS.Service
 */
angular
    .module('MetronicApp')
    .factory('BillManage', BillManage)
function BillManage($http){
    return {
    activeBatch:activeBatch,
        createShelve:createShelve,
        NewOutbound:NewOutbound,
        DeleteOutbound:DeleteOutbound,
        activeShelve:activeShelve,
        disableShelve:disableShelve,
        getOutboundDetail:getOutboundDetail,
        confirmSingleShelve:confirmSingleShelve,
        doInputUC:doInputUC,
        SaveOutboundDetail:SaveOutboundDetail,
        ActiveOutbound:ActiveOutbound,
        invalidOutbound:invalidOutbound,
        UpdateOutbound:UpdateOutbound,
        updateGoodDetal:updateGoodDetal,
        delGoodDetail:delGoodDetail,
        autoAllocate:autoAllocate,
         pickActive:pickActive,
        pickInvalid:pickInvalid,
        pickSureLength:pickSureLength,
        pickSureScan:pickSureScan,
        parceSure:parceSure,
        batchInvalid:batchInvalid,
        batchDelete:batchDelete,
        getGoodsMaxNumber:getGoodsMaxNumber,
        getInboundDetail:getInboundDetail,
        updInbound:updInbound,
        delInboundDetail:delInboundDetail,
        updItemDetailSure:updItemDetailSure,

        WarehouseAdd:WarehouseAdd,
        WarehouseUpdate:WarehouseUpdate,
        WarehouseInvalid:WarehouseInvalid,

        addCarton:addCarton,
        updateCarton:updateCarton,
        deleteCarton:deleteCarton,
        getCarton:getCarton,

        wmsWarehouseAreaActive:wmsWarehouseAreaActive,
        wmsWarehouseAreaInvalid:wmsWarehouseAreaInvalid,
        wmsWarehouseAreaAdd:wmsWarehouseAreaAdd,
        wmsWarehouseAreaUpdate:wmsWarehouseAreaUpdate,
        wmsWarehouseType:wmsWarehouseType,
        qryHouseAreaDetailById:qryHouseAreaDetailById,
        wmsWarehouseupdate:wmsWarehouseupdate,
        qryHouseLocationDetailById:qryHouseLocationDetailById,
        wmsWarehouseLocationAdd:wmsWarehouseLocationAdd,
        wmsWarehouseLocationActive:wmsWarehouseLocationActive,
        wmsWarehouseLocationInvalid:wmsWarehouseLocationInvalid,
        wmsWarehouseLocationUpdate:wmsWarehouseLocationUpdate,
        TaskAllocate:TaskAllocate,
        pickWorkAllocate:pickWorkAllocate,
        getBillTypeList:getBillTypeList,
        getWareHosuseByUserId:getWareHosuseByUserId,
        quickShelf:quickShelf,
        quickPick:quickPick,
        passMoveDocApply:passMoveDocApply,
        rebutMoveDocApply:rebutMoveDocApply,
        delMoveDocApply:delMoveDocApply,
        passMoveOwnerApply:passMoveOwnerApply,
        passProfitLossApply:passProfitLossApply,
        qryAuthorityHouseLst:qryAuthorityHouseLst,
        printInbound:printInbound,
        qryAreaLstByHouseId:qryAreaLstByHouseId,
        addStockTakePlan:addStockTakePlan,
        statNumForStockTakeItem:statNumForStockTakeItem,
        stockTakeItemAlloct:stockTakeItemAlloct,
        stockTakeActive:stockTakeActive,
        stockTakeItemActive:stockTakeItemActive,
        getWayBillData:getWayBillData,
        stockTakeBatchInput:stockTakeBatchInput,
        dealCheckDiff:dealCheckDiff,
        checkUniCode:checkUniCode,
        getOutboundPrintData:getOutboundPrintData,
        confirmPackage:confirmPackage,
        overPackage:overPackage,
        getOutboundPrint:getOutboundPrint,
        wmsFeeTypeAdd:wmsFeeTypeAdd,
        wmsFeeTypeUpdate:wmsFeeTypeUpdate,
        wmsFeeTypeDelete:wmsFeeTypeDelete,
        addInbound:addInbound,
        qryWarehouseByUser:qryWarehouseByUser,
        qryWarehousePlaneChart:qryWarehousePlaneChart,
        qryWarehousePlaneChart:qryWarehousePlaneChart,
        addInbound:addInbound,
        wmsRequisitionAdd:wmsRequisitionAdd,
        wmsRequisitionUpdate:wmsRequisitionUpdate,
        wmsRequisitionDelete:wmsRequisitionDelete,
        wmsRequisitionLoad:wmsRequisitionLoad,
        wmsRequisitionItemAdd:wmsRequisitionItemAdd,
        wmsRequisitionItemUpdate:wmsRequisitionItemUpdate,
        wmsRequisitionItemDelete:wmsRequisitionItemDelete,
        wmsRequisitionActive:wmsRequisitionActive,
        wmsOptFeeAdd:wmsOptFeeAdd,
        wmsRequisitionInvalid:wmsRequisitionInvalid,
        wmsOptFeeUpdate:wmsOptFeeUpdate,
        wmsOptFeeDelete:wmsOptFeeDelete

    }

    function activeBatch(vm) {
        return $http({url:"/wmsInbound/batchUpdateStatus/" + vm.selectListActive.join(),
            method: "post",
            params:{
            }
        });
    }

    function batchInvalid(vm) {
        return $http({url:"/wmsInbound/batchInvalid/" + vm.selectListActive.join(),
            method: "post",
            params:{
            }
        });
    }

    function createShelve(vm){
        return $http({url:"/shelveDoc/createShelveDoc/" + vm.entity.getSelectedRows()[0].id,
            method: "post",
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

    //新建出库单
    function NewOutbound(vm) {
        return $http({url:"/wmsOutbound/add",
            method: "post",
            params:vm.outbound_save
        });
    }
   //删除出库单
    function  DeleteOutbound(vm) {
        return $http({url:"/wmsOutbound/delete",
            method: "post",
            params:vm.outbound_del
        });
    }

    function activeShelve(vm) {
        return $http({url:"/shelveDoc/activeShelveDoc/" + vm.entity.getSelectedRows()[0].id,
            method: "post",
            params:{}
        });
    }

    function disableShelve(vm) {
        return $http({url:"/shelveDoc/disableShelveDoc/" + vm.entity.getSelectedRows()[0].id,
            method: "post",
            params:{}
        });
    }

    function confirmSingleShelve(vm) {
        return $http({url:"/shelveDoc/singleConfirmDoc",
            method: "post",
            params:{
                taskId:vm.entity.getSelectedRows()[0].id,
                quantity:$('#quantity').val()
            }
        });
    }

    /**
     * 出库单-获取出库单详情
     * @param vm
     * @returns {*}
     */
    function getOutboundDetail(vm) {
        return $http({url:"/wmsOutbound/load",
            method: "post",
            params:{
            id:vm.outboundId
            }
        });
    }

    /**
     * 获取添加商品最大数量
     * @param vm
     * @returns {*}
     */
    function getGoodsMaxNumber(vm) {
        return $http({url:"/wmsOutboundItem/getInv",
            method: "post",
            params:{
                productCode:vm.outboundProductCode,
                id:vm.outboundId
            }

        });
    }
    //出库单-保存出库单明细
    function SaveOutboundDetail(vm) {
        return $http({url:"/wmsOutboundItem/add",
            method: "post",
            params:vm.outboundDetail_save,
        });
    }
    //出库单-修改出库单
    function  UpdateOutbound(vm){
        return $http({url:"/wmsOutbound/update",
            method: "post",
            params:vm.updateParams
        });
    }
    /**
     * 出库单-生效出库单
     * @returns {*}
     * @constructor
     */
    function  ActiveOutbound(vm) {
        return $http({url:"/wmsOutbound/active",
            method: "post",
            params:vm.activeParam,

        });
    }

    /**
     * 出库单-失效出库单
     * @returns {*}
     * @constructor
     */
    function  invalidOutbound(vm) {
        return $http({url:"/wmsOutbound/invalid",
            method: "post",
            params:vm.invalidParam

        });
    }

    /**
     * 出库单-更新商品明细
     */
    function updateGoodDetal(vm) {
        return $http({url:"/wmsOutboundItem/update",
            method: "post",
            params:vm.updategoodParam,

        });
    }

    /**
     * 出库单-删除商品明细
     */
    function delGoodDetail(vm) {
        return $http({url:"/wmsOutboundItem/delete",
            method: "post",
            params:vm.delgoodParam,

        });
    }

    /**
     * 拣货单-自动分配
     */
    function autoAllocate(vm) {
        return $http({url:"/wmsPickDoc/autoAllocate",
            method: "post",
            params:{
               id:vm.autoId
            }
        });
    }

    /**
     * 拣货单-自动分配
     */
    function pickActive(vm) {
        return $http({url:"/wmsPickDoc/active",
            method: "post",
            params:{
                id:vm.pickId
            }
        });
    }

    /**
     * 拣货单失效
     * @param vm
     * @returns {*}
     */
    function pickInvalid(vm) {
        return $http({url:"/wmsPickDoc/invalid",
            method: "post",
            params:{
                id:vm.pickId
            }
        });
    }

    /**
     * 拣选确认-录入长度
     * @param vm
     * @returns {*}
     */
    function pickSureLength(vm) {
        return $http({url:"/wmsPickWork/confirm",
            method: "post",
            params:vm.pickLengthparams
        });
    }

    /**
     * 拣选确认-录入串码
     * @param vm
     * @returns {*}
     */
    function  pickSureScan(vm) {
        return $http({url:"/wmsPickWork/confirm",
            method: "post",
            params:vm.pickScanParams
        });
    }
    /**
     * 任务分配
     * @param vm
     * @returns {*}
     */
    function  TaskAllocate(vm) {
        return $http({url:"/wmsPickWork/taskAllocate/"+vm.taskId,
            method: "post",
            params:{
                taskExecutor:vm.taskExecutor,
                workerName: vm.workerName
            }
        });
    }

    /**
     * 作业分配
     * @param vm
     * @returns {*}
     */
    function  pickWorkAllocate(vm) {
        return $http({url:"/wmsPickWork/workAllocate/"+vm.docId,
            method: "post",
            params:{
                taskExecutor:vm.taskExecutor,
                workerName: vm.workerName
            }
        });
    }

    /**
     * 发运确认
     */
    function parceSure(vm) {
        return $http({url:"/wmsShip/shipped",
            method: "post",
            params:vm.shipParam
        });
    }

    /**
     * 新增周转箱
      * @param vm
     * @returns {*}
     */
    function addCarton(vm) {
        return $http({url:"/wms/turnoverCarton/add",
            method: "post",
            data:vm.addParam,

        });
    }

    /**
     * 周转箱详情
     * @param vm
     * @returns {*}
     */
    function getCarton(vm) {
        return $http({url:"/wms/turnoverCarton/load/"+vm.id,
            method: "get"
        });
    }

    /**
     * 更新周转箱
     * @param vm
     * @returns {*}
     */
    function updateCarton(vm) {
        return $http({url:"/wms/turnoverCarton/update",
            method: "post",
            data:vm.updateParam,

        });
    }

    /**
     * 删除周转箱
     * @param vm
     * @returns {*}
     */
    function deleteCarton(vm) {
        return $http({url:"/wms/turnoverCarton/delete/"+vm.deleteList.join(),
            method: "post"
        });
    }

    /**
     * 仓库添加
     * @returns {*}
     * @constructor
     */
    function  WarehouseAdd(vm) {
        return $http({url:"/wmsWarehouse/add",
            method: "post",
            params:vm.addParam,

        });
    }
    /**
     * 仓库修改
     * @returns {*}
     * @constructor
     */
    function  WarehouseUpdate(vm) {
        return $http({url:"/wmsWarehouse/update",
            method: "post",
            params:vm.updateParam,

        });
    }
    /**
     * 仓库失效
     * @returns {*}
     * @constructor
     */
    function  WarehouseInvalid(vm) {
        return $http({url:"/wmsWarehouse/invalid",
            method: "post",
            params:vm.invalidParam,

        });
    }
    /**
     * 库区生效
     * @returns {*}
     * @constructor
     */
    function  wmsWarehouseAreaActive(vm) {
        return $http({url:"/wmsWarehouseArea/active",
            method: "post",
            params:vm.activeParam,

        });
    }
    /**
     * 库区添加
     * @returns {*}
     * @constructor
     */
    function  wmsWarehouseAreaAdd(vm) {
        return $http({url:"/wmsWarehouseArea/add",
            method: "post",
            data:vm.addParam,

        });
    }
    //库区查询
    function qryHouseAreaDetailById(vm) {
        return $http({url:"/wmsWarehouseArea/qryHouseAreaDetailById/"+vm.regionId,
            method: "get"
        });
    }
    //库区查询
    function wmsWarehouseupdate(vm) {
        return $http({url:"/wmsWarehouseArea/update/",
            method: "post",
            params:vm.addParam,
        });
    }

    /**
     * 库区查询仓库类型
     * @returns {*}
     * @constructor
     */
    function wmsWarehouseType(vm) {
        return $http({url:"/wmsWarehouse/qryWarehouseBasicById/"+vm.typeId,
            method: "get"
        });
    }
    /**
     * 库区修改
     * @returns {*}
     * @constructor
     */
    function  wmsWarehouseAreaUpdate(vm) {
        return $http({url:"/wmsWarehouseArea/update",
            method: "post",
            params:vm.updateParam,

        });
    }
    /**
     * 库区失效
     * @returns {*}
     * @constructor
     */
    function   wmsWarehouseAreaInvalid(vm) {
        return $http({url:"/wmsWarehouseArea/invalid",
            method: "post",
            params:vm.invalidParam,

        });
    }

    /**
     * 库位添加
     * @returns {*}
     * @constructor
     */
    function  wmsWarehouseLocationAdd(vm) {
        return $http({url:"/wmsWarehouseLoc/add",
            method: "post",
            data:vm.addParam,

        });
    }
    /**
     * 库位修改
     * @returns {*}
     * @constructor
     */
    function  wmsWarehouseLocationUpdate(vm) {
        return $http({url:"/wmsWarehouseLoc/update",
            method: "post",
            params:vm.updateParam,

        });
    }
    function  qryHouseLocationDetailById(vm){
        return $http({url:"/wmsWarehouseLoc/qryHouseLocationDetailById/"+vm.regionId,
            method: "get",
        });
    }
    /**
     * 库位失效
     * @returns {*}
     * @constructor
     */
    function   wmsWarehouseLocationInvalid(vm) {
        return $http({url:"/wmsWarehouseLoc/invalid",
            method: "post",
            params:vm.invalidParam,

        });
    }
    /**
     * 库位生效
     * @returns {*}
     * @constructor
     */
    function  wmsWarehouseLocationActive(vm) {
        return $http({url:"/wmsWarehouseLoc/active",
            method: "post",
            params:vm.activeParam,

        });
    }
    function  doInputUC(vm){
        var codeArray = [];
        var uniqueCodes = $('#uniqueCodes').val();
        var length = $('#length').val();
        var uniqueCode_Array = $.trim(uniqueCodes).split("\n");
        for(var i = 0;i<uniqueCode_Array.length;i++){
            var code = $.trim(uniqueCode_Array[i]);//得到每行数据
            if(code != ""){
                if(code.length == length){
                    codeArray.push(code);
                }else{//不通过
                    msgAlert.text('输入串码长度与填写长度不一致，请重新输入');
                    return false;
                }
            }
        }
        var uniqueCode = codeArray.join(',');
        return $http({url:"/wmsInbound/doInputUC",
            method: "post",
            params:{
                id:vm.entity.getSelectedRows()[0].id,
                length:length,
                uniqueCodes :uniqueCode,
                inventoryStatus:vm.entity.getSelectedRows()[0].inventoryStatus,
                uniqueCodeCount: vm.entity.getSelectedRows()[0].expectedSnQuantity - vm.entity.getSelectedRows()[0].realSnQuantity
            }
        });
    }


    /**
     * 批量删除入库单
     * @param vm
     * @returns {*}
     */
    function batchDelete(vm){
        return $http({url:"/wmsInbound/deleteInbound/" + vm.selectListDelete.join(),
            method: "post",
            params:{}
        });
    }
    /**
     * 入库单-获取入库单详情
     * @param vm
     * @returns {*}
     */
    function getInboundDetail(vm) {
        return $http({url:"/wmsInbound/getWmsInbound",
            method: "get",
            params:{
                id:vm.inboundId
            }
        });
    }
    //入库单-添加入库单
    function  addInbound(vm){
        return $http({url:"/wmsInbound/addInbound",
            method: "post",
            data:vm.wmsInboundRequest
        });
    }
    //入库单-修改入库单
    function  updInbound(vm){
        return $http({url:"/wmsInbound/updateInbound",
            method: "post",
            params:vm.updateParams
        });
    }
    //入库单-修改入库单明细
    function  updItemDetailSure(vm){
        return $http({url:"/wmsInboundItem/updInboundItem",
            method: "post",
            params:vm.updateItemParam
        });
    }
    //入库单-删除入库单明细
    function  delInboundDetail(vm){
        return $http({url:"/wmsInboundItem/delInboundItems",
            method: "post",
            params:vm.delItemsParam
        });
    }
    //查询指定用户的仓库信息
    function  getWareHosuseByUserId(vm){
        return $http({url:"/wmsWarehouse/qryWareHouseByUserId",
            method: "post",
            params:vm.wareHouseParam
        });
    }
    //一键入库
    function  quickShelf(vm) {
        return $http({url:"/wmsInbound/quickShelf/"+vm.inboundId,
            method: "get",
            params:{}
        });
    }
    //出库单 一键生成作业单
    function  quickPick(vm) {
        return $http({url:"/wmsOutbound/quickPick/"+vm.outboundId,
            method: "get",
            params:vm.params
        });
    }
    //移位申请 通过
    function  passMoveDocApply(vm) {
        return $http({url:"/wmsMoveDoc/passMoveDocApply/"+vm.moveDocId,
            method: "get",
            params:{}
        });
    }
    //移位申请 驳回
    function  rebutMoveDocApply(vm) {
        return $http({url:"/wmsMoveDoc/rebutMoveDocApply/"+vm.moveDocId,
            method: "get",
            params:{}
        });
    }
    //移位申请 删除
    function  delMoveDocApply(vm) {
        return $http({url:"/wmsMoveDoc/delMoveDocApply/"+vm.moveDocId,
            method: "get",
            params:{}
        });
    }
    //货权转移申请 通过
    function  passMoveOwnerApply(vm) {
        return $http({url:"/wmsMoveDoc/passMoveOwnerApply/"+vm.moveDocId,
            method: "get",
            params:{}
        });
    }
    //损耗增溢申请 通过
    function  passProfitLossApply(vm) {
        return $http({url:"/wmsMoveDoc/passProfitLossApply/"+vm.moveDocId,
            method: "get",
            params:{}
        });
    }
    //盘点，获取员工权限下的仓库列表
    function  qryAuthorityHouseLst() {
        return $http({url:"/wmsWarehouse/qryAuthorityHouseLst",
            method: "get",
            params:{}
        });
    }

    function printInbound(id) {
        return $http({url:"/wmsInbound/printInbound/"+ id,
            method: "get",
        });
    }
    //根据仓库id查询仓库下的库区
    function  qryAreaLstByHouseId(id) {
        return $http({url:"/wmsWarehouse/qryAreaLstByHouseId/"+id,
            method: "get",
            params:{}
        });
    }

    function addStockTakePlan(vm) {
            return $http({url:"/wmsStockTake/addStockTakePlan",
                method: "post",
                data: vm.wmsStockTakePlanModel
            });
    }
    function  statNumForStockTakeItem(vm) {
        return $http({url:"/wmsStockTake/statNumForStockTakeItem/"+vm.stocktakeCode,
            method: "post",
            params: vm.params
        });
    }


    function getOutboundPrintData(id) {
        return $http({url:"/package/getOutboundPrintData",
            method: "post",
            data: {packageTaskId:id}
        });
    }

    function getWayBillData(ids) {
        return $http({url:"/package/getWayBillData",
            method: "post",
            data: ids
        });
    }
    
    function checkUniCode(info) {
        return $http({url:"/package/checkUCode",
            method: "post",
            data: info
        });
    }
    
    function confirmPackage(info) {
        return $http({url:"/package/confirmPackage",
            method: "post",
            data: info
        });
    }

    function overPackage(id) {
        return $http({url:"/package/overPackage",
            method: "post",
            data: {packageTaskId:id}
        });
    }
    

    function  stockTakeItemAlloct(vm) {
        return $http({url:"/wmsStockTake/stockTakeItemAlloct",
            method: "post",
            data: vm.params
        });
    }

    function  stockTakeActive(code) {
        return $http({url:"/wmsStockTake/stockTakeActive/"+code,
            method: "post",
            params:{}
        });
    }
    //盘点分配生效
   function stockTakeItemActive(vm) {
       return $http({url:"/wmsStockTake/stockTakeItemActive",
           method: "post",
           data: vm.params
       });
   }
   //初盘录入
    function stockTakeBatchInput(vm) {
        return $http({url:"/wmsStockTake/stockTakeBatchInput",
            method: "post",
            data: vm.params
        });
    }
    //平账
    function  dealCheckDiff(vm) {
        return $http({url:"/wmsStockTake/dealCheckDiff/"+vm.stockCode,
            method: "post",
            params: vm.params
        });
    }

    function getOutboundPrint(id) {
        return $http({url:"/wmsOutbound/getOutboundPrint/"+id,
            method: "get",
        });
    }

    function  wmsOptFeeAdd(vm) {
        return $http({url:"/wmsOptFee/add",
            method: "post",
            data:vm.optFee_save,
        });
    }

    function  wmsOptFeeUpdate(vm) {
        return $http({url:"/wmsOptFee/update",
            method: "post",
            data:vm.optFee_update,
        });
    }

    function  wmsOptFeeDelete(id) {
        return $http({url:"/wmsOptFee/delete/"+id,
            method: "post",
            data:"",
        });
    }

    function  wmsFeeTypeAdd(vm) {
        return $http({url:"/wmsFeeType/add",
            method: "post",
            data: vm.params,
        });
    }
    function  wmsFeeTypeUpdate(vm) {
        return $http({url:"/wmsFeeType/update",
            method: "post",
            data: vm.params
        });
    }
    function  wmsFeeTypeDelete(id) {
        return $http({url:"/wmsFeeType/delete/"+id,
            method: "post",
            data: "",
        });
    }
    //调拨单添加
    function wmsRequisitionAdd(vm){
        return $http({url:"/wmsRequisition/add",
            method: "post",
            data: vm.params
        });
    }
    //调拨单修改
    function wmsRequisitionUpdate(vm){
        return $http({url:"/wmsRequisition/update",
            method: "post",
            data: vm.params
        });
    }
    //调拨单删除
    function wmsRequisitionDelete(id){
        return $http({url:"/wmsRequisition/delete",
            method: "post",
            params:{
                id:id
            }
        });
    }
    //调拨单查询
    function wmsRequisitionLoad(id){
        return $http({url:"/wmsRequisition/load",
            method: "post",
            params:{
                id:id
            }
        });
    }
    //调拨单生效
    function wmsRequisitionActive(id){
        return $http({url:"/wmsRequisition/active",
            method: "post",
            params:{
                id:id
            }
        });
    }
    //调拨单失效
    function wmsRequisitionInvalid(id){
        return $http({url:"/wmsRequisition/invalid",
            method: "post",
            params:{
                id:id
            }
        });
    }
    //新建调拨单明细
    function wmsRequisitionItemAdd(vm){
        return $http({url:"/wmsRequisitionItem/add",
            method: "post",
            data: vm.params
        });
    }
    //更新调拨单明细
    function wmsRequisitionItemUpdate(vm){
        return $http({url:"/wmsRequisitionItem/update",
            method: "post",
            data: vm.params
        });
    }
    //删除调拨单明细
    function wmsRequisitionItemDelete(id){
        return $http({url:"/wmsRequisitionItem/delete",
            method: "post",
            params:{
                id:id
            }
        });
    }


    function  qryWarehouseByUser(vm) {
        return $http({url:"/wmsWarehousePlaneChart/qryWarehouseByUser",
            method: "get",
            params:{},
        });
    }

    function  qryWarehousePlaneChart(vm) {
        return $http({url:"/wmsWarehousePlaneChart/qryWarehousePlaneChart/"+vm.wareHouseId,
            method: "get",
            params:{},
        });
    }
}
