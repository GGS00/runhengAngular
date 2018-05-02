/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('billTypeSetController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','billType','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, billType,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.commitBillType = function(){

            vm.code = $('input[name="code"]').val();
            vm.name = $('input[name="name"]').val();

            var codeReg = /^[a-zA-Z0-9_\s]*$/;

            if(vm.code == "" || vm.name == ""){
                msgAlert.text('请将单据信息填写完整');
                return false;
            }

            if(vm.code.match(codeReg) == null){
                msgAlert.text('单据码只能为数字、字母、下划线');
                return false;
            }

            billType.commitBillType(vm).success(function(data) {
                if(data.additionalMsg.status==00){

                    msgAlert.text('新增成功');
                    window.location.href="#/transport/setting/billtype";

                }else if(data.additionalMsg.status==01){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

                }
            });


        }

        vm.backBillType = function(){
            window.location.href="#/transport/setting/billtype"
        }


    }]);