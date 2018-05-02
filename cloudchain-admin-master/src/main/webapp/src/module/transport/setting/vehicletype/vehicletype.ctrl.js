/**
 * Created by shaobinhua on 2017/3/16.
 */
angular.module('MetronicApp').controller('tmsVehicleTypeController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','tmsVehicleType','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, tmsVehicleType,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.pageParams = {
        bean:'tmsVehicleType',
        method:'page',
        page:1,
        rows:10
    }



    vm.column = [
        {   field: "brand",
            displayName: '品牌',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "name",
            displayName: '名称',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {  field: "enginePower",
            displayName: '发动机功率(kw)',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {  field: "fuelConsumption",
            displayName: '百公里油耗(L)',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {  field: "maxLoadVolume",
            displayName: "额定体积(立方米)",
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {  field: "maxLoadWeight",
            displayName: '额定载重(kg)',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {  field: "height",
            displayName: '高度(m)',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "length",
            displayName: '宽度(m)',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "weight",
            displayName: '重量(kg)',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "width",
            displayName: '长度(m)',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {  field: "model",
            displayName: '型号',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        }
    ]


    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            console.log(data)
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){

        var name = $('input[name="name"]').val();
        var brand = $('input[name="brand"]').val();
        var model = $('input[name="model"]').val();

        vm.pageParams = {
            bean:'tmsVehicleType',
            method:'page',
            page:1,
            rows:10,
            name:name,
            brand:brand,
            model:model
        }
        vm.getPage();
    }


    vm.addVehicleType = function(){

        window.location.href="#/transport/setting/vehicletype/add"

    }

    vm.delete =function(){

        vm.selectListActive = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的车辆类型');
            return false;

        }else{


            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
            }


            tmsVehicleType.deleteVehicleType(vm).success(function(data) {

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


}])