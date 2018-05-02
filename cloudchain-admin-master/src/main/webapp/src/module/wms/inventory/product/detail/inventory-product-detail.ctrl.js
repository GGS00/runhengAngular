/**
 * 商品库存明细
 */
angular.module('MetronicApp').controller('invProductDetailControl', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','BillManage','commonUtil','Table', function($rootScope, $scope,$http,$location,uiGridConstants, settings, BillManage,commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;
    //定义单据数组
    vm.billLst = [];
    initiBill();

    vm.ownerId = $location.search().ownerId;
    vm.ownerName = $location.search().ownerName;
    vm.productId = $location.search().productId;
    vm.productName = $location.search().productName;
    vm.wareHouseId = $location.search().wareHouseId;
    vm.wareHouseName = $location.search().wareHouseName;
    vm.inventory = $location.search().inventory;

    //tab页选择控制器
    vm.showTabs = function(index){
        switch (index) {
            case 0:
                $('#myTab a[href="#tab_inventory_change"]').tab('show');
                vm.getInventChangePage();
                break;
            case 1:
                $('#myTab a[href="#tab_inventory_frozen"]').tab('show');
                vm.getInventFrozenPage();
                break;
            case 2:
                $('#myTab a[href="#tab_inventory_inbound"]').tab('show');
                vm.getInventInboundPage();
                break;
            case 3:
                $('#myTab a[href="#tab_inventory_outbound"]').tab('show');
                vm.getInventOutboundPage();
                break;
        }
    }
    
    //返回按钮
    vm.returnButton = function () {
        //window.history.back(-1);
        window.location.href = "#/wms/inventory/product";
    }

    //===============================================库存变化明细================================================================//
    vm.inventChangeParams = {
        bean:'wmsInventory',
        method:'pageInvChangeDetail',
        ownerId:vm.ownerId,
        wareHouseId:vm.wareHouseId,
        productId:vm.productId,
        qryType:'product',
        page:1,
        rows:10
    }
    vm.inventChangeColumn = [
        {  field: "code",
            displayName: '相关单据编号',
        },
        {  field: "type",
            displayName: '操作',
        },
        {  field: "moved_quantity_bu",
            displayName: '数量',
        },
        // {  field: "inventoryBal",
        //     displayName: '库存',
        // },
        {  field: "last_operated_time",
            displayName: '操作时间',
        },
    ]
    vm.getInventChangePage = function () {
        $http({url:"/process"/*'../js/services/dashBoard.json'*/,method: "get",
            params:vm.inventChangeParams
        }).success(function(data) {
            vm.inventChangeData = data;
        })
    }
    //===============================================冻结解冻记录================================================================//
    vm.inventFrozenParams = {
        bean:'inventoryFreeze',
        method:'pageQryPdtFreeze',
        ownerId:vm.ownerId,
        productId:vm.productId,
        wareHouseId:vm.wareHouseId,
        page:1,
        rows:10
    }
    vm.inventFrozenColumn = [
        {  field: "id",
            displayName: '相关单据编号',
        },
        {  field: "oper_type",
            displayName: '操作',
            cellTemplate:'<div style="padding:5px">{{row.entity.oper_type=="01"?"冻结":(row.entity.oper_type=="02"?"解冻":row.entity.oper_type)}}</div>'
        },
        {  field: "quantity",
            displayName: '数量',
        },
        {  field: "description",
            displayName: '备注',
        },
        {  field: "created_time",
            displayName: '操作时间',
        },
    ]
    vm.getInventFrozenPage = function () {
        $http({url:"/process"/*'../js/services/dashBoard.json'*/,method: "get",
            params:vm.inventFrozenParams
        }).success(function(data) {
            vm.inventFrozenData = data;
        })
    }

    //===============================================关联入库单================================================================//
    vm.inventInboundParams = {
        bean:'wmsInventory',
        method:'pageProductRelInbound',
        ownerId:vm.ownerId,
        productId:vm.productId,
        wareHouseId:vm.wareHouseId,
        page:1,
        rows:10
    }
    vm.inventInboundColumn = [
        {  field: "code",
            displayName: '入库编号',
        },
        {  field: "bill_type_id",
            displayName: '入库类型',
            cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.bill_type_id)}}</div>'
        },
        {  field: "expected_quantity_bu",
            displayName: '入库数量',
        },
        {  field: "received_quantity_bu",
            displayName: '收货数量',
        },
        {  field: "moved_quantity_bu",
            displayName: '上架数量',
        },
        {  field: "finish_time",
            displayName: '完成入库时间',
        },
    ]
    vm.getInventInboundPage = function () {
        $http({url:"/process"/*'../js/services/dashBoard.json'*/,method: "get",
            params:vm.inventInboundParams
        }).success(function(data) {
            vm.inventInboundData = data;
        })
    }
    vm.getInventInboundPage();

    //===============================================关联出库单================================================================//
    vm.inventOutboundParams = {
        bean:'wmsInventory',
        method:'pageRelOutBndByLot',
        ownerId:vm.ownerId,
        productId:vm.productId,
        wareHouseId:vm.wareHouseId,
        page:1,
        rows:10
    }
    vm.inventOutboundColumn = [
        {  field: "code",
            displayName: '出库编号',
        },
        {  field: "ownerName",
            displayName: '货主',
        },
        {  field: "bill_type_id",
            displayName: '出库单类型',
            cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.bill_type_id)}}</div>'
        },
        {  field: "plan_quantity_bu",
            displayName: '出库数量',
        },
        {  field: "finish_time",
            displayName: '完成出库时间',
        },
        {  field: "receiver_name",
            displayName: '收件人',
        },
    ]
    vm.getInventOutboundPage = function () {
        $http({url:"/process"/*'../js/services/dashBoard.json'*/,method: "get",
            params:vm.inventOutboundParams
        }).success(function(data) {
            vm.inventOutboundData = data;
        })
    }
    vm.getInventOutboundPage();


    //单据类型匹配
    $scope.matchBillType = function(billType){
        for(var i=0;i<vm.billLst.length;i++){
            if(vm.billLst[i].dataValue == billType){
                return vm.billLst[i].dataName;
            }
        }
        return billType;
    }
    function initiBill() {
        vm.dictTypeName ='出库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
            vm.billLst = data.rows;
        });
    }
}])


