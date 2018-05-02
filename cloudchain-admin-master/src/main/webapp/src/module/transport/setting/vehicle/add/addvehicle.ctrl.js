/**
 * Created by shaobinhua on 2017/3/16.
 */
angular.module('MetronicApp').controller('tmsAddVehicleController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','tmsVehicle','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, tmsVehicle,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.placeholder = '车辆类型';
        vm.icon = 'plus';

        vm.placeholderOne = '主司机';
        vm.iconOne = 'plus';

        vm.placeholderTwo = '副司机(选填)';
        vm.iconTwo = 'plus';

        vm.pageParams = {
            bean:'tmsVehicleType',
            method:'page',
            page:1,
            rows:10,
        }

        vm.pageParamsOne = {
            bean:'user',
            method:'pageGetDriverList',
            userType:3,
            page:1,
            rows:100
        }

        vm.pageParamsTwo= {
            bean:'user',
            method:'pageGetDriverList',
            userType:3,
            page:1,
            rows:10
        }

        vm.column = [
            {  field: "id",
                displayName: 'ID',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {   field: "name",
                displayName: '车辆类型',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            }
        ]

        vm.columnOne = [
            {   field: "userId",
                displayName: 'ID',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "nickName",
                displayName: '司机名',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            }
        ]

        vm.columnTwo = [
            {   field: "userId",
                displayName: 'ID',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "nickName",
                displayName: '司机名',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            }
        ]




        vm.getPage = function(){

            commonUtil.getList(vm.pageParams).success(function(data) {
                vm.data = data;
            });

        };

        vm.getPage();

        vm.getPageOne = function(){

            commonUtil.getList(vm.pageParamsOne).success(function(data) {
                console.log(data)
                vm.dataOne = data;
            });

        };

        vm.getPageOne();

        vm.getPageTwo = function(){

            commonUtil.getList(vm.pageParamsTwo).success(function(data) {
                vm.dataTwo = data;
            });

        };

        vm.getPageTwo();

        vm.submitVehicle = function(){

            if($('.typeId').find('input').val() ==""){
                msgAlert.text('请先选择车辆类型');
                return false;
            }
            var engineNo = $('input[name="engineNo"]').val();
            var gpsNo = $('input[name="gpsNo"]').val();
            var vehicleProperty = $('input[name="vehicleProperty"]').val();
            var cityId = $('input[name="cityId"]').val();
            var description = $('input[name="description"]').val();
            var no = $('input[name="no"]').val();
            var vin = $('input[name="vin"]').val();
            if(engineNo =="" || gpsNo ==""|| vehicleProperty ==""|| cityId == "" || description=="" || no ==""|| vin ==""){
                msgAlert.text('请将车辆信息填写完整');
                return false;
            }

            if($('.mainDriverId').find('input').val() ==""){
                msgAlert.text('请选择主司机');
                return false;
            }

            $('#produceDate').val($('.produceDate span').html());
            $('#purchaseDate').val($('.purchaseDate span').html());
            $('#drivingLisenceRegisTime').val($('.drivingLisenceRegisTime span').html());
            $('#drivingLisenceReceiveTime').val($('.drivingLisenceReceiveTime span').html());
            $('#typeId').val(vm.entity.getSelectedRows()[0].id);
            $('#mainDriverId').val(vm.entityOne.getSelectedRows()[0].userId);
            if(vm.entityTwo.getSelectedRows()[0]){
                $('#secondDriverId').val(vm.entityTwo.getSelectedRows()[0].userId);
            }
            $('#mainDriverName').val(vm.entityOne.getSelectedRows()[0].nickName);
            if(vm.entityTwo.getSelectedRows()[0]){
                $('#secondDriverName').val(vm.entityTwo.getSelectedRows()[0].nickName);
            }


            vm.form = $("#tmsAddVehicle").serialize();

            vm.form = decodeURIComponent(vm.form,true);

            $.ajax({
                url:"/transport/setting/vehicle/add",
                data:vm.form,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status==00){

                        msgAlert.text('添加成功');
                        window.location.href="#/transport/setting/vehicle";

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
            window.location.href="#/transport/setting/vehicle"
        }


    }])