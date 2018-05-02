angular.module('MetronicApp').controller('neworderexamineController', ['$rootScope', '$scope','$location','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', function($rootScope, $scope, $location,$http, uiGridConstants,settings, order,commonUtil,citySelect)  {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.orderId =  $location.search().id;
        vm.action = $location.search().action;

        order.getSaleOrderDetail(vm).success(function(data) {
           console.log(data)
            if(data.status==00){
               vm.repData = data.obj;

            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }

        });

    vm.toNewOrder = function(){
        window.location.href = "#/order/salesOrder/neworder";
    }

    vm.examineState = 0;
    vm.examine = function(){
        if(vm.examineState==1){
            vm.examineRemark =  $('textarea[name="examineRemark"]').val();
            if(vm.examineRemark == ''){
                msgAlert.text('请填写备注');
                return false;
            }
            order.examineRefuse(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.text('审核不通过 成功');
                    window.location.href = "#/order/salesOrder/neworder";
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });
        }else if(vm.examineState==0){
            order.examineAgree(vm).success(function(data) {
                if(data.status==00){
                    $('#confirmExamine').modal('hide');
                    msgAlert.text('审核通过 成功');
                    window.location.href = "#/order/salesOrder/neworder";
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }

            });
        }
    }



    }])