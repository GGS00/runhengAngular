/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('comAddressController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','commonInfo','commonUtil','Table','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, commonInfo,commonUtil,Table,citySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.pageParams = {
        bean:'commonInfo',
        method:'page',
        type:'commonAddress',
        page:1,
        rows:10
    }


    vm.column = [
        {   field: "provinceName",
            displayName: '所在省',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "cityName",
            displayName: '所在市',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "districtName",
            displayName: '所在区',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "address",
            displayName: '详细地址',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            console.log(data);
            vm.data = data;
        });
    };
    vm.getPage();

    vm.addcomAddress = function(){
        window.location.href="#/transport/setting/address/add"
    }

    vm.removeComAddress= function() {
        console.log(vm.entity.getSelectedRows())
        vm.selectListRemove = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的地址');
            return false;

        }else{

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListRemove.push(vm.entity.getSelectedRows()[i].id);
            }
            console.log( vm.selectListRemove.join())
            commonInfo.removeCommonAddress(vm).success(function(data) {

                if(data.additionalMsg.status==00){

                    msgAlert.text('删除成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status==01){

                    msgAlert.text('失败 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });



        }
    }


}])