/**
 * 入库单控制器
 */
angular.module('MetronicApp').controller('BillInboundRecordContro', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil','$location', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, $location,Table) {

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

    //页面头部入库单信息赋值
    $('input[name="inboundCode"]').val($location.search().inboundCode);

    var vm = this;
    vm.billType = $location.search().billType;  //获取上一层传入的单据类型并反显
    vm.inboundCode = $location.search().inboundCode;
    vm.menuLen = 6;
    vm.pageParams = {
        inboundCode:vm.inboundCode,
        bean: 'wmsReceiveRecord',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.column = [{
        field: "ID",
        displayName: 'ID',
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {
            field: "WAREHOUSE_ID",
            visible: false,
            displayName: '仓库ID',
        },
        {
            field: "PRODUCT_CODE",
            displayName: '货品编码',
        },
        {
            field: "PRODUCT_NAME",
            displayName: '货品名称',
        }, {
            field: "RECEIVEDQUANTITYBU",
            displayName: '收货数量',
        },
        {
            field: "INPUTSNQUANTITYBU",
            displayName: '已录唯一码数量',
        },
        {
            field: "LOCATION_NAME",
            displayName: '收货库位',
        },
        {
            field: "inventoryStatus",
            displayName: '库存状态',
            cellTemplate:'<div style="padding:5px">{{row.entity.inventoryStatus=="GOOD"?"良品":(row.entity.inventoryStatus=="BAD"?"不良品":row.entity.inventoryStatus)}}</div>'
        },
        {
            field: "PRODUCT_KEY_LOT",
            displayName: '库存批次',
            width: '20%'
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
    /**********************************************************获取单据类型*************************************************************/
    initial();
    function initial() {
        vm.dictTypeName ='入库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
        });
    }

    vm.getPageByFilter = function(){
        var inboundCode = $('input[name="inboundCode"]').val();
        var billType = $('#id_billType').val();
        vm.pageParams = {
            inboundCode:inboundCode,
            billType:billType,
            bean:'wmsReceiveRecord',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }
}])