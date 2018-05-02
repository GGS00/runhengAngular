/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('comGoodsController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','commonInfo','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, commonInfo,commonUtil,Table) {

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
        type:'commonGoods',
        page:1,
        rows:10
    }


    vm.column = [
        {   field: "name",
            displayName: '货品名',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "unit",
            displayName: '货品单位',
            enableCellEdit: true,
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

    vm.addComGoods = function(){
        window.location.href="#/transport/setting/goods/add"
    }

    vm.removeComGoods= function() {
        console.log(vm.entity.getSelectedRows())
        vm.selectListRemove = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的货品');
            return false;

        }else{

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListRemove.push(vm.entity.getSelectedRows()[i].id);
            }
            console.log( vm.selectListRemove.join())
            commonInfo.removeCommonGoods(vm).success(function(data) {

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