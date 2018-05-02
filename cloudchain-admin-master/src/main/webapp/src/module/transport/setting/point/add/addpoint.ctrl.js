angular.module('MetronicApp').controller('pointSetController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','pointSet','commonUtil','Table','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, pointSet,commonUtil,Table,citySelect) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.commitPoint = function(){
            vm.name = $('input[name="pointName"]').val();
            vm.controller = $('input[name="chargeName"]').val();
            vm.tel = $('input[name="mobile"]').val();
            vm.address = $('input[name="address"]').val();
            vm.provinceId = citySelect.getSelect().proId;
            vm.cityId = citySelect.getSelect().cityId;
            vm.districtId = citySelect.getSelect().areaId;
            vm.description = $('input[name="desc"]').val();

            if(vm.name == "" || vm.controller=="" || vm.tel ==""|| vm.address ==""|| vm.provinceId ==""|| vm.cityId ==""|| vm.description ==""){
                msgAlert.text('请将网点信息填写完整');
                return false;
            }
            pointSet.commitInfo(vm).success(function(data) {
                if(data.additionalMsg.status==00){

                    msgAlert.text('新增成功');
                    window.location.href="#/transport/setting/point";

                }else if(data.additionalMsg.status==01){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

                }
            });


        }

        vm.backPoint = function(){
            window.location.href="#/transport/setting/point"
        }


    }]);