/**
 * 运单模板控制器
 */
angular.module('MetronicApp').controller('eSheetOriginController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','bankAccount','commonUtil','Table', function ($rootScope, $scope, $http, uiGridConstants, settings, bankAccount, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'lmsBankAccount',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.column = [{
        field: "id",
        displayName: 'ID',
        width: '5%',
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {
            field: "account_name",
            displayName: '编号',

        },
        {
            field: "bank_account",
            displayName: '模板名称',

        },
        {
            field: 'bank_name',
            displayName: '面单类型',

        }
    ]
    vm.getPage = function () {
        $http({
            url: "/process", method: "get",
            params: vm.pageParams
        }).success(function (data) {
            vm.data = data;
        })
    };
    vm.getPage();

    vm.addTemplate=function () {
        window.location.href="#/sys/store/traffic/addorigin";
    }
}])



