/**
 * 入库单控制器
 */
angular.module('MetronicApp').controller('InboundSnContro', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', '$location','Table', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, $location,Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.id = $location.search().id
    vm.pageParams = {
        bean: 'wmsInboundItem',
        method: 'page',
        inboundId:vm.id,
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
            field: "product.name",
            displayName: '商品名称',
            width: '20%'
        },
        {
            field: "expectedSnQuantity",
            displayName: '唯一码期待数量',
            width: '20%'
        },
        {
            field: "receivedQuantityBU",
            displayName: '实际收货数量',
            width: '20%'
        },
        {
            field: "realSnQuantity",
            displayName: '唯一码录入数量',
            width: '20%'
        },
        {
            name:'唯一码待录数量',
            cellTemplate:'<div class="ui-grid-cell-contents">{{row.entity.expectedSnQuantity  -  row.entity.realSnQuantity }}</div>'
        }

    ]
    vm.getPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.pageParams
        }).success(function (data) {
            vm.data = data;
        })
    };
    vm.getPage();


    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }

    vm.inputSerials = function() {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要录入唯一码的明细');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.info('只能选择一条明细录入唯一码');
            return false;
        }else if((vm.entity.getSelectedRows()[0].expectedSnQuantity - vm.entity.getSelectedRows()[0].realSnQuantity) <= 0){
            msgAlert.info('唯一码待录数量为零，无需再次进行录码操作');
            return false;
        }else{
         $('#selectCommonContacts2').modal('show');
        }
    }

    vm.addSn = function(){

        BillManage.doInputUC(vm).success(function(data) {

            if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){

                msgAlert.info('录入成功');
                $('#selectCommonContacts2').modal('hide');
                vm.getPage();
                vm.entity.clearSelectedRows();

            }else if(data.additionalMsg.status=='01'){
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }

        });
    }

}]);



