/**
 * 上架控制器
 */
angular.module('MetronicApp').controller('ShelfTaskControl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','Table', function($rootScope, $scope,$http,uiGridConstants, settings, BillManage,commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    //定义单据数组
    vm.billLst = [];
    initiBill();

    vm.menuLen = 4;
    vm.pageParams = {
        bean:'wmsShelveWork',
        method:'page',
        page:1,
        rows:10
    }
    vm.column = [ {  field: "id",
        displayName: 'ID',
        width:'5%',
        visible:false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {  field: "warehouse.id",
            displayName: '仓库id',
            width: '10%',
            visible:false,
        },
        {  field: "code",
            displayName: '作业单号',
            suppressRemoveSort: true,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: '25%',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
        },
        {  field: "moveDocCode",
            displayName: '上架单号',
            suppressRemoveSort: true,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: '25%',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
        },
        {   field: "originalBillCode",
            displayName: '入库单号',
            width: '20%'

        },
        {  field: "billType.id",
            displayName: '单据类型',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.billType.id)}}</div>'

        },
        {  field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="OPEN"?"打开":(row.entity.status=="FINISHED"?"完成":(row.entity.status=="WORKING"?"工作中":row.entity.status))}}</div>'
        },
        // 该栏位暂时没有用到，20170406删除
        // {  field: "isAssigned",
        //     displayName: '任务分配状态',
        //     width: '10%'
        // },
        {  field: "planQuantityBU",
            displayName: '计划数量',
            width: '10%'
        },
        {  field: "movedQuantityBU",
            displayName: '上架数量',
            width: '10%'
        },
        {  field: "lastOperator",
            displayName: '最后修改人员',
            width: '10%'
        },
        {  field: "lastOperatedTime",
            displayName: '最后修改时间',
            width: '15%'
        }
    ]
    vm.getPage = function () {
        $http({url:"/process"/*'../js/services/dashBoard.json'*/,method: "get",
            params:vm.pageParams
        }).success(function(data) {
            vm.data = data;
        })
    };
    vm.getPage();
    vm.tasksure = function(){
        window.location.href="#/wms/inbound/shelveswork/confirm?id="+vm.entity.getSelectedRows()[0].id;
    }

    vm.getPageByFilter = function(){
        var code = $('input[name="code"]').val();
        var original_bill_code = $('input[name="original_bill_code"]').val();
        var status = $('.status').val();
        if(status == " "){
            status ="";
        }
        vm.pageParams = {
            code:code,
            original_bill_code:original_bill_code,
            status:status,
            bean:'wmsShelveWork',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }

    //单据类型匹配
    $scope.matchBillType = function(billType){
        for(var i=0;i<vm.billLst.length;i++){
            if(vm.billLst[i].dataValue == billType){
                return vm.billLst[i].dataName;
            }
        }
        return billType;
    }
    function initiBill() {
        vm.dictTypeName ='入库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
            vm.billLst = data.rows;
        });
    }
}])


