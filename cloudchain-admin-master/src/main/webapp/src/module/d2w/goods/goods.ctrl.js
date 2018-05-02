angular.module('MetronicApp').controller('goodsourceController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,multicitySelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    $('.modal-backdrop').hide()

    vm.pageParams = {
        bean:'d2WGoods',
        method:'page',
        page:1,
        rows:10
    }

    vm.column = [
        {   field: 'id',
            displayName: '编号',
            width: 180,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        {  field: "status",
            displayName: '当前状态',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.status==0?"待报价":(row.entity.status==1?"待择库":(row.entity.status==2?"完成":""))}}</div>'
        },
        {  field: "title",
            displayName: '标题',
            enableCellEdit: true,
            width:100,
            enableCellEditOnFocus:true
        },
        {  field: "type",
            displayName: '服务类型',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.type==0?"仓储租赁":(row.entity.type==1?"货物保管":"")}}</div>'

        },
        {  field: "provinceName",
            displayName: '仓库所在区域',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}</div>'
        },
        {  field: "warehouseAreaType",
            displayName: '库区类型',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.warehouseAreaType==01?"普通":(row.entity.warehouseAreaType==02?"冷藏":(row.entity.warehouseAreaType==03?"恆溫":(row.entity.warehouseAreaType==04?"特种":(row.entity.warehouseAreaType==05?"气调":""))))}}</div>'
        },
        {  field: "storageTime",
            displayName: '入库时间',
            enableCellEdit: true,
            width:180,
            enableCellEditOnFocus:true
        },
        {  field: "intentPrice",
            displayName: '意向价格(元)',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.intentPrice/100}}</div>'
        }
    ]



    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){

        var id = $('input[name="id"]').val();
        var title = $('input[name="title"]').val();
        var type = $('.type').val();
        var status = $('.status').val();
        var warehouseAreaType = $('.warehouseAreaType').val();
        if(type == " "){
            type ="";
        }
        if(status == " "){
            status ="";
        }
        if(warehouseAreaType == " "){
            warehouseAreaType ="";
        }

        vm.pageParams = {
            bean:'d2WGoods',
            method:'page',
            page:1,
            rows:10,
            id:id,
            title:title,
            type:type,
            status:status,
            provinceId:multicitySelect.getSelect().proId,
            cityId:multicitySelect.getSelect().cityId,
            districtId:multicitySelect.getSelect().areaId,
            warehouseAreaType:warehouseAreaType,
        }
        vm.getPage();
    }

    vm.addgoodsource = function(){
        window.location.href="#/d2w/addgoodsource";
    }

    vm.checkgoodsource = function(){

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择需要查看的货源');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次查看只能选择一条货源');
            return false;
        }else{
            window.location.href="#/d2w/goodsourcedetail?id=" + vm.entity.getSelectedRows()[0].id;
        }
    }

    vm.selectwarehouse = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择货源');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('只能选择一条货源');
            return false;
        }else if(vm.entity.getSelectedRows()[0].status == 2){
            msgAlert.text('状态为完成的货源不可选择仓库');
            return false;
        }else{
            window.location.href="#/d2w/chosewarehouse?id=" + vm.entity.getSelectedRows()[0].id +"&type=" + vm.entity.getSelectedRows()[0].type;
        }
    }





}])