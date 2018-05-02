
angular.module('MetronicApp').controller('logisticsMatchRuleController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','bankAccount','commonUtil','Table', function ($rootScope, $scope, $http, uiGridConstants, settings, bankAccount, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'omsLogisticsMatchRule',
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
            field: "code",
            displayName: '编号',

        },
        {
            field: "name",
            displayName: '规则名称',

        },
        {
            field: 'rule_type',
            displayName: '规则类型',
            cellTemplate:'<div style="padding:5px">{{row.entity.rule_type=="0"?"按重量区间设置":(row.entity.rule_type=="1"?"按任意重量设置":row.entity.rule_type)}}</div>'
        },
        {
            field: 'active_time',
            displayName: '生效时间',
        },
        {
            field: 'invalid_time',
            displayName: '失效时间',
        },
        {
            field: 'status',
            displayName: '当前状态',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="ACTIVE"?"有效":row.entity.rule_type}}</div>'
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

    vm.add=function () {
        window.location.href="#/sys/store/traffic/addmatchrule";
    }
    vm.update=function () {
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改的物流匹配规则信息');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条物流匹配信息');

        }else {

            window.location.href = "#/sys/store/traffic/updatematchrule?id="+vm.entity.getSelectedRows()[0].id;
        }
    }
    vm.delete = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要删除的物流匹配规则');
            return false;
        }
        if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('请选择一条要删除的物流匹配规则');
            return false;
        }

        vm.delId = vm.entity.getSelectedRows()[0].id;
        vm.matchRule_del = {
            id: vm.delId
        }
        $http({url:"/logisticsMatchRule/delete",
            method: "post",
            params:vm.matchRule_del
        }).success(function (data) {

            if ( data.status == '00') {
                msgAlert.info('删除物流匹配规则成功');
                vm.getPage();
            } else  {
                msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
            }
        })
    }

}])



