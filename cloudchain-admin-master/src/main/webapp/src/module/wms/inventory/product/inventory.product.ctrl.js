/**
 * 商品库存控制器
 */
angular.module('MetronicApp').controller('inventoryProductController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','Table','linkageSelect', function($rootScope, $scope,$http,uiGridConstants, settings, BillManage,commonUtil,Table,linkageSelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.menuLen = 4;
    vm.pageParams = {
        bean:'wmsInventory',
        method:'pageProductInvent',
        page:1,
        rows:10
    }
    vm.column = [
        {   name:'操作',
            cellTemplate:'<button class ="btn yellow" ng-click="grid.appScope.$parent.seeProductDetail(row.entity)">查看</button>'
        },
        {  field: "ownerId",
            displayName: '货主ID',
            visible: false,
        },
        {  field: "ownerName",
            displayName: '货主',
        },
        {   field: "wareHouseName",
            displayName: '仓库',
        },
        {   field: "skuId",
            displayName: '商品编号',
            visible: false,
        },
        {   field: "skuName",
            displayName: '商品名称',
        },
        {   field: "cateName",
            displayName: '商品分类',
        },
        {   field: "spuUnit",
            displayName: '计量单位',
        },
        {   field: "inventoryStatus",
            displayName: '是否良品',
            width: '8%',
            cellTemplate:'<div style="padding:5px">{{row.entity.inventoryStatus=="GOOD"?"良品":(row.entity.inventoryStatus=="BAD"?"不良品":row.entity.inventoryStatus)}}</div>'
        },
        {   field: "inventory",
            displayName: '库存数量',
        },
        {   field: "freezeInventory",
            displayName: '冻结数量',
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
    }
    vm.getPage();
    //搜索
    vm.getPageByFilter = function(){
        if($('input[name="ownerId"]').val() != null){
            vm.ownerId = $('input[name="ownerId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if($('input[name="wareHouseId"]').val() != null){
            vm.wareHouseId = $('input[name="wareHouseId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        if($('input[name="productId"]').val() != null){
            vm.productId = $('input[name="productId"]').val().replace(/(^\s*)|(\s*$)/g, "");
        }
        vm.pageParams = {
            ownerId:vm.ownerId,
            wareHouseId:vm.wareHouseId,
            productId:vm.productId,
            bean:'wmsInventory',
            method:'pageProductInvent',
            page:1,
            rows:10
        }
        vm.getPage();
    }
    
    //查看库存明细
    $scope.seeProductDetail = function (row) {
        vm.ownerId = row.ownerId;
        vm.ownerName = row.ownerName;
        vm.productId = row.skuId;
        vm.productName = row.skuName;
        vm.wareHouseId = row.wareHouseId;
        vm.wareHouseName = row.wareHouseName;
        vm.inventory = row.inventory;
        window.location.href = "#/wms/inventory/productetail?ownerId="+vm.ownerId+"&ownerName="+vm.ownerName+"&inventory="+vm.inventory+
                                "&productId="+vm.productId+"&productName="+vm.productName+"&wareHouseId="+vm.wareHouseId+"&wareHouseName="+vm.wareHouseName;
    }

}])


