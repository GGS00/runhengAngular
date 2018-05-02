/**
 * 防伪码批量更新
 */
 angular.module('MetronicApp')
        .controller('traceabilityUpdateCtrl', ['$rootScope', '$scope', '$http','uiGridConstants','settings','Traceability','commonUtil','Table',  function($rootScope, $scope,$http,uiGridConstants, settings, Traceability,commonUtil,Table) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.menuSize = 6;
        vm.contactOrAddress = 1;
        vm.resp = ""; //返回结果集
        vm.codeTotal= 0;
        vm.flag_Save =0;
        vm.securityCode = "";
        vm.lot = "";
        vm.goosId = "dfafdsfa";
        vm.showLocation =function (x) {
            if(x==1){//防伪码
                if($('#id_security').val() ==""){
                    msgAlert.text('请选择防伪码');
                    return false;
                }
                vm.securityCode= vm.securityEntity.getSelectedRows()[0].code;
                vm.Params = {
                    securityCode:vm.securityCode
                }
                Traceability.updateSecurity(vm).success(function(data){
                    if(data.additionalMsg.status=="00"){
                        vm.codeTotal = data.additionalMsg.codeTotal;
                        vm.flag_Save = 1;
                        window.location.href="#/traceability/updateConfirm?flag_Save="+vm.flag_Save+"&securityCode="+vm.securityCode+"&codeTotal="+ vm.codeTotal;
                    }else {
                            msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                        }
                });
            }else if(x==2){//批次
                if($('#id_batch').val() ==""){
                    msgAlert.text('请选择批次');
                    return false;
                }
                vm.lot =vm.batchEntity.getSelectedRows()[0].lot;
                vm.Params = {
                    lot: vm.lot
                }
                Traceability.updateSecurity(vm).success(function(data){
                    vm.resp =  data.additionalMsg;
                    if(data.additionalMsg.status=="00"){
                        vm.codeTotal = data.additionalMsg.codeTotal;
                        vm.flag_Save = 2;
                        window.location.href="#/traceability/updateConfirm?flag_Save="+vm.flag_Save+"&lot="+vm.lot+"&codeTotal="+ vm.codeTotal;
                    }else {
                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    }
                });
            }else if(x==3){//商品名
                if($('#id_goods').val() ==""){
                    msgAlert.text('请选择商品');
                    return false;
                }
                vm.goodsId = vm.goodsEntity.getSelectedRows()[0].skuId;
                vm.Params = {
                    goosId: vm.goodsId
                }
                Traceability.updateSecurity(vm).success(function(data){
                    if(data.additionalMsg.status=="00"){
                        vm.codeTotal =data.additionalMsg.codeTotal;
                        vm.flag_Save = 3;
                        window.location.href="#/traceability/updateConfirm?flag_Save="+vm.flag_Save+"&goosId="+vm.goodsId+"&codeTotal="+ vm.codeTotal;
                    }else {
                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    }
                });
            }
        }
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
                method: 'pageLot',
                code: '',
                page: 1,
                rows: 10
            }
            vm.getbatchCodePage = function () {

                commonUtil.getList(vm.batchParams).success(function(data) {

                    if(data.additionalMsg.status=='00'){
                        vm.batch_data = data;
                    }else{
                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    }
                });
            };
            vm.getbatchCodePage();
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

                    if(data.additionalMsg.status=='00'){
                        vm.goodsdata = data;
                    }else {
                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    }
                });

            };

            vm.getGoodsPage();
    }])
    .controller('traceabilityUpdateConfirmCtrl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','Traceability','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, Traceability,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.resp = ""; //返回结果集
    vm.save = function() {

        if($('#id_goods').val() ==""){
            msgAlert.text('请选择商品');
            return false;
        }
        if($('#id_deal').val() ==""){
            msgAlert.text('请选择经销商');
            return false;
        }
        vm.flag_Save  = getvalue('flag_Save');
        vm.goodsId = vm.goodsEntity.getSelectedRows()[0].skuId;
        vm.goodsName =decodeURIComponent(vm.goodsEntity.getSelectedRows()[0].title,true);
        vm.distributorId = vm.dealEntity.getSelectedRows()[0].userId;
        vm.distributorName = decodeURIComponent( vm.dealEntity.getSelectedRows()[0].userName,true);
        if( vm.flag_Save==1){//确认修改防伪码
            vm.SureParams = {
                securityCode:getvalue("securityCode"),
                toGoodsId: vm.goodsId,
                toGoodsName: vm.goodsName,
                distributorId: vm.distributorId ,
                distributorName:vm.distributorName
            }
            Traceability.updateSureSecurity(vm).success(function(data){
                if(data.additionalMsg.status=="00"){
                    msgAlert.text( '修改防伪码成功');
                    window.location.href="#/traceability/update";
                }else {
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            });
        }else if( vm.flag_Save==2){//确认修改批次号

            vm.SureParams = {
                lot:getvalue("lot"),
                toGoodsId: vm.goodsId,
                toGoodsName: vm.goodsName,
                distributorId: vm.distributorId ,
                distributorName:vm.distributorName
            }
            Traceability.updateSureSecurity(vm).success(function(data){
                if(data.additionalMsg.status=="00") {
                    msgAlert.text( '修改防伪码成功');
                    window.location.href = "#/traceability/update";
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            });
        }else if( vm.flag_Save==3){//确认修改商品

            vm.SureParams = {
                goosId:getvalue("goosId"),
                toGoodsId: vm.goodsId,
                toGoodsName: vm.goodsName,
                distributorId: vm.distributorId ,
                distributorName:vm.distributorName
            }
            Traceability.updateSureSecurity(vm).success(function(data){
                if(data.additionalMsg.status=="00") {
                    msgAlert.text( '修改防伪码成功');
                    window.location.href = "#/traceability/update";
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            });
        }
    }

     //取消按钮
     vm.toTmsOrder = function () {
         window.history.back(-1);
      }

    function getvalue(paras){
        var url = location.href;
        var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
        var paraObj = {}
        for (i=0; j=paraString[i]; i++){
            paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if(typeof(returnValue)=="undefined"){

            return "";
        }else{
            return returnValue;
        }
    }


    if(getvalue('codeTotal')==""){
        vm.mCodeTotal=0;
    }else {
        vm.mCodeTotal  = getvalue('codeTotal');
    }
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
            if(data.additionalMsg.status=='00'){
                vm.goodsdata = data;
            }else {
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
}]);
