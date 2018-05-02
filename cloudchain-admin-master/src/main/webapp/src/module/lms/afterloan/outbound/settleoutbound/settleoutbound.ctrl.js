angular.module('MetronicApp').controller('settleOutboundController', function ($rootScope, $scope,$http,$location, uiGridConstants, settings,commonUtil, Table) {
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
                vm.objData = data.obj;
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    }
    //获取应还利息
    vm.getInterest = function(){
        var customerId = $("input[name='customerId']").val();
        var payTime = $('.payTime span').html();
        var payAmount = $("input[name='payAmount']").val();
        vm.param={
            customerId:customerId,
            time:payTime,
            payAmount:payAmount
        };
        if(payAmount!=="" && payAmount!==null && payTime!==null && payTime!==""){
            $http({
                url:"/LmsOutbound/getInterest",
                method:"post",
                params:vm.param
            }).success(function(data) {
                vm.toRepayInterest=data.obj;
            }).error(function(){
                msgAlert.text('系统繁忙 >﹏<');
            });
        }
    };
    //返回上一页按钮
    vm.return = function () {
        window.history.back(-1);
    }
    //结算
    vm.confirmSettlement=function(){
        var payAmount = $("input[name='payAmount']").val();
        var bankName = $("input[name='bankName']").val();
        var accountName = $("input[name='accountName']").val();
        var bankAccount = $("input[name='bankAccount']").val();
        var customerId = $("input[name='customerId']").val();
        var customerName = $("input[name='customerName']").val();
        var orderAmount = $("input[name='orderAmount']").val();
        var toRepayInterest = $("input[name='toRepayInterest']").val();
        /*var arrivalBankId = $("input[name='arrivalBankId']").val();*/
        var payTime = $('.payTime span').html();
        if(toRepayInterest == ""){
            toRepayInterest ="0";
        }
        vm.approveParam={
            payAmount:payAmount,
            bankName:bankName,
            accountName:accountName,
            bankAccount:bankAccount,
            customerId:customerId,
            customerName:customerName,
            orderAmount:orderAmount,
            /* arrivalBankId:arrivalBankId,*/
            time:payTime,
            toRepayInterest:toRepayInterest,
            id:vm.outboundId
        };
        $http({
            url:"/LmsOutbound/doSettlement",
            method:"post",
            params:vm.approveParam
        }).success(function(data) {
            if(data.additionalMsg.status==00){
                msgAlert.info("结算成功，现在返回");
                window.location.href="#/lms/afterloan/outbound";
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        }).error(function(){
            msgAlert.text('系统繁忙 >﹏<');
        });
    };

})