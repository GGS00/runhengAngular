/**
 * 防伪码批量删除
 */
angular.module('MetronicApp').controller('traceabilityDelCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'Traceability','commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, Traceability, commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.delete = function (x) {
        if (x == 1) { //商品
            if($('#id_goods').val() ==""){
                msgAlert.text('请选择商品');
                return false;
            }
            vm.goodsId = vm.goodsEntity.getSelectedRows()[0].skuId;
            vm.Params = {
                goosId: vm.goodsId
            }
        } else if (x == 2) {//批次
            if($('#id_batch').val() ==""){
                msgAlert.text('请选择批次');
                return false;
            }
            vm.lot = vm.batchEntity.getSelectedRows()[0].lot
            vm.Params = {
                lot: vm.lot
            }
        } else if (x == 3) {//经销 商
            if($('#id_deal').val() ==""){
                msgAlert.text('请选择经销商');
                return false;
            }
            vm.distributorId = vm.dealEntity.getSelectedRows()[0].userId;
            vm.Params = {
                distributorId: vm.distributorId
            }
        } else if (x == 4) {//防伪码
            if($('#id_security').val() ==""){
                msgAlert.text('请选择防伪码');
                return false;
            }
            vm.securityCode = vm.securityEntity.getSelectedRows()[0].code
            vm.Params = {
                securityCode: vm.securityCode
            }
        }
        Traceability.delSecurity(vm).success(function (data) {
            if(data.additionalMsg.status=='00'){
                msgAlert.text('删除防伪码成功');
                if(x==1) {
                    vm.getGoodsPage();
                }else if(x==2){
                    vm.getbatchCodePage();
                }else if(x==3){
                    vm.getdealPage();
                }else if(x==4){
                    vm.getSecurityPage();
                }
            }else {
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        })
    }

    /*********************************************************************获取商品表**********************************************************************/
    vm.goodscolumn = [
        {
            field: 'skuId',
            displayName: '商品id',
        },
        {
            field: "title",
            displayName: '商品名称',
        }
    ]
    vm.placeholder_goodsName = '请输入商品名';
    vm.icon_goodsName = 'plus';
    vm.goodsParams = {
        bean: 'goods',
        method: 'pageSku',
        keywords: '',
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
    /*********************************************************************获取批次号**********************************************************************/
    vm.batchcolumn = [
        {
            field: 'lot',
            displayName: '批次号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        }
    ]
    vm.placeholder_batchCode = '请输入批次号';
    vm.icon_batchCode = 'plus';
    vm.batchParams = {
        bean: 'tbmsSecurityCode',
        method: 'page',
        code: '',
        page: 1,
        rows: 10
    }
    vm.getbatchCodePage = function () {
        commonUtil.getList(vm.batchParams).success(function(data) {
            if(data.additionalMsg.status=='00'){
                vm.batch_data = data;
            }else {
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }

        });
    };
    vm.getbatchCodePage();
    /*********************************************************************获取经销商**********************************************************************/
    vm.dealcolumn = [
        {
            field: 'nickName',
            displayName: '经销商名',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        }
    ]
    vm.placeholder_dealer = '请输入经销商';
    vm.icon_dealer = 'plus';
    vm.dealerParams = {
        bean: 'user',
        method: 'pageGetUserList',
        page: 1,
        rows: 10,
        userType: 1
    }
    vm.getdealPage = function () {
        commonUtil.getList(vm.dealerParams).success(function(data) {
            if(data.additionalMsg.status=='00'){
                vm.deal_data = data;
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    };
    vm.getdealPage();
    /*********************************************************************获取防伪码**********************************************************************/
    vm.securitycolumn = [
        {
            field: 'code',
            displayName: '防伪码编码',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "goodsName",
            displayName: '商品名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        },
        {
            field: "supplierName",
            displayName: '供货商名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_securityCode = '请输入防伪码';
    vm.icon_securityCode = 'plus';
    vm.securityParams = {
        bean: 'tbmsSecurityCode',
        method: 'page',
        code: '',
        page: 1,
        rows: 10
    }
    vm.getSecurityPage = function () {
        commonUtil.getList(vm.securityParams).success(function(data) {
            if(data.additionalMsg.status=='00'){
                vm.securitydata = data;
            }else {
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    };
    vm.getSecurityPage();
}]);


