angular.module('MetronicApp').controller('approveOutboundController', function ($rootScope, $scope,$http,$location, uiGridConstants, settings,commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    })
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.showSwitch= 0;
    vm.outboundId =  $location.search().id;
    initial();
    function initial(){
        $http({url:"/LmsOutbound/load",
            method: "post",
            params:{
                id:vm.outboundId
            }
        }).success(function(data) {
            if(data.status==00){
                vm.getPage();
                vm.objData = data.obj;
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    }


    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'aAfterOutboundDetail',
        method: 'page',
        page: 1,
        rows: 10,
        outboundId:vm.outboundId
    }
    vm.column = [
        {
            field: "id",
            displayName: 'id',
            visible: false,
            enableColumnMenu: false// 是否显示列头部菜单按钮
        },
        {
            field: "goods_code",
            displayName: '商品编码'
        },
        {
            field: "goods_name",
            displayName: '商品名称'
        },
        {
            field: "ru_price",
            displayName: '入库金额'
        },
        {
            field: "price",
            displayName: '出库单价'
        },
        {
            field: "available_stock",
            displayName: '可用库存数量'
        },
        {
            field: "storage_cost",
            displayName: '仓储费'
        },
        {
            field: "ru_time",
            displayName: '入库日期'
        },
        {
            field: "apply_num",
            displayName: '申请数量'
        }
    ]

    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function (data) {

            if ( data.additionalMsg.status == '00') {
                vm.data = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };
    //返回上一页按钮
    vm.return = function () {
        window.history.back(-1);
    }
    vm.approve=function(){
        if ($("input[name='checkStatus']").val()== "") {
            msgAlert.text('请输入审批结果');
            return false;
        }
        var checkStatus=$("#checkStatus option:selected").val();
        var checkOpinion = $("input[name='checkOpinion']").val();
        //var payAmount = $("input[name='payAmount']").val();
        var storageCost = $("input[name='storageCost']").val();
        var bankName = $("input[name='bankName']").val();
        var accountName = $("input[name='accountName']").val();
        var bankAccount = $("input[name='bankAccount']").val();
        var customerId = $("input[name='customerId']").val();
        var customerName = $("input[name='customerName']").val();
        var arrivalBankId = $("input[name='arrivalBankId']").val();
        var payTime = $('.payTime span').html();
        vm.approveParam={
            checkStatus:checkStatus,
            checkOpinion:checkOpinion,
            //payAmount:payAmount,
            storageCost:storageCost,
            bankName:bankName,
            accountName:accountName,
            bankAccount:bankAccount,
            customerId:customerId,
            customerName:customerName,
            arrivalBankId:arrivalBankId,
            time:payTime,
            id:vm.outboundId
        };
        $http({
            url:"/LmsOutbound/approve",
            method:"post",
            params:vm.approveParam
        }).success(function(data) {
            if(data.additionalMsg.status==00){
                msgAlert.info("审批成功，现在返回");
                window.location.href="#/lms/afterloan/outbound";
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        }).error(function(){
            msgAlert.text('系统繁忙 >﹏<');
        });
    };

})