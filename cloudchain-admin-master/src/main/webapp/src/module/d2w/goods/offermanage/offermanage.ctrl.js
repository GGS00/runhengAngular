angular.module('MetronicApp').controller('offermanageController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','d2w','commonUtil','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,settings, d2w,commonUtil,multicitySelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.pageParams = {
        bean:'d2WGoods',
        method:'pageOffer',
        page:1,
        rows:10
    }


    vm.column = [
        { field: 'id',
            displayName: '报价单编号',
            width: 200,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        {  field: "status",
            displayName: '当前状态',
            enableCellEdit: true,
            width:120,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.status==0?"待选择":(row.entity.status==1?"已选择":(row.entity.status==2?"取消":""))}}</div>'
        },
        {  field: "goodsId",
            displayName: '货源编号',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        { field: 'userName',
            displayName: '货主',
            width: 120,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        { field: 'userAccount',
            displayName: '账号',
            width: 120,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        { field: 'userMobile',
            displayName: '手机号',
            width: 120,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        { field: 'userEmail',
            displayName: '邮箱',
            width: 180,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        {  field: "type",
            displayName: '服务类型',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.type==0?"仓库租赁":(row.entity.type==1?"货物保管":"")}}</div>'
        },
        {  field: "provinceName",
            displayName: '仓库所在区域',
            enableCellEdit: true,
            width:350,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}</div>'
        },{ field: 'warehouseAreaType',
            displayName: '库区类型',
            width: 120,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true,
            cellTemplate:'<div style="padding:5px">{{row.entity.warehouseAreaType==01?"普通":(row.entity.warehouseAreaType==02?"冷藏":(row.entity.warehouseAreaType==03?"恆溫":(row.entity.warehouseAreaType==04?"特种":(row.entity.warehouseAreaType==05?"气调":""))))}}</div>'
        },
        {  field: "price",
            displayName: '报价(元)',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.price/100}}</div>'
        },
        {  field: "createdTime",
            displayName: '报价时间',
            enableCellEdit: true,
            width:180,
            enableCellEditOnFocus:true
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
        var ownerInfo = $('input[name="ownerInfo"]').val();
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
            method:'pageOffer',
            page:1,
            rows:10,
            goodsId:id,
            user:ownerInfo,
            type:type,
            status:status,
            provinceId:multicitySelect.getSelect().proId,
            cityId:multicitySelect.getSelect().cityId,
            districtId:multicitySelect.getSelect().areaId,
            warehouseAreaType:warehouseAreaType,
        }
        vm.getPage();
    }

    vm.cancelOffer = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择报价单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('只能选择一条报价单');
            return false;
        }else if(vm.entity.getSelectedRows()[0].status == 1){
            msgAlert.text('状态为已选择的报价单不可取消');
            return false;
        }else{
            vm.id = vm.entity.getSelectedRows()[0].id;
            d2w.cancelOffer(vm).success(function(data) {
                if(data.status == 00){
                    msgAlert.text('取消成功');
                    vm.getPage();
                }else{
                    msgAlert.text('取消失败' +data.msg);
                    return false;
                }
            });
        }
    }

}])