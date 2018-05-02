/* Setup TmsController page controller */
angular.module('MetronicApp').controller('purchaseController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    /*vm.page = 1; //默认当前页数
     vm.maxSize = 5; //最大页码
     vm.pageSize = 20; //1页多少个
     vm.pageCount = 92;//总条数*/

    vm.menuLen = 6;

    vm.pageParams = {
        bean:'omsPurchaseOrder',
        method:'pageGetPurchaseOrder',
        page:1,
        rows:10
    }


    vm.column = [
        {   field: "state",
            displayName: '当前状态',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<span class='label label-{{row.entity.state==\"0\"?\"primary\":(row.entity.state==\"1\"?\"success\":(row.entity.state==\"2\"?\"default\":(row.entity.state==\"3\"?\"danger\":\"\")))}}' style='display:block;margin: 5px'>{{row.entity.state=='0'?'待审':(row.entity.state=='1'?'审核通过':(row.entity.state=='2'?'驳回':(row.entity.state=='3'?'已取消':'')))}}</span>"
        },
        {   field: "purchaseId",
            displayName: '采购单编号',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true,
            cellTemplate:'<a ui-sref="order.purchaseOrder.purchasedetail({id:row.entity.purchaseId})" style="display: block;margin: 5px;">{{row.entity.purchaseId}}</a>'
        },
        {   field: "supplierName",
            displayName: '供应商名称',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "arrivalTime",
            displayName: '应到货时间',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {   field: "warehouseName",
            displayName: '仓库名称',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "goodsDeliveryWay",
            displayName: '交割方式',
            enableCellEdit: true,
            width:100,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.goodsDeliveryWay==0?'仓库内货权转移':(row.entity.goodsDeliveryWay==1?'自提':(row.entity.goodsDeliveryWay==2?'供应商送货':''))}}</div>"
        },
        {   field: "settlementWay",
            displayName: '结款方式',
            enableCellEdit: true,
            width:100,
            enableCellEditOnFocus:true,
            cellTemplate:"<div style=\"padding:5px\">{{row.entity.settlementWay==0?'预付':(row.entity.settlementWay==1?'到货结算':'')}}</div>"
        },
        {   field: "operatorName",
            displayName: '发起员',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "createdTime",
            displayName: '发起时间',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        }
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            console.log(data)
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){
        var purchaseId = $('input[name="purchaseId"]').val();
        var supplierName = $('input[name="supplierName"]').val();
        var warehouseName = $('input[name="warehouseName"]').val();
        var state = $('.state').val();
        if(state == " "){
            state ="";
        }
        var arrivalBeginTime = $('.arrivalTime span').html();
        if(arrivalBeginTime == undefined || arrivalBeginTime == "-"){
            arrivalBeginTime ="";
            var arrivalEndTime ="";
        }else{
            arrivalBeginTime = $('.toOrderTime span').html().slice(0,10);
            var arrivalEndTime = $('.toOrderTime span').html().slice(11,21);
        }


        if(purchaseId == "" && supplierName == "" && warehouseName =="" && state == "" && arrivalBeginTime==""){
            msgAlert.text('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            purchaseId:purchaseId,
            supplierName:supplierName,
            warehouseName:warehouseName,
            state:state,
            arrivalBeginTime:arrivalBeginTime,
            arrivalEndTime:arrivalEndTime,
            bean:'omsPurchaseOrder',
            method:'pageGetPurchaseOrder',
            page:1,
            rows:10
        }
        vm.getPage();
    }

    /*审核*/
    vm.examinePurchase = function(){
        vm.selectListExamine = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要审核的采购单');
            return false;

        }else{


            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].state != 0){
                    msgAlert.text('请选择状态为待审的采购单进行审核操作');
                    return false;
                }
                vm.selectListExamine.push(vm.entity.getSelectedRows()[i].purchaseId);
            }
            console.log( vm.selectListExamine.join())
            order.examinePurchase(vm).success(function(data) {

                if(data.status==00){

                    msgAlert.text('审核通过');
                    vm.entity.clearSelectedRows();
                    vm.getPage();

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                    vm.entity.clearSelectedRows();
                }

            });



        }

    }

    vm.toCreatePurchase = function(){

        window.location.href="#/order/purchaseOrder/addpurchase";

    }

    vm.editPurchase = function(){

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改的采购单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条采购单');

        }else if(vm.entity.getSelectedRows()[0].state != 0){

            msgAlert.text('只有状态为待审的采购单允许修改');
            return false;

        }else{
            var storage = window.localStorage;
            storage["purchaseSelect"] = JSON.stringify(vm.entity.getSelectedRows()[0]);
            window.location.href="#/order/purchaseOrder/editpurchase";
        }
    }


    /*删除*/
    vm.removePurchase = function(){
        vm.selectListRemove = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的采购单');
            return false;

        }else{

            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].state != 0){

                    msgAlert.text('只允许删除待审的采购单');
                    return false;

                }
            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListRemove.push(vm.entity.getSelectedRows()[i].purchaseId);
            }
            console.log(vm.selectListRemove)
            order.removePurchase(vm).success(function(data) {
                if(data.status==00){

                    msgAlert.text('删除成功');
                    vm.entity.clearSelectedRows();
                    vm.getPage();

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });



        }

    }

    vm.importOrder = function(){
        $('#confirmExcel').modal('show');
    }

    vm.confirmExcel = function(){
        if ($("#excelFile").val() == "") {
            msgAlert.text('请导入excel文件');
            return false;
        } else {
            var reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
            if (!reg.test($("#excelFile").val())) {//校验不通过
                msgAlert.text('请上传excel格式的文件!');
                return false;
            }
        }

        // loading.show();

        $.ajaxFileUpload({
            url: "/purchase/importData",
            type: 'post',
            fileElementId:'excelFile',
            dataType: 'JSON',
            success: function (data, status) {
                // alert('success');
                // loading.hide();
                vm.mdata = JSON.parse(data);
                console.log(vm.mdata)

            },
            error: function (data, status, e) {
                // alert('failed');
                // loading.hide();
                vm.mdata = JSON.parse(data);
                console.log(vm.mdata)
            },
            finish:function(){
                alert('finished')
            }
        });
    }

    vm.exportOrder = function(state){
        window.open("/purchase/exportData/purchase?state="+state);
    }
}])