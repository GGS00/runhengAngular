angular.module('MetronicApp').controller('ordermanageController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,multicitySelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                vm.getGoodsPage();
                break;
            case 1:
                vm.getPage()
                break;
        }
    }

    vm.pageParams = {
        bean:'d2WOrder',
        method:'page',
        page:1,
        rows:10
    }


    vm.column = [
        { field: 'orderId',
            displayName: '订单编号',
            width: 200,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        {  field: "userName",
            displayName: '对方名称',
            enableCellEdit: true,
            width:120,
            enableCellEditOnFocus:true
        },{ field: 'orderType',
            displayName: '服务类型',
            width: 100,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true,
            cellTemplate:'<div style="padding:5px">{{row.entity.orderType==0?"仓库租赁":(row.entity.orderType==1?"货物保管":"")}}</div>'
        },
        {  field: "provinceName",
            displayName: '仓库所在区域',
            enableCellEdit: true,
            width:400,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>'
        },
        {  field: "warehouseAreaType",
            displayName: '库区类型',
            enableCellEdit: true,
            width:120,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.warehouseAreaType==01?"普通":(row.entity.warehouseAreaType==02?"冷藏":(row.entity.warehouseAreaType==03?"恆溫":(row.entity.warehouseAreaType==04?"特种":(row.entity.warehouseAreaType==05?"气调":""))))}}</div>'
        },{ field: 'price',
            displayName: '单价',
            width: 120,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true,
            cellTemplate:'<div style="padding:5px">{{row.entity.price/100}}</div>'
        },
        {  field: "totalPrice",
            displayName: '成交总额',
            enableCellEdit: true,
            width:130,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.totalPrice/100}}</div>'
        },
        {  field: "createdTime",
            displayName: '成交时间',
            enableCellEdit: true,
            width:170,
            enableCellEditOnFocus:true
        }
    ]

    vm.getPage = function () {
        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };

    vm.goodsPageParams = {
        bean:'d2WOrder',
        method:'pageGoods',
        page:1,
        rows:10
    }


    vm.goodsColumn = [
        { field: 'orderId',
            displayName: '订单编号',
            width: 200,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        {  field: "userName",
            displayName: '对方名称',
            enableCellEdit: true,
            width:120,
            enableCellEditOnFocus:true
        },{ field: 'orderType',
            displayName: '服务类型',
            width: 100,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true,
            cellTemplate:'<div style="padding:5px">{{row.entity.orderType==0?"仓库租赁":(row.entity.orderType==1?"货物保管":"")}}</div>'
        },
        {  field: "provinceName",
            displayName: '仓库所在区域',
            enableCellEdit: true,
            width:400,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>'
        },
        {  field: "warehouseAreaType",
            displayName: '库区类型',
            enableCellEdit: true,
            width:120,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.warehouseAreaType==01?"普通":(row.entity.warehouseAreaType==02?"冷藏":(row.entity.warehouseAreaType==03?"恆溫":(row.entity.warehouseAreaType==04?"特种":(row.entity.warehouseAreaType==05?"气调":""))))}}</div>'
        },{ field: 'price',
            displayName: '单价',
            width: 120,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true,
            cellTemplate:'<div style="padding:5px">{{row.entity.price/100}}</div>'
        },
        {  field: "totalPrice",
            displayName: '成交总额',
            enableCellEdit: true,
            width:130,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.totalPrice/100}}</div>'
        },
        {  field: "createdTime",
            displayName: '成交时间',
            enableCellEdit: true,
            width:170,
            enableCellEditOnFocus:true
        }
    ]

    vm.getGoodsPage = function () {
        commonUtil.getList(vm.goodsPageParams).success(function(data) {
            vm.goodsData = data;
        });
    };
    vm.getGoodsPage();

    vm.getPageByFilter = function(){
        var orderId = $('input[name="orderId"]').val();
        var orderType = $('.orderType').val();
        if(orderType == " "){
            orderType ="";
        }

        var warehouseAreaType = $('.warehouseAreaType').val();
        if(warehouseAreaType == " "){
            warehouseAreaType ="";
        }

        vm.goodsPageParams = {
            bean:'d2WOrder',
            method:'pageGoods',
            page:1,
            rows:10,
            orderId:orderId,
            orderType:orderType,
            warehouseAreaType:warehouseAreaType,
            provinceId:multicitySelect.getSelect().proId,
            cityId:multicitySelect.getSelect().cityId,
            districtId:multicitySelect.getSelect().areaId
        }
        vm.getGoodsPage();
    }

    vm.getWarePageByFilter = function(){
        var wareOrderId = $('input[name="wareOrderId"]').val();
        var wareorderType = $('.wareorderType').val();
        if(wareorderType == " "){
            wareorderType ="";
        }

        var warehouseAreaTypeWare = $('.warehouseAreaTypeWare').val();
        if(warehouseAreaTypeWare == " "){
            warehouseAreaTypeWare ="";
        }

        vm.pageParams = {
            bean:'d2WOrder',
            method:'page',
            page:1,
            rows:10,
            orderId:wareOrderId,
            orderType:wareorderType,
            warehouseAreaType:warehouseAreaTypeWare,
            provinceId:multicitySelect.getSelect().proId,
            cityId:multicitySelect.getSelect().cityId,
            districtId:multicitySelect.getSelect().areaId
        }
        vm.getPage();
    }

}])