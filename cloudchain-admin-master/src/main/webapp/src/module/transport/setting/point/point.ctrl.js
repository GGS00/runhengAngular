/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('pointController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','pointSet','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, pointSet,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.pageParams = {
        bean:'tmsPlatForm',
        method:'page',
        page:1,
        rows:10
    }


    vm.column = [
        {   field: "name",
            displayName: '网点名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "controller",
            displayName: '负责人',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "address",
            displayName: '联系地址',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "tel",
            displayName: '联系电话',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "description",
            displayName: '描述',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){

        var name = $('input[name="name"]').val();

        vm.pageParams = {
            bean:'tmsPlatForm',
            method:'page',
            page:1,
            rows:10,
            name:name
        }
        vm.getPage();
    }

    vm.addPoint = function(){
        window.location.href="#/transport/setting/point/add"
    }

    vm.removePoint= function() {
        console.log(vm.entity.getSelectedRows())
        vm.selectListRemove = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的站点信息');
            return false;

        }else{

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListRemove.push(vm.entity.getSelectedRows()[i].id);
            }
            console.log( vm.selectListRemove.join())
            pointSet.removePonit(vm).success(function(data) {

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