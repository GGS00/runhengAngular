/**
 * 批次库存控制器
 */
angular.module('MetronicApp').controller('inventoryLotController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','Table','linkageSelect', function($rootScope, $scope,$http,uiGridConstants, settings, BillManage,commonUtil,Table,linkageSelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

   //定义单据数组
    vm.billLst = [];
    initiBill();

    vm.auto_frozen_time_switch = 0;

    vm.menuLen = 4;
    vm.pageParams = {
        bean:'wmsInventory',
        method:'pageProductKeyInvent',
        page:1,
        rows:10
    }
    vm.column = [
        {  field: "product_key_id",
            displayName: '批次编号',
            width: '8%',
            visible: false,
        },
        {  field: "code",
            displayName: '相关单号',
            width: '15%',
            cellTemplate: '<a ng-click="grid.appScope.$parent.qryDetail(row.entity)" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
        },
        {   field: "skuName",
            displayName: '商品名称',
            width: '8%'
        },
        {  field: "owner_id",
            displayName: '货主ID',
            width: '8%',
            visible: false,
        },
        {  field: "ownerName",
            displayName: '货主',
            width: '8%',
        },
        {   field: "supplier_id",
            displayName: '供应商ID',
            width: '8%',
            visible: false,
        },
        {   field: "supplierName",
            displayName: '供应商',
            width: '8%'
        },
        {   field: "moved_quantity_bu",
            displayName: '上架数量',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.shelveType!="MV_OWNER"?row.entity.moved_quantity_bu:"-"}}</div>'
        },
        {   field: "inventory",
            displayName: '库存数量',
            width: '10%'
        },
        {   field: "freezeInventory",
            displayName: '冻结数量',
            width: '10%'
        },
        {   field: "wareHouseName",
            displayName: '仓库',
            width: '8%'
        },
        {   field: "areaName",
            displayName: '库区',
            width: '8%'
        },
        {   field: "locName",
            displayName: '库位',
            width: '8%'
        },
        {   field: "dest_location_id",
            displayName: '库位ID',
            width: '8%',
            visible: false,
        },
        {   field: "skuId",
            displayName: '商品编号',
            width: '8%',
            visible: false,
        },
        {   field: "locMark",
            displayName: '是否良品',
            width: '8%',
            cellTemplate:'<div style="padding:5px">{{row.entity.locMark==0?"良品":(row.entity.locMark==1?"不良品":row.entity.locMark)}}</div>'
        },
        {  field: "bill_type_id",
            displayName: '单据类型',
            width: '8%',
            cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.bill_type_id)}}</div>'
        },
        {  field: "status",
            width: '10%',
            displayName: '状态',
            cellTemplate:'<div style="padding:5px">{{row.entity.freezeInventory==0?"正常":((row.entity.inventory - row.entity.freezeInventory)==0?"全部冻结":"部分冻结")}}</div>'
        },
        // {   field: "last_operated_time",
        //     displayName: '上架时间',
        //     width: '10%'
        // },
    ]
    vm.getPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params:vm.pageParams
        }).success(function(data) {
            vm.data = data;
        })
    };
    vm.getPage();
    //搜索
    vm.getPageByFilter = function(){
        if($('input[name="ownerId"]').val() != null){
            vm.ownerId = $('input[name="ownerId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if($('input[name="supplierId"]').val() != null){
            vm.supplierId = $('input[name="supplierId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if($('input[name="productId"]').val() != null){
            vm.productId = $('input[name="productId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if($('input[name="inboundCode"]').val() != null){
            vm.inboundCode = $('input[name="inboundCode"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if($('input[name="wareHouseId"]').val() != null){
            vm.wareHouseId = $('input[name="wareHouseId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if($('input[name="areaId"]').val() != null){
            vm.areaId = $('input[name="areaId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if($('input[name="locationId"]').val() != null){
            vm.locationId = $('input[name="locationId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        vm.pageParams = {
            ownerId:vm.ownerId,
            supplierId:vm.supplierId,
            productId:vm.productId,
            code:vm.inboundCode,
            wareHouseId:vm.wareHouseId,
            areaId:vm.areaId,
            locationId:vm.locationId,
            bean:'wmsInventory',
            method:'pageProductKeyInvent',
            page:1,
            rows:10
        }
        vm.getPage();
    }
    
    //查看库存明细
    vm.viewDetail = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        $scope.qryDetail(vm.entity.getSelectedRows()[0]);
    }

    $scope.qryDetail = function (row) {
        vm.ownerName = row.ownerName;
        vm.ownerId = row.owner_id;
        vm.productId = row.skuId;
        vm.supplierName = row.supplierName;
        vm.billType = $scope.matchBillType(row.bill_type_id);
        vm.position = row.wareHouseName +'-'+ row.areaName +'-'+ row.locName;
        vm.inventory = row.inventory;
        window.location.href = "#/wms/inventory/detail?productKeyId="+row.product_key_id+"&locationId="+row.dest_location_id+
            "&position="+vm.position+"&code="+row.code+"&ownerName="+vm.ownerName+"&supplierName="+vm.supplierName+
            "&billType="+vm.billType+"&ownerId="+vm.ownerId+"&productId="+vm.productId+"&inventory="+vm.inventory;
    }
    
    //库内转移
    vm.changeLocation = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        vm.usableNum = vm.entity.getSelectedRows()[0].inventory - vm.entity.getSelectedRows()[0].preInventory - vm.entity.getSelectedRows()[0].freezeInventory;
        if(vm.usableNum == 0){
            msgAlert.info('可用库存为零,无需进行库内转移处理');
            return false;
        }
        vm.productKeyId = vm.entity.getSelectedRows()[0].product_key_id;
        vm.productId = vm.entity.getSelectedRows()[0].skuId;
        vm.skuName = vm.entity.getSelectedRows()[0].skuName;
        vm.srcLocationId = vm.entity.getSelectedRows()[0].dest_location_id;
        vm.oriCode = vm.entity.getSelectedRows()[0].code;
        vm.oriType = vm.entity.getSelectedRows()[0].bill_type_id;
        vm.locMark = vm.entity.getSelectedRows()[0].locMark;

        $('#changeLocationModal').modal('show');
        $('input[name="productName"]').val(vm.entity.getSelectedRows()[0].skuName);
        $('input[name="moveQuantity"]').val(vm.usableNum);
        $('input[name="description"]').val('');
        vm.warehouse = vm.entity.getSelectedRows()[0].wareHouseId;
    }
    //库内转移确认
    vm.confirmChangeLocation = function () {
        vm.destLocationId = linkageSelect.getSelect().locationId;
        vm.destMark = linkageSelect.getSelect().mark;
        vm.moveQuantity = $('input[name="moveQuantity"]').val();
        vm.description = $('input[name="description"]').val();
        if(vm.moveQuantity == null || vm.moveQuantity == 0){
            msgAlert.info('转移数量需大于零');
            return false;
        }
        if(vm.destLocationId == vm.srcLocationId){
            msgAlert.info('转移库位与原库位不能相等');
            return false;
        }
        //判断库存属性
        if(vm.locMark == 0){  //原库存为良品
            if(vm.destMark == "不良品"){
                msgAlert.info('良品转为不良品');
            }
        }else {
            if(vm.destMark == "良品"){
                msgAlert.info('不良品转为良品');
            }
        }
        vm.changeLocationParams = {
            oriCode:vm.oriCode,
            oriType:vm.oriType,
            productKeyId:vm.productKeyId,
            productId:vm.productId,
            skuName:vm.skuName,
            srcLocationId:vm.srcLocationId,
            srcLocationMark:vm.locMark,
            destLocationId:vm.destLocationId,
            moveQuantity:vm.moveQuantity,
            description:vm.description
        }
        $.ajax({
            url:"/wmsMoveDoc/createMoveDocApply",
            data:vm.changeLocationParams,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status == '00'){
                    msgAlert.info('交易成功');
                    $('#changeLocationModal').modal('hide');
                    $('input[name="description"]').val('')
                    vm.getPage();
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }
    
    //货权转移
    vm.changeOwner = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        vm.usableNum = vm.entity.getSelectedRows()[0].inventory - vm.entity.getSelectedRows()[0].preInventory - vm.entity.getSelectedRows()[0].freezeInventory;
        if(vm.usableNum == 0){
            msgAlert.info('可用库存为零,无需进行货权转移处理');
            return false;
        }
        vm.productKeyId = vm.entity.getSelectedRows()[0].product_key_id;
        vm.productId = vm.entity.getSelectedRows()[0].skuId;
        vm.skuName = vm.entity.getSelectedRows()[0].skuName;
        vm.srcLocationId = vm.entity.getSelectedRows()[0].dest_location_id;
        vm.srcOwnerId = vm.entity.getSelectedRows()[0].owner_id;
        vm.oriCode = vm.entity.getSelectedRows()[0].code;
        vm.oriType = vm.entity.getSelectedRows()[0].bill_type_id;
        vm.locMark = vm.entity.getSelectedRows()[0].locMark;

        $('#changeOwnerModal').modal('show');
        $('input[name="productName"]').val(vm.entity.getSelectedRows()[0].skuName);
        $('input[name="moveOwnerQuantity"]').val(vm.usableNum);
        $('input[name="mvOwnerDescription"]').val('');
        //查询货主信息
        vm.ownerPage();
    }
    //货权转移确认
    vm.confirmChangeOwner = function () {
        if(vm.ownerEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择货主信息');
            return false;
        }
        vm.destOwnerId = vm.ownerEntity.getSelectedRows()[0].userId;
        vm.moveOwnerQuantity = $('input[name="moveOwnerQuantity"]').val();
        vm.mvOwnerDescription = $('input[name="mvOwnerDescription"]').val();
        if(vm.moveOwnerQuantity == null || vm.moveOwnerQuantity == 0){
            msgAlert.info('转移数量需大于零');
            return false;
        }
        if(vm.destOwnerId == vm.srcOwnerId){
            msgAlert.info('转移货主与原货主不能相等');
            return false;
        }
        vm.changeOwnerParams = {
            oriCode:vm.oriCode,
            oriType:vm.oriType,
            productKeyId:vm.productKeyId,
            productId:vm.productId,
            skuName:vm.skuName,
            srcLocationId:vm.srcLocationId,
            srcLocationMark:vm.locMark,
            destOwnerId:vm.destOwnerId,
            moveQuantity:vm.moveOwnerQuantity,
            description:vm.mvOwnerDescription
        }
        $.ajax({
            url:"/wmsMoveDoc/createMoveOwnerApply",
            data:vm.changeOwnerParams,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status == '00'){
                    msgAlert.info('交易成功');
                    $('#changeOwnerModal').modal('hide');
                    $('input[name="mvOwnerDescription"]').val('')
                    vm.getPage();
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }

    /**************************************************************获取ums货主信息************************************************************************************/
    vm.ownerColumn = [
        {
            field: 'userId',
            displayName: '货主id',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "nickName",
            displayName: '货主名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_ownerName = '请输入货主';
    vm.icon_owner = 'plus';
    vm.ownerParams = {
        bean: 'user',
        method: 'pageOUsersByUserId',
        page: 1,
        rows: 10,
        userType:4,
        ownerType:1
    }
    vm.ownerPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.ownerParams
        }).success(function (data) {
            vm.ownerData = data;
        })
    }

    /**************************************************************冻结************************************************************************************/
    vm.frozenTypeChange = function () {
        vm.frozenType = $('input[name="frozenType"]:checked').val()
        if(vm.frozenType == '0'){  //手动
            vm.auto_frozen_time_switch = 0;
        }else {  //自动
            vm.auto_frozen_time_switch = 1;
        }
    }
    vm.inventoryFrozen = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        vm.usableNum = vm.entity.getSelectedRows()[0].inventory - vm.entity.getSelectedRows()[0].preInventory - vm.entity.getSelectedRows()[0].freezeInventory;
        if(vm.usableNum == 0){
            msgAlert.info('可用库存为零,无需进行冻结处理');
            return false;
        }
        $('#inventoryFrozenModal').modal('show');
        $('input[name="productName"]').val(vm.entity.getSelectedRows()[0].skuName);
        $('input[name="frozenQuantity"]').val(vm.usableNum);
        $('input[name="frozenDescription"]').val('');
        $('#frozenType_0').attr("checked",true);

        vm.productKeyId = vm.entity.getSelectedRows()[0].product_key_id;
        vm.productId = vm.entity.getSelectedRows()[0].skuId;
        vm.locationId = vm.entity.getSelectedRows()[0].dest_location_id;
        vm.auto_frozen_time_switch = 0;
    }

    //冻结确认
    vm.confirmInventoryFrozen = function () {
        vm.freezeQuantity = $('input[name="frozenQuantity"]').val();
        if(vm.freezeQuantity == '' || vm.freezeQuantity == 0){
            msgAlert.info('冻结数量须大于零');
            return false;
        }else if(vm.freezeQuantity > vm.usableNum){
            msgAlert.info('冻结数量:'+vm.freezeQuantity+'不能大于可用库存数量:'+vm.usableNum);
            return false;
        }
        vm.frozenDescription = $('input[name="frozenDescription"]').val();
        vm.unFreezeDt = '';
        if(vm.auto_frozen_time_switch == 1){
            vm.unFreezeDt = $('.autoFrozenTime span').html();
        }

        vm.inventoryFrozenParams = {
            productKeyId:vm.productKeyId,
            productId:vm.productId,
            locationId:vm.locationId,
            freezeQuantity:vm.freezeQuantity,
            unFreezeDt:vm.unFreezeDt,
            description:vm.frozenDescription
        }
        $.ajax({
            url:"/wmsInventroy/freezePdtKeyInv",
            data:vm.inventoryFrozenParams,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status == '00'){
                    msgAlert.info('交易成功');
                    $('#inventoryFrozenModal').modal('hide');
                    $('input[name="frozenDescription"]').val('')
                    vm.getPage();
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }

    /**************************************************************解冻************************************************************************************/
    vm.inventoryUnFrozen = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        vm.oriFreezeQuantity = vm.entity.getSelectedRows()[0].freezeInventory;
        if(vm.oriFreezeQuantity == 0){
            msgAlert.info('无冻结记录,无需解冻处理');
            return false;
        }
        $('#inventoryUnFrozenModal').modal('show');
        $('input[name="productName"]').val(vm.entity.getSelectedRows()[0].skuName);
        $('input[name="oriFreezeQuantity"]').val(vm.oriFreezeQuantity);
        $('input[name="unFreezeQuantity"]').val(vm.oriFreezeQuantity);
        $('input[name="unFrozenDescription"]').val('');

        vm.productKeyId = vm.entity.getSelectedRows()[0].product_key_id;
        vm.productId = vm.entity.getSelectedRows()[0].skuId;
        vm.locationId = vm.entity.getSelectedRows()[0].dest_location_id;
    }
    //解冻确认
    vm.confirmInventoryUnFrozen = function () {
        vm.unFreezeQuantity = $('input[name="unFreezeQuantity"]').val();
        if(vm.unFreezeQuantity == '' || vm.unFreezeQuantity == 0){
            msgAlert.info('解冻数量须大于零');
            return false;
        }else if(vm.unFreezeQuantity > vm.oriFreezeQuantity){
            msgAlert.info('解冻数量:'+vm.unFreezeQuantity+'不能大于冻结数量:'+vm.oriFreezeQuantity);
            return false;
        }
        vm.unFrozenDescription = $('input[name="unFrozenDescription"]').val();

        vm.inventoryUnFrozenParams = {
            productKeyId:vm.productKeyId,
            productId:vm.productId,
            locationId:vm.locationId,
            freezeQuantity:vm.unFreezeQuantity,
            description:vm.unFrozenDescription
        }
        $.ajax({
            url:"/wmsInventroy/unFreezePdtKeyInv",
            data:vm.inventoryUnFrozenParams,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status == '00'){
                    msgAlert.info('交易成功');
                    $('#inventoryUnFrozenModal').modal('hide');
                    $('input[name="unFrozenDescription"]').val('')
                    vm.getPage();
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }
    /**************************************************************损耗************************************************************************************/
    vm.loss = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        vm.usableNum = vm.entity.getSelectedRows()[0].inventory - vm.entity.getSelectedRows()[0].preInventory - vm.entity.getSelectedRows()[0].freezeInventory;
        if(vm.usableNum == 0){
            msgAlert.info('可用库存为零,无需进行损耗处理');
            return false;
        }
        vm.productKeyId = vm.entity.getSelectedRows()[0].product_key_id;
        vm.productId = vm.entity.getSelectedRows()[0].skuId;
        vm.skuName = vm.entity.getSelectedRows()[0].skuName;
        vm.srcLocationId = vm.entity.getSelectedRows()[0].dest_location_id;
        vm.oriCode = vm.entity.getSelectedRows()[0].code;
        vm.oriType = vm.entity.getSelectedRows()[0].bill_type_id;
        vm.locMark = vm.entity.getSelectedRows()[0].locMark;

        $('#lossModal').modal('show');
        $('input[name="productName"]').val(vm.entity.getSelectedRows()[0].skuName);
        $('input[name="lossQuantity"]').val(vm.usableNum);
        $('input[name="lossDescription"]').val('');
    }
    //损耗确认
    vm.confirmLoss = function () {
        vm.lossQuantity = $('input[name="lossQuantity"]').val();
        vm.lossDescription = $('input[name="lossDescription"]').val();
        if(vm.lossQuantity == null || vm.lossQuantity == 0){
            msgAlert.info('损耗数量需大于零');
            return false;
        }else if(vm.lossQuantity > vm.usableNum){
            msgAlert.info('损耗数量:'+vm.lossQuantity+'不能大于可用库存数量:'+vm.usableNum);
            return false;
        }
        vm.lossParams = {
            oriCode:vm.oriCode,
            oriType:vm.oriType,
            productKeyId:vm.productKeyId,
            productId:vm.productId,
            skuName:vm.skuName,
            srcLocationId:vm.srcLocationId,
            srcLocationMark:vm.locMark,
            overFlowType:'LOSS',
            moveQuantity:vm.lossQuantity,
            description:vm.lossDescription
        }
        $.ajax({
            url:"/wmsMoveDoc/createProfitLossApply",
            data:vm.lossParams,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status == '00'){
                    msgAlert.info('交易成功');
                    $('#lossModal').modal('hide');
                    vm.getPage();
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }
    /**************************************************************增溢************************************************************************************/
    vm.gain = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }

        vm.productKeyId = vm.entity.getSelectedRows()[0].product_key_id;
        vm.productId = vm.entity.getSelectedRows()[0].skuId;
        vm.skuName = vm.entity.getSelectedRows()[0].skuName;
        vm.srcLocationId = vm.entity.getSelectedRows()[0].dest_location_id;
        vm.oriCode = vm.entity.getSelectedRows()[0].code;
        vm.oriType = vm.entity.getSelectedRows()[0].bill_type_id;
        vm.locMark = vm.entity.getSelectedRows()[0].locMark;

        $('#gainModal').modal('show');
        $('input[name="productName"]').val(vm.entity.getSelectedRows()[0].skuName);
        $('input[name="gainQuantity"]').val(0);
        $('input[name="gainDescription"]').val('');
    }
    //增溢确认
    vm.confirmGain = function () {
        vm.gainQuantity = $('input[name="gainQuantity"]').val();
        vm.gainDescription = $('input[name="gainDescription"]').val();
        if(vm.gainQuantity == null || vm.gainQuantity == 0){
            msgAlert.info('增溢数量需大于零');
            return false;
        }
        vm.lossParams = {
            oriCode:vm.oriCode,
            oriType:vm.oriType,
            productKeyId:vm.productKeyId,
            productId:vm.productId,
            skuName:vm.skuName,
            srcLocationId:vm.srcLocationId,
            srcLocationMark:vm.locMark,
            overFlowType:'PROFIT',
            moveQuantity:vm.gainQuantity,
            description:vm.gainDescription
        }
        $.ajax({
            url:"/wmsMoveDoc/createProfitLossApply",
            data:vm.lossParams,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status == '00'){
                    msgAlert.info('交易成功');
                    $('#gainModal').modal('hide');
                    vm.getPage();
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }

    //单据类型匹配
    $scope.matchBillType = function(billType){
        for(var i=0;i<vm.billLst.length;i++){
            if(vm.billLst[i].dataValue == billType){
                return vm.billLst[i].dataName;
            }
        }
        if(billType == '10008001'){
            return '库内转移';
        }
        if(billType == '10008002'){
            return '货权转移';
        }
        return billType;
    }
    function initiBill() {
        vm.dictTypeName ='入库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
            vm.billLst = data.rows;
        });
    }
}])


