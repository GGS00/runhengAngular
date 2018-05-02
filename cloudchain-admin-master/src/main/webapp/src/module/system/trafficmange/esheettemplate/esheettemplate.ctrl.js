/**
 * 运单模板控制器
 */
angular.module('MetronicApp').controller('eSheetTemplateController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','bankAccount','commonUtil','Table', function ($rootScope, $scope, $http, uiGridConstants, settings, bankAccount, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'wmsPrint',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.column = [
        {
            field: "templateId",
            displayName: '编号',
        },
        {
            field: "templateName",
            displayName: '模板名称',

        },
        {
            field: 'billType',
            displayName: '面单类型',
            cellTemplate:'<div style="padding:5px">{{row.entity.billType=="10"?"传统面单":(row.entity.billType=="11"?"电子面单":row.entity.billType)}}</div>'
        }
    ]
    vm.getPage = function () {
        $http({
            url: "/process", method: "get",
            params: vm.pageParams
        }).success(function (data) {
            if(data.additionalMsg.status=="00") {
                vm.data = data;
            }
        })
    };
    vm.getPage();

    vm.addTemplate=function () {
        window.location.href="#/sys/store/traffic/addtemplate";
    }

    vm.delete=function () {
        vm.selectListActive = [];
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要删除的模板');
            return false;
        }

        if (vm.entity.getSelectedRows().length >1 ) {
            msgAlert.info('只能删除一条模板');
            return false;
        }
        $http({
            url:"/wmsPrint/delete/"+vm.entity.getSelectedRows()[0].templateId,
            method: "post"
        }).success(function (data) {
            if (data.status == '00') {
                msgAlert.info('删除成功');
                vm.getPage();
            } else {
                msgAlert.text(' >﹏< [' + data.message + ']');
            }
        }).error(function () {
            msgAlert.text(' 系统繁忙 >﹏< ');
        });
    }
    vm.getPageByFilter=function () {
        var printType = $('#id_printType').val();
        if(printType == " "){
            printType ="";
        }
       var templateName=$("input [name='templateName']").val();
        if((printType==null||printType=="")&&(templateName==null||templateName=="")){
            msgAlert.alert("搜索条件不能为空");
            return;
        }
        vm.pageParams = {
            bean: 'wmsPrint',
            method: 'page',
            page: 1,
            rows: 10,
            printType:printType,
            templateName:templateName
        }
        vm.getPage();
    }
}])



