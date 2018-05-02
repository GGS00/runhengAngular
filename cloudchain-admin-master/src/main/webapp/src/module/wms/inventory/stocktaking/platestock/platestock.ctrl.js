/**
 * 盘点分配控制器
 */
angular.module('MetronicApp').controller('platestockCtrl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','Table','linkageSelect','$location', function($rootScope, $scope,$http,uiGridConstants, settings, BillManage,commonUtil,Table,linkageSelect,$location) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.stockCode = $location.search().code;
    vm.warehouseName = $location.search().warehouseName;


    $("#id_code").val(vm.stockCode);
    $("#id_warehouseName").val(vm.warehouseName);
    $("#id_accountTime").val("");

    vm.column = [
        {  field: "line_no",
            displayName: '序号',
            width: '8%',
        },
        {  field: "product_id",
            displayName: '商品sku编号',
            width: '15%',
        },
        {   field: "product_name",
            displayName: '商品名称',
            width: '8%'
        },
        {
            field: "cateName",
            displayName: '分类',
            width: '8%',
        },
        {
            field: "spuUnit",
            displayName: '单位',
            width: '8%',
        },
        {   field: "inventory_status",
            displayName: '是否良品',
            width: '8%',
            cellTemplate: '<div style="padding:5px">{{row.entity.inventory_status=="GOOD"?"良品":(row.entity.inventory_status=="BAD"?"不良品":row.entity.inventory_status)}}</div>'
        },
        {
            field: "owner_name",
            displayName: '货主',
            width: '8%',
        },
        {
            field: "supplier_name",
            displayName: '供应商',
            width: '8%',
        },
        {   field: "locationName",
            displayName: '所在库位',
            width: '10%',
        },
        {   field: "amount_quantity",
            displayName: '账存数量',
            width: '10%',
        },
        {   field: "primary_quantity",
            displayName: '初盘数量',
            width: '10%',
        },
        {   name: "初盘差异数",
            displayName: '初盘差异数',
            width: '10%',
            cellTemplate: '<div style="padding:5px;" ><span ng-if="grid.appScope.$parent.platestock.a[row.entity.index]>0" style="color:green">{{grid.appScope.$parent.platestock.a[row.entity.index]}}</span>' +
            '<span ng-if="grid.appScope.$parent.platestock.a[row.entity.index]<0" style="color:red">{{grid.appScope.$parent.platestock.a[row.entity.index]}}</span></div>' +
            '<span ng-if="grid.appScope.$parent.platestock.a[row.entity.index]==0" style="color:green">{{grid.appScope.$parent.platestock.a[row.entity.index]}}</span></div>'
        },
        {   field: "replay_quantity",
            displayName: '复盘数量',
            width: '10%',
        },
        {   name: "复盘差异数",
            displayName: '复盘差异数',
            width: '10%',
            cellTemplate: '<div style="padding:5px;" ><span ng-if="grid.appScope.$parent.platestock.b[row.entity.index]>0" style="color:green">{{grid.appScope.$parent.platestock.b[row.entity.index]}}</span>' +
            '<span ng-if="grid.appScope.$parent.platestock.b[row.entity.index]<0" style="color:red">{{grid.appScope.$parent.platestock.b[row.entity.index]}}</span></div>' +
            '<span ng-if="grid.appScope.$parent.platestock.b[row.entity.index]==0" style="color:green">{{grid.appScope.$parent.platestock.b[row.entity.index]}}</span></div>'
        }
    ]
    vm.aaa =function (preValue,index,value) {
        vm.a[index] =value-preValue;
    }
    vm.bbb =function (preValue,index,value) {
        vm.b[index] =value-preValue;
    }
    vm.pageParams = {
        bean: 'wmsStockTake',
        method: 'pageQryStockTakeItem',
        stocktakeCode: vm.stockCode,
        status:"05",
        page: 1,
        rows: 10
    }
    vm.getPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params:vm.pageParams
        }).success(function(data) {
            if (data.additionalMsg.status == '00') {
                vm.a = new Array();
                vm.b = new Array();
            for(var i =0;i < data.rows.length;i++) {
                data.rows[i].index = i;

                vm.aaa(data.rows[i].amount_quantity,i,data.rows[i]. primary_quantity);
                vm.bbb(data.rows[i].amount_quantity,i,data.rows[i]. replay_quantity);

            }
            vm.data = data;
            } else  {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    };
    vm.getPage();

    vm.platestockSure = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请至少选择一条记录');
            return false;
        }
        vm.stockTakeItemIds = "";
        for(var i=0;i<vm.entity.getSelectedRows().length;i++){
                vm.stockTakeItemIds+= vm.entity.getSelectedRows()[i].stocktakeItemId+",";
        }
        if (  vm.stockTakeItemIds.charAt( vm.stockTakeItemIds.length-1)== ",") {
            vm.stockTakeItemIds= vm.stockTakeItemIds.substring(0, vm.stockTakeItemIds.length-1);
        }
        vm.params ={
            stockTakeItemIds:vm.stockTakeItemIds,
        }
        BillManage.dealCheckDiff(vm).success(function(data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.info('平账成功');
                vm.getPage();
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }

        });
    }

    vm.back = function () {
        window.location.href="#/wms/inventory/stocktaking";
    }
}])


