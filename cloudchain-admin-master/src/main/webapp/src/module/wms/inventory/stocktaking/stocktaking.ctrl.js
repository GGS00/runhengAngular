/**
 * 批次库存控制器
 */
angular.module('MetronicApp').controller('stocktakingCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', 'linkageSelect', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table, linkageSelect) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    //定义单据数组
    vm.billLst = [];

    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'wmsStockTake',
        method: 'pageQryStockTake',
        page: 1,
        rows: 10
    }
    vm.column = [
        {
            field: "code",
            displayName: '盘点单编号',
            width: '10%',
        },
        {
            field: "wareHouseName",
            displayName: '盘点仓库',
            width: '12%',
        },
        {
            field: "wareHouseId",
            visible: false,
            displayName: '盘点仓库id',
            width: '15%',
        },
        {
            field: "sku_num",
            displayName: '商品sku数量',
            width: '8%'
        },
        {
            field: "check_type",
            displayName: '盘点类型',
            width: '8%',
            cellTemplate: '<div style="padding:5px">{{row.entity.check_type=="01"?"全盘":(row.entity.check_type=="02"?"动碰盘":(row.entity.check_type=="03"?"抽盘":""))}}</div>'
        },
        {
            field: "check_mode",
            displayName: '盘点方式',
            width: '8%',
            cellTemplate: '<div style="padding:5px">{{row.entity.check_mode=="01"?"明盘":(row.entity.check_mode=="02"?"暗盘":"")}}</div>'
        },
        {
            field: "start_dt",
            displayName: '预计开始时间',
            width: '10%',
        },
        {
            field: "end_dt",
            displayName: '预计结束时间',
            width: '10%'
        },
        {
            field: "created_time",
            displayName: '创建时间',
            width: '10%'
        },
        {
            field: "creator",
            displayName: '创建人',
            width: '10%'
        },
        {
            field: "status",
            displayName: '当前状态',
            width: '10%',
            cellTemplate: '<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.status)}}</div>'
        }
    ]
    vm.getPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.pageParams
        }).success(function (data) {
            vm.data = data;
        })
    };
    vm.getPage();

    function initial() {
        vm.dictTypeName = '盘点单状态';
        BillManage.getBillTypeList(vm).success(function (data) {
            vm.billLst = data.rows;
        });
    }

    initial();

    //单据类型匹配
    $scope.matchBillType = function (billType) {
        for (var i = 0; i < vm.billLst.length; i++) {
            if (vm.billLst[i].dataValue == billType) {
                return vm.billLst[i].dataName;
            }
        }
        return billType;
    }

    //页面搜索
    vm.getPageByFilter = function () {

        if ($('.createtime span').html().slice(0, 10) == "-") {
            vm.wareBeginTime = "";
        } else {
            vm.wareBeginTime = $('.createtime span').html().slice(0, 10);
        }
        vm.wareEndTime = $('.createtime span').html().slice(11, 21);
        vm.pageParams = {
            wareHouseId: $.trim($("#id_WarehouseId").val()),
            creatorName: $.trim($("#id_creater").val()),
            qryBeginTime: vm.wareBeginTime,
            qryEndTime: vm.wareEndTime,
            status: $.trim($("#id_status").val()),
            bean: 'wmsStockTake',
            method: 'pageQryStockTake',
            page: 1,
            rows: 10
        }
        vm.getPage();
    }

    //新增盘点计划
    vm.stockPlan = function () {
        window.location.href = "#/wms/inventory/stocktaking/addstock";

    }
    //盘点生效
    vm.stockActive = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        if (vm.entity.getSelectedRows()[0].status == "00") {
            BillManage.stockTakeActive(vm.entity.getSelectedRows()[0].code).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.info('盘点单生效成功');
                    vm.getPage();
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        }else {
            msgAlert.info('盘点单已生效,无需重复操作,请检查');
            return false;
        }


    }

    //初盘分配
    vm.stockallocat = function (index) {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }

        if (index == 1) { //初盘分配
            vm.alloctType = "01";
            if (vm.entity.getSelectedRows()[0].status!= "01") {
                msgAlert.info('   盘点单未生效或已分配,无需初盘分配,请检查');
                return false;
            }
        } else if (index == 2) {//复盘分配
            vm.alloctType = "02";
            if (vm.entity.getSelectedRows()[0].status!= "03") {
                msgAlert.info('盘点单未初盘或已分配,无需复盘分配,请检查');
                return false;
            }
        }
        //需要带单据编号、仓库名称、计划开始时间、计划结束时间、创建时间
        window.location.href = "#/wms/inventory/stocktaking/allocation?code=" + vm.entity.getSelectedRows()[0].code
            + "&warehouseName=" + vm.entity.getSelectedRows()[0].wareHouseName + "&startTime=" + vm.entity.getSelectedRows()[0].start_dt
            + "&endTime=" + vm.entity.getSelectedRows()[0].end_dt + "&creatTime=" + vm.entity.getSelectedRows()[0].created_time + "&wareHouseId=" + vm.entity.getSelectedRows()[0].wareHouseId + "&alloctType=" + vm.alloctType;


    }
    //初盘
    vm.initstock = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        if (vm.entity.getSelectedRows()[0].status!= "02") {
            msgAlert.info('盘点单非待初盘状态,无需初盘操作,请检查');
            return false;
        }
        //需要带单据编号、仓库名称、创建人、账存时间
        window.location.href = "#/wms/inventory/stocktaking/binitstock?code=" + vm.entity.getSelectedRows()[0].code
            + "&warehouseName=" + vm.entity.getSelectedRows()[0].wareHouseName + "&wareHouseId=" + vm.entity.getSelectedRows()[0].wareHouseId + "&creator=" + vm.entity.getSelectedRows()[0].creator + "&check_mode=" + vm.entity.getSelectedRows()[0].check_mode;

    }
    //复盘
    vm.changeOwner = function (index) {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条记录');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能选择一条记录');
            return false;
        }
        if (vm.entity.getSelectedRows()[0].status!= "04") {
            msgAlert.info('盘点单非待复盘状态,无需复盘操作,请检查');
            return false;
        }
        //需要带单据编号、仓库名称、创建人、账存时间
        window.location.href = "#/wms/inventory/stocktaking/breplaystock?code=" + vm.entity.getSelectedRows()[0].code
            + "&warehouseName=" + vm.entity.getSelectedRows()[0].wareHouseName + "&wareHouseId=" + vm.entity.getSelectedRows()[0].wareHouseId + "&creator=" + vm.entity.getSelectedRows()[0].creator + "&check_mode=" + vm.entity.getSelectedRows()[0].check_mode;
    }
    //平账
    vm.platestock = function () {
        //需要带单据编号、仓库名称、账存时间
        if (vm.entity.getSelectedRows()[0].status!= "05") {
            msgAlert.info('盘点单非待平账状态,无需平账操作,请检查');
            return false;
        }
        window.location.href = "#/wms/inventory/stocktaking/platestock?code=" + vm.entity.getSelectedRows()[0].code
            + "&warehouseName=" + vm.entity.getSelectedRows()[0].wareHouseName + "&wareHouseId=" + vm.entity.getSelectedRows()[0].wareHouseId ;
    }
    /***************************************************************获取仓库列表*******************************************************************************/
    vm.warehouseColumn = [
        {
            field: 'ID',
            displayName: 'ID',
            visible: false,
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


    //单据类型匹配
    $scope.matchBillType = function (billType) {
        for (var i = 0; i < vm.billLst.length; i++) {
            if (vm.billLst[i].dataValue == billType) {
                return vm.billLst[i].dataName;
            }
        }
        return billType;
    }
    function initiBill() {
        vm.dictTypeName = '入库单据类型';
        BillManage.getBillTypeList(vm).success(function (data) {
            vm.billTypeList = data.rows;
            vm.billLst = data.rows;
        });
    }
}])


