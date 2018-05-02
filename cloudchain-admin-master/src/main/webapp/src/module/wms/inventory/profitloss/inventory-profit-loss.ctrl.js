/**
 * 损耗增溢
 */
angular.module('MetronicApp').controller('inventoryProfitLossControl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','Table', function($rootScope, $scope,$http,uiGridConstants, settings, BillManage,commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.menuLen = 4;
    vm.pageParams = {
        bean:'wmsMoveDoc',
        method:'pageMoveApply',
        billTypeId:'10008003',
        page:1,
        rows:10
    }
    vm.column = [
        {  field: "move_doc_id",
            displayName: 'ID',
            visible: false,
        },
        {  field: "code",
            displayName: '编号',
            width: '15%',
        },
        // {  field: "bill_type_id",
        //     displayName: '类型',
        //     width: '8%',
        //     //cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.bill_type_id)}}</div>'
        // },
        {  field: "oriCode",
            displayName: '原始单号',
            width: '15%',
        },
        {  field: "ownerName",
            displayName: '货主',
            width: '8%',
        },
        {   field: "supplierName",
            displayName: '供应商',
            width: '8%'
        },
        {  field: "wareHouseName",
            displayName: '仓库',
            width: '8%',
        },
        {   field: "srcLocationName",
            displayName: '库位',
            width: '8%',
        },
        {   field: "product_id",
            displayName: '商品编号',
            width: '8%',
            visible: false,
        },
        {   field: "skuName",
            displayName: '商品名称',
            width: '8%',
        },
        {   field: "cateName",
            displayName: '商品分类',
            width: '8%',
        },
        {   field: "spuUnit",
            displayName: '计量单位',
            width: '8%',
        },
        {   field: "inventory_status",
            displayName: '是否良品',
            width: '8%',
            cellTemplate:'<div style="padding:5px">{{row.entity.inventory_status=="GOOD"?"良品":(row.entity.inventory_status=="BAD"?"不良品":row.entity.inventory_status)}}</div>'
        },
        {   field: "expected_quantity_bu",
            displayName: '损溢数量',
            width: '8%',
            cellTemplate:'<div style="padding:5px">{{row.entity.type=="LOSS"?"-"+row.entity.expected_quantity_bu:"+"+row.entity.expected_quantity_bu}}</div>'
        },
        {  field: "status",
            width: '10%',
            displayName: '状态',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="OPEN"?"待审核":(row.entity.status=="ACTIVE"?"审核通过":(row.entity.status=="INVALID"?"驳回":row.entity.status))}}</div>'
        },
        {   field: "description",
            displayName: '原因',
            width: '10%'
        },
        {   field: "created_time",
            displayName: '创建时间',
            width: '10%'
        },
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
        if($('input[name="oriCode"]').val() != null){
            vm.oriCode = $('input[name="oriCode"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if($('input[name="productId"]').val() != null){
            vm.productId = $('input[name="productId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if(vm.warehouseEntity.getSelectedRows().length!= 0) {
            vm.wareHouseId = vm.warehouseEntity.getSelectedRows()[0].ID
        }
        if (vm.regionEntity.getSelectedRows().length  != 0) {
            vm.areaId =   vm.regionEntity.getSelectedRows()[0].id
        }
        if (vm.locationEntity.getSelectedRows().length != 0) {
            vm.locationId=   vm.locationEntity.getSelectedRows()[0].id
        }
        vm.status = $('#id_status').val().replace(/(^\s*)|(\s*$)/g, "");
        vm.type = $('#id_type').val().replace(/(^\s*)|(\s*$)/g, "");
        vm.pageParams = {
            ownerId:vm.ownerId,
            supplierId:vm.supplierId,
            productId:vm.productId,
            oriCode:vm.oriCode,
            wareHouseId:vm.wareHouseId,
            areaId:vm.areaId,
            locationId:vm.locationId,
            status:vm.status,
            moveType:vm.type,
            billTypeId:'10008003',
            bean:'wmsMoveDoc',
            method:'pageMoveApply',
            page:1,
            rows:10
        }
        vm.getPage();
    }

    //通过
    vm.pass = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        if (vm.entity.getSelectedRows()[0].status!="OPEN"){
            msgAlert.info('非待审核状态不能执行此操作，请检查！');
            return false;
        }
        vm.moveDocId = vm.entity.getSelectedRows()[0].move_doc_id;
        BillManage.passProfitLossApply(vm).success(function(data) {
            if(data.additionalMsg.status == '00'){
                msgAlert.info('交易成功');
                vm.getPage();
                vm.entity.clearSelectedRows();
            }else if(data.additionalMsg.status=='01'){
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                vm.entity.clearSelectedRows();
            }
        });
    }

    //驳回
    vm.rebut = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        if (vm.entity.getSelectedRows()[0].status!="OPEN"){
            msgAlert.info('非待审核状态不能执行此操作，请检查！');
            return false;
        }
        vm.moveDocId = vm.entity.getSelectedRows()[0].move_doc_id;
        BillManage.rebutMoveDocApply(vm).success(function(data) {
            if(data.additionalMsg.status == '00'){
                msgAlert.info('交易成功');
                vm.getPage();
                vm.entity.clearSelectedRows();
            }else if(data.additionalMsg.status=='01'){
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                vm.entity.clearSelectedRows();
            }
        });
    }

    //删除
    vm.delete = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        if (vm.entity.getSelectedRows()[0].status!="OPEN"){
            msgAlert.info('非待审核状态不能执行此操作，请检查！');
            return false;
        }
        vm.moveDocId = vm.entity.getSelectedRows()[0].move_doc_id;
        BillManage.delMoveDocApply(vm).success(function(data) {
            if(data.additionalMsg.status == '00'){
                msgAlert.info('交易成功');
                vm.getPage();
                vm.entity.clearSelectedRows();
            }else if(data.additionalMsg.status=='01'){
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                vm.entity.clearSelectedRows();
            }
        });
    }
    /*********************************************仓库***************************************************/
    vm.warehouseColumn = [
        {
            field: 'ID',
            displayName: 'ID',

        }, {
            field: 'CODE',
            displayName: '仓库编码',
        },
        {
            field: "NAME",
            displayName: '仓库名',
        }
    ]
    vm.placeholder_warehouseName = '请选择仓库';
    vm.icon_warehouse = 'plus';
    vm.warehouseParams = {
        bean: 'wmsWarehouse',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.warehousePage = function () {

        commonUtil.getList(vm.warehouseParams).success(function (data) {

            if (data.additionalMsg.status == '00') {
                vm.warehouseData = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });

    };
    vm.warehousePage();
    //库区选择监听
    vm.warehouseLinsener = function () {
        vm.region_params = {
            bean: 'wmsWarehouseArea',
            method: 'page',
            wareHouseId: vm.warehouseEntity.getSelectedRows()[0].ID,
            page: 1,
            rows: 10
        }
        vm.regionPage();
    }
    /*********************************************库区***************************************************/
    vm.regionColumn = [
        {
            field: 'id',
            displayName: 'ID',
            visible: false,
        }, {
            field: 'code',
            displayName: '库区编码',
        },
        {
            field: "name",
            displayName: '库区名字',
        }
    ]
    vm.placeholder_regionName = '请选择库区';
    vm.icon_region = 'plus';
    vm.regionPage = function () {
        commonUtil.getList(vm.region_params).success(function (data) {

            if (data.additionalMsg.status == '00') {
                vm.regionData = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });

    };

    //库区选择监听
    vm.regionLinsener = function () {
        if( vm.regionData  ==undefined|| vm.regionData ==""|| vm.regionData ==null){
            msgAlert.info('请先选择仓库');
            return;
        }
        vm.locationrParams = {
            bean: 'wmsWarehouseLocation',
            method: 'page',
            page: 1,
            rows: 10,
            areaId: vm.regionEntity.getSelectedRows()[0].id
        }
        vm.locationPage();
    }

    /*********************************************库位***************************************************/
    vm.locationColumn = [
        {
            field: 'id',
            displayName: '库位编号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "name",
            displayName: '库位名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_locationName = '请输入库位';
    vm.icon_location = 'plus';

    vm.locationPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.locationrParams
        }).success(function (data) {
            vm.locationrData = data;
        })
    }

    //库位选择监听
    vm.locationLinsener = function () {
        if( vm.regionData  ==undefined|| vm.regionData ==""|| vm.regionData ==null){
            msgAlert.info('请先选择库区');
            return;
        }
    }
}])


