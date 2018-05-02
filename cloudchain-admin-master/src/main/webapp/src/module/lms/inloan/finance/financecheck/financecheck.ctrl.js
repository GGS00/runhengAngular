angular.module('MetronicApp').controller('financeCheckController', function ($rootScope, $scope,$http,$location, uiGridConstants, settings,commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    })
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.showSwitch= 0;
    vm.id =  $location.search().id;
    initial();
    function initial(){
        $http({url:"/LmsInReceiptForLoan/load",
            method: "post",
            params:{
                id:vm.id
            }
        }).success(function(data) {
            vm.objData = data;
        });
    }

    //返回上一页按钮
    vm.return = function () {
        window.history.back(-1);
    }
    vm.approve=function(){
        if ($("input[name='checkStatus2']").val()== "") {
            msgAlert.text('请输入审批结果');
            return false;
        }
        var checkStatus2=$("#checkStatus2 option:selected").val();
        var checkOption2 = $("input[name='checkOption2']").val();
        var checkedAmount = $("input[name='checkedAmount']").val();
        var applyLoanId = $("input[name='applyLoanId']").val();
        var customerId= $("input[name='customerId']").val();
        vm.approveParam={
            checkStatus2:checkStatus2,
            checkOption2:checkOption2,
            checkedAmount:checkedAmount,
            id:vm.id,
            applyLoanId:applyLoanId,
            customerId:customerId
        };
        vm.form = $("#productcheck").serialize();
        vm.form = decodeURIComponent(vm.form,true);
        /*  $.ajax({
         url:"/LmsInReceiptForLoan/productCheck",
         data:vm.form,
         type:"post",
         dataType:"json",
         success:function(data){
         if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
         msgAlert.info('审批成功，现在返回');
         window.location.href = "#/lms/inloan/productcheck";
         }else if(data.additionalMsg.status=='01'){
         msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
         }
         },
         error:function(){
         msgAlert.text('系统繁忙 >﹏<');
         }
         })*/
        $http({
            url:"/LmsInReceiptForLoan/financeCheck",
            method:"post",
            params:vm.approveParam
        }).success(function(data) {
            if(data.additionalMsg.status==00){
                msgAlert.info("审批成功，现在返回");
                window.location.href="#/lms/inloan/finance";
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        }).error(function(){
            msgAlert.text('系统繁忙 >﹏<');
        });
    };

})