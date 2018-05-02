/**
 * 入库单导入
 */
angular.module('MetronicApp').controller('InboundImportContro', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.billLst = [];
    //加载单据类型
    initial();
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'wmsInbound',
        //status:'UNFINISHED',  20170407删除，显示全部数据
        method: 'page',
        page: 1,
        rows: 10
    }


    /**********************************************************获取单据类型*************************************************************/
    function initial() {
        vm.dictTypeName ='入库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
            vm.billLst = data.rows;
        });
    }

    /**********************************************************获取收货仓库*************************************************************/
    vm.warehouseColumn = [
        {
            field: 'ID',
            displayName: '编号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "NAME",
            displayName: '仓库名',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_warehouseName = '请输入收货仓库';
    vm.icon_warehouse = 'plus';
    vm.warehouseParams = {
        bean: 'wmsWarehouse',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.warehousePage = function () {

        commonUtil.getList(vm.warehouseParams).success(function(data) {
            if(data.additionalMsg.status == '成功' || data.additionalMsg.status == '00'){
                vm.warehouseData = data;
            }else if(data.additionalMsg.status=='01'){
                msgAlert.text('获取仓库列表失败 >﹏< ['+ data.additionalMsg.message+']');
            }
        });

    };
    vm.warehousePage();

    /**********************************************************************返回按钮**********************************************************************/
    vm.returnButton = function () {
        window.history.back(-1);
    }

    /**********************************************************************下载模板**********************************************************************/
    vm.download = function() {
        window.location.href="/templetFile/inboundImportFile.xls";
    }


    /*********** **************************************************获取ums货主信息************************************************************************************/
    vm.ownerColumn = [
        {
            field: 'userId',
            displayName: '货主id',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "nickName",
            displayName: '货主名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_ownerName = '选择货主';
    vm.icon_owner = 'plus';
    vm.ownerParams = {
        bean: 'user',
        method: 'pageOUsersByUserId',
        page: 1,
        rows: 10,
        userType:4,
        ownerType:1
    }
    vm.ownerPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.ownerParams
        }).success(function (data) {
            vm.ownerData = data;
        })};
    vm.ownerPage();

    /*********** **************************************************获取供应商信息************************************************************************************/
    vm.supliColumn = [
        {
            field: 'userId',
            displayName: '供应商id',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "nickName",
            displayName: '供应商名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_supliName = '选择供应商';
    vm.icon_supli = 'plus';
    vm.supliPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.supliParams
        }).success(function (data) {
            vm.supliData = data;
        })
    };

    //查询供应商按钮
    vm.supplierSwitch = 0 ;

    /**********************************************************单据类型处理*************************************************************/
    //initial();
    function initial() {
        vm.dictTypeName ='入库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
        });

    }
    //单据类型选择监听
    vm.selectClickAction = function () {
        if(vm.ownerEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择货主信息');
            return false;
        }else {
            vm.ownerId = vm.ownerEntity.getSelectedRows()[0].userId;
            vm.userType = vm.ownerEntity.getSelectedRows()[0].userType;
        }
    }
    $('#id_billType').change(function () {
        $('#id_relatedBillNo1').val();
        //获取单据ID 并判断单据类型
        vm.selectBillId = $('#id_billType').val();
        if(vm.userType == 4){
            if(vm.selectBillId != '10006003'){
                $("#id_billType").val("10006003");
                msgAlert.info('普通货主单据类型只能选择默认入库');
                return false;
            }else {
                vm.relatedBillNo1_switch = 0;
                vm.supplierSwitch = 0;
                $('input[name="supplierId"]').val(vm.ownerId);
                return true;
            }
        }

        if(vm.selectBillId=='10006001'){
            vm.relatedBillNo1Title = '请选择对应采购订单';
            vm.supplierSwitch = 0;
            vm.relatedBillNo1_switch = 1;
        }else if(vm.selectBillId=='10006005'){
            vm.relatedBillNo1Title = '请选择对应销售退货单';
            vm.supplierSwitch = 0;
            vm.relatedBillNo1_switch = 1;
        }else if(vm.selectBillId=='10006006'){
            vm.relatedBillNo1Title = '请选择对应调拨出库单';
            vm.supplierSwitch = 0;
            vm.relatedBillNo1_switch = 1;
        }else {
            vm.relatedBillNo1_switch = 0;
            vm.supplierSwitch = 1;

            vm.isPaveWare = '';
            if(vm.selectBillId=='10006002'){
                vm.isPaveWare = '1';
            }
            //获取供应商逻辑
            if(vm.ownerId != vm.qrySupplierUserId || vm.isPaveWare != vm.qryIsPaveWare){
                vm.qrySupplierUserId = vm.ownerId;
                vm.qryIsPaveWare = vm.isPaveWare;
                vm.supliParams = {
                    bean:'user',
                    method:'pageOUsersByUserId',
                    qryUserId:vm.qrySupplierUserId,
                    userType:4,
                    ownerType:2,
                    isPaveWare:vm.qryIsPaveWare,
                    isSupply:'1',
                    page:1,
                    rows:10
                }
                vm.supliPage();
            }
        }
    });

    //查询相关单据号
    vm.qryRelateBillNo = function () {
        if(vm.ownerEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择货主信息');
            return false;
        }else {
            vm.ownerId = vm.ownerEntity.getSelectedRows()[0].userId;
        }
        //判断单据类型
        if(vm.selectBillId=='10006001'){
            $('#searchRelateNo').attr('placeholder','采购订单编号');
            $('#selectRelatePurChaseMode').modal('show');
            //避免重复调用
            if(vm.ownerId != vm.qryOrderUserId){
                vm.qryOrderUserId = vm.ownerId;
                vm.paramPurchOrder = {
                    bean:'omsPurchaseOrder',
                    method:'pageGetPurchaseOrder',
                    qryUserId:vm.qryOrderUserId,
                    page:1,
                    rows:10
                }
                vm.getPagePurchOrder();
            }
        }else if(vm.selectBillId=='10006005'){
            $('#searchRelateNo').attr('placeholder','销售退货单编号');
        }else if(vm.selectBillId=='10006006'){
            $('#searchRelateNo').attr('placeholder','出库单编号');
            $('#selectRelateOutboundMode').modal('show');
            //避免重复调用
            if(vm.ownerId != vm.qryOutboundUserId){
                vm.qryOutboundUserId = vm.ownerId;
                vm.paramOutbound = {
                    bean:'wmsOutbound',
                    method:'page',
                    qryUserId:vm.qryOutboundUserId,
                    bill_type_id:'10007005', //调拨出库
                    page:1,
                    rows:10
                }
                vm.getPageOutbound();
            }
        }
    }

    /**********************************************************************处理文件**********************************************************************/
    vm.save = function () {


        if (vm.ownerEntity.getSelectedRows()[0] == undefined)
        {
            msgAlert.info('请先选择货主信息');
            return false;
        }

        vm.ownerId = vm.ownerEntity.getSelectedRows()[0].userId;

        vm.supplierId = "";
        if (vm.supliEntity.getSelectedRows()[0] != undefined)
        {
            vm.supplierId =vm.supliEntity.getSelectedRows()[0].userId;
        }

        vm.billTypeId = $('#id_billType').val();
        if(vm.billTypeId == null || vm.billTypeId == ''){
            msgAlert.info('请先选择单据类型');
            return false;
        }

        if (vm.warehouseEntity.getSelectedRows()[0] == undefined)
        {
            msgAlert.info('请先选择仓库信息');
            return false;
        }

        if ($("#excelFile").val() == "") {
            msgAlert.text('请导入exel文件');
            return false;
        } else {
            if ($("#excelFile").val() != '') {
                var reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
                if (!reg.test($("#excelFile").val())) {//校验不通过
                    msgAlert.info($("#excelFile").val() + "不是excel文件，请上传excel格式的文件!");
                    return;
                }
            }
        }
        vm.warehouseId = vm.warehouseEntity.getSelectedRows()[0].ID;
        $.ajaxFileUpload({
            url: "/wmsInbound/importInbound",
            type: 'post',
            fileElementId:'excelFile',
            data: { warehouseId:vm.warehouseId, billTypeId:vm.billTypeId, ownerId:vm.ownerId, supplierId:vm.supplierId},
            dataType: 'JSON',
            success: function (data, status) {
                vm.mdata = JSON.parse(data);

                if( vm.mdata.additionalMsg.status=='00'){
                    msgAlert.text('导入成功 ');
                    vm.getGoodsPage();
                    vm.getdealPage();
                    window.location.href="/wms/inbound/order";
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+  vm.mdata.additionalMsg.message+']');
                }

            },
            error: function (data, status, e) {
                vm.mdata = JSON.parse(data);

                if( vm.mdata.additionalMsg.status=='00'){
                    msgAlert.text('导入成功 >﹏< ');
                }else {
                    msgAlert.text('系统繁忙 >﹏< ['+   vm.mdata.additionalMsg.message+']');
                }
            }
        });


    }
}])



