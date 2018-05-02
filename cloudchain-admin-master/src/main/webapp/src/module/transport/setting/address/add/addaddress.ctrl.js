/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('comAddressSetController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','commonInfo','commonUtil','Table','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, commonInfo,commonUtil,Table,citySelect) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.commitComAddress = function(){
            vm.provinceId = citySelect.getSelect().proId;
            vm.cityId = citySelect.getSelect().cityId;
            vm.districtId = citySelect.getSelect().areaId;
            vm.provinceName = $('.commonAddress').find('.selectPro :selected').html();
            vm.cityName = $('.commonAddress').find('.selectCity :selected').html();
            vm.districtName = $('.commonAddress').find('.selectArea :selected').html();
            vm.address = $('.divSpace').find('input[name="address"]').val();

            if(vm.address==""){
                msgAlert.text('请将详细地址填写完整');
                return false;
            }
            commonInfo.commonAddress(vm).success(function(data) {
                if(data.additionalMsg.status==00){

                    msgAlert.text('新增成功');
                    window.location.href="#/transport/setting/address";

                }else if(data.additionalMsg.status==01){
                    msgAlert.text('失败 >﹏< ['+ data.additionalMsg.message+']');

                }
            });


        }

        vm.backComAddress = function(){
            window.location.href="#/transport/setting/address"
        }


    }]);