/**
 * Created by shaobinhua on 2017/3/16.
 */
angular.module('MetronicApp').controller('tmsAddVehicleTypeController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','tmsVehicleType','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, tmsVehicleType,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;

        vm.submitVehicle = function(){

            var name = $('input[name="name"]').val();
            var brand = $('input[name="brand"]').val();
            var model = $('input[name="model"]').val();
            var length = $('input[name="length"]').val();
            var weight = $('input[name="weight"]').val();
            var width = $('input[name="width"]').val();
            var height = $('input[name="height"]').val();
            var max_load_weight = $('input[name="maxLoadWeight"]').val();
            var max_load_volume = $('input[name="maxLoadVolume"]').val();
            var engine_power = $('input[name="enginePower"]').val();
            var fuel_consumption = $('input[name="fuelConsumption"]').val();

            if(name == "" || brand=="" || model ==""|| length ==""|| weight ==""||width == "" || height=="" || max_load_weight ==""|| max_load_volume ==""|| engine_power ==""|| fuel_consumption ==""){
                msgAlert.text('请将车辆类型信息填写完整');
                return false;
            }

            vm.form = $("#pointSetInfo").serialize();

            vm.form = decodeURIComponent(vm.form,true)

            $.ajax({
                url:"/transport/setting/vehicletype/add",
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status==00){

                        msgAlert.text('添加成功');
                        window.location.href="#/transport/setting/vehicletype";

                    }else if(data.additionalMsg.status==01){
                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');

                    }

                },
                error:function(){
                    msgAlert.text('系统繁忙 >﹏<');
                }
            })

        }

        vm.toTmsVehicle = function(){
            window.location.href="#/transport/setting/vehicletype"
        }


    }])