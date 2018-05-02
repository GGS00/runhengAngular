/**
 * 防伪码批量导入
 */
angular.module('MetronicApp').controller('traceabilityImportCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'Traceability','commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, Traceability,commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    /*********************************************************************获取商品表**********************************************************************/
    vm.goodscolumn = [
        {
            field: 'skuId',
            displayName: '商品id',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
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
        keywords: '',
        page: 1,
        rows: 10
    }
    vm.getGoodsPage = function () {
        commonUtil.getList(vm.goodsParams).success(function(data) {
            vm.goods_data = data;
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
            vm.deal_data = data;
        });
    };
    vm.getdealPage();

    vm.save = function () {
        if($('#id_goods').val() ==""){
            msgAlert.text('请选择商品');
            return false;
        }
        if($('#id_deal').val() ==""){
            msgAlert.text('请选择经销商');
            return false;
        }

        if ($("#excelFile").val() == "") {
            msgAlert.text('请导入exel文件');
            return false;
        } else {
            if ($("#excelFile").val() != '') {
                var reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
                if (!reg.test($("#excelFile").val())) {//校验不通过
                    alert($("#excelFile").val() + "不是excel文件，请上传excel格式的文件!");
                    return;
                }
            }
        }
        vm.goodsId = vm.goodsEntity.getSelectedRows()[0].skuId;
        vm.goodsName = decodeURIComponent(vm.goodsEntity.getSelectedRows()[0].title,true);
        vm.distributorId = vm.dealEntity.getSelectedRows()[0].userId;
        vm.distributorName = decodeURIComponent( vm.dealEntity.getSelectedRows()[0].userName,true);
        $.ajaxFileUpload({
            url: "/securityCode/importSecurityCode",
            type: 'post',
            fileElementId:'excelFile',
            data: { goodsId:vm.goodsId ,goodsName: vm.goodsName , distributorId: vm.distributorId, distributorName:  vm.distributorName},//一同上传的数据
            dataType: 'JSON',
            success: function (data, status) {
                vm.mdata = JSON.parse(data);

                    if( vm.mdata.additionalMsg.status=='00'){
                        msgAlert.text('导入成功 '+ vm.mdata.additionalMsg.successCount+'条防伪码');
                        vm.getGoodsPage();
                        vm.getdealPage();
                    }else{
                        msgAlert.text('系统繁忙 >﹏< ['+  vm.mdata.additionalMsg.message+']');
                    }

            },
            error: function (data, status, e) {
                vm.mdata = JSON.parse(data);

                    if( vm.mdata.additionalMsg.status=='00'){
                        msgAlert.text('导入成功 >﹏< ');
                    }else {
                        msgAlert.text('系统繁忙 >﹏< ['+   vm.mdata.additionalMsg.message+']');
                    }
            }
        });


    }
    vm.download = function() {
        window.location.href="/templetFile/traceabilityImportFile.xls";
    }

    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }

}]);


