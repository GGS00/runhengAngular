/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('comGoodsSetController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','commonInfo','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, commonInfo,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.commitComGoods = function(){


            vm.name = $('.divSpace').find('input[name="name"]').val();
            vm.unit = $('.divSpace').find('select[name="unit"]').val();

            if(vm.name==""){

                msgAlert.text('请将常用货品名填写完整');
                return false;
            }
            commonInfo.commonGoods(vm).success(function(data) {
                if(data.additionalMsg.status==00){

                    msgAlert.text('新增成功');
                    window.location.href="#/transport/setting/goods";

                }else if(data.additionalMsg.status==01){
                    msgAlert.text('失败 >﹏< ['+ data.additionalMsg.message+']');

                }
            });


        }

        vm.backComGoods = function(){
            window.location.href="#/transport/setting/goods"
        }


    }]);