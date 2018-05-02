/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('comContactsSetController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','commonInfo','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, commonInfo,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.commitComContacts = function(){


            vm.name = $('.divSpace').find('input[name="name"]').val();
            vm.companyName = $('.divSpace').find('input[name="companyName"]').val();
            vm.mobile = $('.divSpace').find('input[name="mobile"]').val();

            if(vm.name=="" ||vm.companyName=="" ||vm.mobile=="" ){

                msgAlert.text('请将常用联系人信息填写完整');
                return false;
            }
            commonInfo.commonContactor(vm).success(function(data) {
                if(data.additionalMsg.status==00){

                    msgAlert.text('新增成功');
                    window.location.href="#/transport/setting/contacts";

                }else if(data.additionalMsg.status==01){
                    msgAlert.text('失败 >﹏< ['+ data.additionalMsg.message+']');

                }
            });


        }

        vm.backComContacts = function(){
            window.location.href="#/transport/setting/contacts"
        }


    }]);