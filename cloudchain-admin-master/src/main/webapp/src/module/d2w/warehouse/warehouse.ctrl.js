angular.module('MetronicApp').controller('warehouseController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,multicitySelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.pageParams = {
        bean:'d2WWareHouse',
        method:'page',
        page:1,
        rows:10
    }


    vm.column = [
        {   field: 'id',
            displayName: '编号',
            width: 150,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        {  field: "status",
            displayName: '当前状态',
            enableCellEdit: true,
            width:100,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.status==0?"上架":(row.entity.status==1?"下架":"")}}</div>'
        },
        {  field: "warehouseName",
            displayName: '仓库名称',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "warehouseAreaName",
            displayName: '库区',
            enableCellEdit: true,
            width:100,
            enableCellEditOnFocus:true
        },
        {  field: "receiptType",
            displayName: '仓库地址',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>'
        },
        {  field: "warehouseAreaType",
            displayName: '库区类型',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.warehouseAreaType==01?"普通":(row.entity.warehouseAreaType==02?"冷藏":(row.entity.warehouseAreaType==03?"恆溫":(row.entity.warehouseAreaType==04?"特种":(row.entity.warehouseAreaType==05?"气调":""))))}}</div>'
        },
        {  field: "warehouseAreaStore",
            displayName: '存放物品',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "storageSqm",
            displayName: '可用库容',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.storageSqm}}m<sup>2</sup>  {{row.entity.storageCum}}m<sup>3</sup></div>'
        },
        {  field: "rentPrice",
            displayName: '租赁价格',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.rentPrice==0?"面议":row.entity.rentPrice/100}}</div>'
        },
        {  field: "keepPrice",
            displayName: '保管价格',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.keepPrice==0?"面议":row.entity.keepPrice/100}}</div>'
        },
        {  field: "showService",
            displayName: '增值服务',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
        }
    ]



    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){
        console.log(multicitySelect.getSelect())
        var warehouseName = $('input[name="warehouseName"]').val();
        var status = $('.status').val();
        var storeMent = $('.storeMent').val();
        if(status == " "){
            status ="";
        }
        if(storeMent == " "){
            storeMent ="";
        }

        vm.pageParams = {
            bean:'d2WWareHouse',
            method:'page',
            page:1,
            rows:10,
            provinceId:multicitySelect.getSelect().proId,
            cityId:multicitySelect.getSelect().cityId,
            districtId:multicitySelect.getSelect().areaId,
            warehouseName:warehouseName,
            storeMent:storeMent,
            status:status
        }
        vm.getPage();
    }

    vm.addWsource = function(){
        window.location.href="#/d2w/addwsource";
    }

    vm.editWsource = function(){
        vm.selectDispatch = [];
        vm.truckLoadType = $('.truckLoadType').val();
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择需要编辑的库源');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次编辑只能选择一条库源');
            return false;
        }else{
            var storage = window.localStorage;
            storage["wsourceSelect"] = JSON.stringify(vm.entity.getSelectedRows());
            window.location.href="#/d2w/updatewsource";

        }
    }

    /*上架*/
    vm.onsale = function(){
        vm.doShelveList = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要上架的库源');
            return false;

        }else{

            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status != 1){

                    msgAlert.text('存在已上架的库源');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.doShelveList.push(vm.entity.getSelectedRows()[i].id);
            }
            d2w.doShelve(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.text('上架成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                    vm.entity.clearSelectedRows();
                }
            });
        }

    }

    /*下架*/
    vm.offsale = function(){
        vm.cancelShelveList = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要下架的库源');
            return false;

        }else{

            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status != 0){

                    msgAlert.text('存在已下架的库源');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.cancelShelveList.push(vm.entity.getSelectedRows()[i].id);
            }
            d2w.cancelShelve(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.text('下架成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                    vm.entity.clearSelectedRows();
                }
            });
        }

    }

}])