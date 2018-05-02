/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('denialReasonController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','denialReason','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, denialReason,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.pageParams = {
        bean:'tmsDenialReason',
        method:'page',
        page:1,
        rows:10
    }


    vm.column = [
        {  field: "code",
            displayName: '拒签码',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "name",
            displayName: '拒签原因',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "description",
            displayName: '拒签描述',
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
        var code = $('input[name="code"]').val();

        vm.pageParams = {
            bean:'tmsDenialReason',
            method:'page',
            page:1,
            rows:10,
            name:name,
            code:code
        }
        vm.getPage();
    }

    vm.addDenialReason = function(){
        window.location.href="#/transport/setting/denialreason/add"
    }

    vm.removeDenialReason= function() {
        console.log(vm.entity.getSelectedRows())
        vm.selectListRemove = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的拒签原因');
            return false;

        }else{

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListRemove.push(vm.entity.getSelectedRows()[i].id);
            }
            console.log( vm.selectListRemove.join())
            denialReason.removeDenialReason(vm).success(function(data) {

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