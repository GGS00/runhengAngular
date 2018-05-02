/**
 * 防伪码增加单条
 */
angular.module('MetronicApp').controller('traceabilityAddCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'Traceability','commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, Traceability, commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    /*********************************************************************获取商品表**********************************************************************/
    vm.column = [
        {
            field: 'skuId',
            displayName: '商品id',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            visible:false ,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "title",
            displayName: '商品名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]

    vm.placeholder_goodsName = '请输入商品名';
    vm.icon_goodsName = 'plus';
    vm.goodsParams = {
        bean: 'goods',
        method: 'pageSku',
        page: 1,
        rows: 10
    }
    vm.getGoodsPage = function () {
        commonUtil.getList(vm.goodsParams).success(function(data) {
            if(data.additionalMsg.status=='00'){
                vm.goods_data = data;
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        });

    };
    vm.getGoodsPage();

    /*********************************************************************获取经销商**********************************************************************/
    vm.dealcolumn = [
        {   field: 'nickName',
            displayName: '经销商名',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        }
    ]
    vm.placeholder_dealer = '请输入经销商';
    vm.icon_dealer = 'plus';

    vm.dealParams = {
        bean: 'user',
        method: 'pageGetUserList',
        page: 1,
        rows: 10,
        userType:1
    }
    vm.getdealPage = function () {
        commonUtil.getList(vm.dealParams).success(function(data) {
            if(data.additionalMsg.status=='00'){
                vm.deal_data = data;
            }else {
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    };
    vm.getdealPage();
    /*****************************************************保存操作*****************************************************************/
    vm.code = '';//防伪码code
    vm.goodsId = '';//商品id
    vm.goodsName = ""//商品名;
    vm.distributorId = 121231;//经销商id  userId
    vm.distributorName = "dawerwefa";//经销商name userName
    vm.save = function () {
        // console.log(vm.goodsEntity.getSelectedRows()[0])
        // console.log(vm.dealEntity.getSelectedRows()[0].nickName)
        if($('#mCode').val() ==""){
            msgAlert.text('请填写防伪码');
            return false;
        }
        if($('#id_goods').val() ==""){
            msgAlert.text('请选择商品');
            return false;
        }
        if($('#id_deal').val() ==""){
            msgAlert.text('请选择经销商');
            return false;
        }
        vm.code = $("#mCode").val();
        vm.goodsId = vm.goodsEntity.getSelectedRows()[0].skuId;
        vm.goodsName = decodeURIComponent(vm.goodsEntity.getSelectedRows()[0].title,true);
        vm.distributorId = vm.dealEntity.getSelectedRows()[0].userId;
        vm.distributorName = decodeURIComponent( vm.dealEntity.getSelectedRows()[0].userName,true);
        Traceability.getSaveSingle(vm).success(function (data) {

            if(data.additionalMsg.status=='00'){
                msgAlert.text('添加单条防伪码成功');
                window.location.href="#/traceability/query";
            }else {
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        })
    }
}]);


