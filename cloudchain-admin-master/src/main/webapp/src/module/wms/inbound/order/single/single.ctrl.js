/**
 * 入库单控制器
 */
angular.module('MetronicApp').controller('InboundSingleContro', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil','$location', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil,$location,Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        //页面头部入库单信息赋值
        $('input[name="code"]').val($location.search().code);
        $('input[name="nickName"]').val($location.search().nickName);
        $('input[name="billType"]').val($location.search().billType);

        var vm = this;
        vm.menuLen = 4;

        vm.id = $location.search().id


        vm.pageParams = {
            bean: 'wmsInboundItem',
            inboundId:vm.id,
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.column = [{
            field: "id",
            displayName: 'ID',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
            {
                field: 'supplier.id',
                displayName: '货主ID',
                visible: false,
            },
            {
                field: "inbound.warehouseId",
                visible: false,
                displayName: '仓库ID',
            },
            {
                field: 'lineNo',
                displayName: '行号',
            },
            {
                field: "product.id",
                displayName: '货品编码',
            },
            {
                field: "product.name",
                displayName: '货品名称',
            }, {
                field: "expectedQuantityBU",
                displayName: '期待数量',
            },{
                field: "receivedQuantityBU",
                displayName: '收货数量',
            },{
                field: "shelvedQuantityBU",
                displayName: '上架数量',
            },
            {
                field: "expectedSnQuantity",
                displayName: '期待唯一码数量',
            },
            {
                field: "realSnQuantity",
                displayName: '已录唯一码数量',
            },
            {
                field: "inventoryStatus",
                displayName: '库存状态',
                cellTemplate:'<div style="padding:5px">{{row.entity.inventoryStatus=="GOOD"?"良品":(row.entity.inventoryStatus=="BAD"?"不良品":row.entity.inventoryStatus)}}</div>'
            },
            {
                field: "supplier.name",
                displayName: '供应商',
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
    /**
     * 收货操作
     */
    vm.receipt = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一天要收货的入库单明细');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('只能选择一条入库单明细进行收货');
        } else if (vm.entity.getSelectedRows()[0].expectedQuantityBU == vm.entity.getSelectedRows()[0].receivedQuantityBU) {
            msgAlert.info("收货完成，不用再进行收货操作");
        } else {
            $('input[name="lineNo"]').val(vm.entity.getSelectedRows()[0].lineNo);
            $('input[name="productName"]').val(vm.entity.getSelectedRows()[0].product.name);
            $('input[name="supplierName"]').val(vm.entity.getSelectedRows()[0].supplier.name);
            $('input[name="id"]').val(vm.entity.getSelectedRows()[0].id);
            //收货数量 期待收货数量-实际收货数量
            $('input[name="quantity"]').val(vm.entity.getSelectedRows()[0].expectedQuantityBU - vm.entity.getSelectedRows()[0].receivedQuantityBU);
            $('#upd_inventStatus').val(vm.entity.getSelectedRows()[0].inventoryStatus=='GOOD'?'良品':(vm.entity.getSelectedRows()[0].inventoryStatus=='BAD'?'不良品':vm.entity.getSelectedRows()[0].inventoryStatus));
            $('#selectCommonContacts').modal('show');
        }

    }

    //返回按钮
    vm.returnButton = function () {
        window.location.href=  "#/wms/inbound/order";
    }

        //收货确定按钮
        vm.doDetailRecive = function(){
            vm.receiveParams = {
                itemId:$('input[name="id"]').val(),
                quantity: $('input[name="quantity"]').val(),
                inventoryStatus:$('select[name="inventoryStatus"]').val()
            }
            $.ajax({
                url:"/wmsInboundItem/doReceiveDetail",
                data:vm.receiveParams,
                type:"post",
                dataType:"json",
                success:function(data){
                    if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                        msgAlert.info('收货成功');
                        $('#selectCommonContacts').modal('hide');
                        vm.getPage();
                    }else if(data.additionalMsg.status=='01'){
                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    }
                },
                error:function(){
                    // msgAlert.text('系统繁忙 >﹏<');
                }
            })
        }
}])



