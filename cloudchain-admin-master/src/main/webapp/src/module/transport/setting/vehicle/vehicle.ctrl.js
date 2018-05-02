/**
 * Created by shaobinhua on 2017/3/16.
 */
angular.module('MetronicApp').controller('tmsVehicleController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','tmsVehicle','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, tmsVehicle,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.pageParams = {
        bean:'tmsVehicle',
        method:'page',
        page:1,
        rows:10
    }



    vm.column = [
        {  field: "no",
            displayName: '车牌号',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "vehiclePropertyName",
            displayName: '车辆属性',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "type_name",
            displayName: '车辆类型',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "vehicleModel",
            displayName: '车辆型号',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "produce_date",
            displayName: '生产日期',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "purchase_date",
            displayName: '购买日期',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "CITY_ID",
            displayName: '常驻城市',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "description",
            displayName: '描述',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "drivingLisenceCode",
            displayName: '行驶证一维码',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "drivingLisenceRegisTime",
            displayName: '行驶证注册日期',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "mainDriverName",
            displayName: '主司机',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "secondDriverName",
            displayName: '副司机',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "gps_No",
            displayName: 'GPS设备号',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {  field: "engineNo",
            displayName: '发动机编号',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
        {   field: "vin",
            displayName: '车辆识别码',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true
        },
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            console.log(data)
            vm.data = data;
        });
    };
    vm.getPage();

    vm.addVehicle = function(){
        window.location.href="#/transport/setting/vehicle/add"
    }

    vm.delete = function(){

        vm.deleteList = [];

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的载具');
            return false;

        }else{

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.deleteList.push(vm.entity.getSelectedRows()[i].id);
            }

            tmsVehicle.deleteVehicle(vm).success(function(data) {
                if(data.additionalMsg.status==00){

                    msgAlert.text('删除成功');

                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status==01){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });
        }



    }

    vm.editVehicle = function(){

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改的载具');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条载具信息');

        }else{
            vm.id=vm.entity.getSelectedRows()[0].id;
            tmsVehicle.getInfo(vm).success(function(data) {
                vm.editInfo = data;
            });

            $('#modifyModal').modal('show');
        }
    }

    vm.confirmModify =function(){

        vm.form = $("#editDriversInfo").serialize();
        vm.form = decodeURIComponent(vm.form,true)
        console.log(vm.form)

        $.ajax({
            url:"/transport/setting/vehicle/update",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status == 00){
                    $('#modifyModal').modal('hide');
                    msgAlert.text('修改成功');
                    vm.getPage();

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.message+']');
                }


            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })


    }



}])