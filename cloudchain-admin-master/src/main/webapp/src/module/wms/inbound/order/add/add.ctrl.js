/**
 * 入库单控制器
 */
angular.module('MetronicApp').controller('BillInboundNewContro', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table','Goods', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table,Goods) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.relatedBillNo1_switch = 0;  //关联单据号显示开关
    vm.fineOrder_switch = 0;
    vm.fineOrder_item_switch = 0;
    vm.supplierSwitch = 1;
    vm.relatedBillNo1Title = '';
    vm.selectedWareHouseId = '';
    vm.selectBillId = '10006003';
    vm.loginUserId = '';
    vm.fineOrderAreaId = '';
    initFeeUnit();
    vm.pageParams = {
        bean: 'wmsInboundItem',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.column = [{
        field: "id",
        displayName: 'ID',
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    }, {
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
            displayName: '商品形态',
            cellTemplate:'<div style="padding:5px">{{row.entity.inventoryStatus=="GOOD"?"良品":(row.entity.inventoryStatus=="BAD"?"不良品":row.entity.inventoryStatus)}}</div>'
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

    //货主选择事件
    vm.ownerClickAction = function () {
        if(vm.ownerEntity.getSelectedRows().length == 1) {
            vm.ownerId = vm.ownerEntity.getSelectedRows()[0].userId;
            vm.userType = vm.ownerEntity.getSelectedRows()[0].userType;
            if(vm.userType == 4){
                $('#id_billType').find("option[text='默认入库']").attr("selected",true);
                vm.supplierSwitch = 0;
            }
            if(vm.loginUserId == vm.ownerEntity.getSelectedRows()[0].userId){
                vm.fineOrder_switch = 0;
                vm.fineOrder_item_switch = 0;
            }else {
                vm.fineOrderParams = {
                    bean:'d2WOrder',
                    method:'page',
                    customerId:vm.ownerId,
                    page:1,
                    rows:10
                }
                //查询优仓订单列表
                vm.fineOrderPage();
                vm.fineOrder_switch = 1;
            }
        }
        vm.ownerAndBillAction();
    }

    /**********************************************************************添加明细**********************************************************************/
      vm.addDetail = function () {
          if($('input[name="inboundId"]').val() == ''){
              msgAlert.info('请填写入库单基础信息,并点击确定按钮创建入库单...');
              return false;
          }else {
              $('#selectCommonContacts2').modal('show');

              vm.skuPage();
          }
      }


    /**********************************************************************返回按钮**********************************************************************/
    vm.returnButton = function () {
        window.history.back(-1);
    }

    /*********************************************************选择商品对话框***********************************************************/
    vm.aaaa =function () {
        $('#lar11ge').modal('show');
    }

    vm.overClick = function () {
        if(vm.skuEntity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择至少一条商品');
            return false;
        }else  if(vm.skuEntity.getSelectedRows().length > 1) {
            msgAlert.info('不能选择多条商品');
            return false;
        }else {
            $("#goods1").val(vm.skuEntity.getSelectedRows()[0].title);
            $('input[name="productId"]').val(vm.skuEntity.getSelectedRows()[0].skuId); //货品id
            $('#lar11ge').modal('hide');
        }
    }

    function categoryTree() {
        $("#categoryTree").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                // so that create works
                "check_callback" : true,
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : ["dnd", "state", "types"]
        })

    }

    Goods.getCategoryList().success(function (data) {
        console.log(data)
        var oldbox = data.data;
        var row =  new Array();

        row.push({"id":0,"parent":"#","text":"全部商品"})
        if(oldbox != null){
            for(var i=0;i<oldbox.length;i++){
                if(oldbox[i].parentCId == 0){
                    row.push({"id":oldbox[i].cId,"parent":"#","text":oldbox[i].name})
                }else{
                    row.push({"id":oldbox[i].cId,"parent":oldbox[i].parentCId,"text":oldbox[i].name})
                }
            }
        }
        categoryTree()
        $("#categoryTree").jstree(true).settings.core.data = row;
        $('#categoryTree').jstree(true).deselect_all();
        $("#categoryTree").jstree(true).refresh('true');
        $("#categoryTree").on('changed.jstree',function(e,data){
            $scope.cIds="";
            var i, j;
            for (i = 0, j = data.selected.length; i < j; i++) {
                var node = data.instance.get_node(data.selected[i]);
                if (data.instance.is_leaf(node)) {
                    if(node.id == 0){
                        node.id = ""
                    }
                    $scope.cIds = node.id;
                    vm.skuParams.cId = $scope.cIds,
                        vm.skuPage()
                }
            }
        });
    })
    vm.serachGoods = function () {
        vm.skuPage()
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
        vm.placeholder_ownerName = '请输入货主';
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
            vm.loginUserId = data.userId;
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
    vm.placeholder_supliName = '请输入供应商';
    vm.icon_supli = 'plus';
    vm.supliPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.supliParams
        }).success(function (data) {
            vm.supliData = data;
        })
    };

    /*********** **************************************************获取GMS商品信息************************************************************************************/
        vm.skuColumn=[
            {
                field: 'skuId',
                displayName: '商品id',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: true,
                visible:false ,
                suppressRemoveSort: true,
                enableCellEdit: true, // 是否可编辑
            },{
                field: "title",
                displayName: '商品名称',
                enableCellEdit: true,
                enableCellEditOnFocus: true
           }

        ]
        vm.placeholder_skuName = '请输入货品';
        vm.icon_sku = 'plus';



    vm.skuPage = function () {
        if(vm.ownerEntity.getSelectedRows()[0].userType == '0' && vm.ownerEntity.getSelectedRows()[0].userId != $('input[name="supplierId"]').val()){
            //查询供应商绑定商品列表
            vm.skuParams = {
                bean: 'gmsSupplier',
                method: 'pageGetSupplierSkuList',
                qryType:'03',
                supplierId:$('input[name="supplierId"]').val(),
                page: 1,
                rows: 10
            }
            vm.skuParams.cId = $scope.cIds
            vm.skuParams.title = $scope.skuName
        }else {
            //按货主查询商品列表;
            vm.skuParams = {
                bean: 'goods',
                method: 'pageQryUserSkuLst',
                qryUserId:vm.ownerEntity.getSelectedRows()[0].userId,
                page: 1,
                rows: 10
            }
            vm.skuParams.cId = $scope.cIds
            vm.skuParams.title = $scope.skuName
        }
        commonUtil.getList(vm.skuParams).success(function(data) {
            if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                vm.skuData = data;
            }else if(data.additionalMsg.status=='01'){
                msgAlert.text('获取商品列表失败 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    };

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

    /*************************************************************获取优仓订单************************************************************************************/
    //优仓订单选择事件
    vm.fineOrderClickAction = function () {
        if(vm.fineOrderEntity.getSelectedRows().length == 0){
            vm.fineOrder_item_switch = 0;
        }else {
            vm.selectFeeType = vm.fineOrderEntity.getSelectedRows()[0].chargingRule + '';
            vm.selectFeeUnit = vm.fineOrderEntity.getSelectedRows()[0].unit;
            vm.fineOrder_item_switch = 1;
            vm.orderTypeNm = '';
            vm.orderType = vm.fineOrderEntity.getSelectedRows()[0].orderType;
            if(vm.orderType == '0'){
                vm.orderTypeNm = '包仓';
                setTimeout(function () {
                    $('#id_fine_order_cycle').attr("readOnly",true);
                    $('#id_fine_order_price').attr("readOnly",true);
                    $('#id_fine_order_unit').attr("disabled", true);
                    $('#id_fine_order_feetype').attr("disabled", true);
                },10);
            }else {
                vm.orderTypeNm = '零仓';
                $('#id_fine_order_cycle').removeAttr("readOnly");
                $('#id_fine_order_price').removeAttr("readOnly");
                $('#id_fine_order_unit').removeAttr("disabled");
                $('#id_fine_order_feetype').removeAttr("disabled");
            }
            setTimeout(function () {
                $('#id_fine_order_type').val(vm.orderTypeNm);
                $('#id_fine_order_cycle').val(vm.fineOrderEntity.getSelectedRows()[0].cycle);
                if(vm.selectFeeType == '1'){
                    $('#id_fine_order_cycle').attr("readOnly",true);
                }
                $('#id_fine_order_price').val(vm.fineOrderEntity.getSelectedRows()[0].price/100);
                $('#id_fine_order_area').val(vm.fineOrderEntity.getSelectedRows()[0].warehouseName+'-'+vm.fineOrderEntity.getSelectedRows()[0].warehouseAreaName);
            },10);
            vm.selectedWareHouseId = vm.fineOrderEntity.getSelectedRows()[0].warehouseId;
            vm.fineOrderAreaId = vm.fineOrderEntity.getSelectedRows()[0].warehouseAreaId;
            $('input[name="fineOrderId"]').val(vm.fineOrderEntity.getSelectedRows()[0].orderId);
        }
    }
    vm.placeholder_fineOrder = '请输入优仓订单号';
    vm.icon_fineOrder = 'plus';
    vm.fineOrderColumn = [
        { field: 'orderId',
            displayName: '优仓订单号',
            width: 200,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true
        },
        {  field: "userName",
            displayName: '对方名称',
            enableCellEdit: true,
            width:120,
            enableCellEditOnFocus:true
        },{ field: 'orderType',
            displayName: '服务类型',
            width: 100,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true,
            cellTemplate:'<div style="padding:5px">{{row.entity.orderType==0?"仓库租赁":(row.entity.orderType==1?"货物保管":"")}}</div>'
        },
        { field: 'price',
            displayName: '单价',
            width: 120,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true,
            cellTemplate:'<div style="padding:5px">{{row.entity.price/100}}</div>'
        },
        {  field: "totalPrice",
            displayName: '成交总额',
            enableCellEdit: true,
            width:130,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.totalPrice/100}}</div>'
        },
        {  field: "createdTime",
            displayName: '成交时间',
            enableCellEdit: true,
            width:170,
            enableCellEditOnFocus:true
        }
    ]
    vm.fineOrderPage = function () {
        commonUtil.getList(vm.fineOrderParams).success(function(data) {
            vm.fineOrderData = data;
        });
    }

    //收费模式监听事件
    vm.feeTypeChgAction = function () {
        vm.fineFeeType = $('#id_fine_order_feetype').val();
        if(vm.fineFeeType == '1'){
            $('#id_fine_order_cycle').val('1');
            $('#id_fine_order_cycle').attr("readOnly",true);
        }else {
            $('#id_fine_order_cycle').removeAttr("readOnly");
        }
    }
    /*********** **************************************************提交新建入库单方法************************************************************************************/
    vm.submitPoint =function () {
        if(vm.ownerEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择货主信息');
            return false;
        }
        $('input[name="ownerId"]').val(vm.ownerEntity.getSelectedRows()[0].userId); //货主id
        if(vm.supplierSwitch == 1){
            if(vm.supliEntity.getSelectedRows().length == 0){
                msgAlert.info('请先选择供应商');
                return false;
            }
            $('input[name="supplierId"]').val(vm.supliEntity.getSelectedRows()[0].userId); //供应商id
        }
        if($('input[name="supplierId"]').val() == null || $('input[name="supplierId"]').val() == ''){
            msgAlert.info('请先选择供应商信息');
            return false;
        }
        $('input[name="billTypeId"]').val($('#id_billType').val());
        if($('input[name="billTypeId"]').val() == null || $('input[name="billTypeId"]').val() == ''){
            msgAlert.info('请先选择单据类型');
            return false;
        }
        if(vm.selectedWareHouseId == null || vm.selectedWareHouseId == ''){
            if(vm.warehouseEntity.getSelectedRows().length == 0){
                msgAlert.info('请先选择收货仓库');
                return false;
            }else {
                vm.selectedWareHouseId = vm.warehouseEntity.getSelectedRows()[0].ID;
            }
        }
        $('input[name="warehouseId"]').val(vm.selectedWareHouseId);
        if($('input[name="warehouseId"]').val() == null || $('input[name="warehouseId"]').val() == ''){
            msgAlert.info('请先选择仓库信息');
            return false;
        }
        // vm.form = $("#WmsInbound").serialize();
        // vm.form = decodeURIComponent(vm.form,true);
        // console.log(vm.form);
        vm.inbound = {
            ownerId:$('input[name="ownerId"]').val(),
            billTypeId:$('input[name="billTypeId"]').val(),
            warehouseId:$('input[name="warehouseId"]').val(),
            relatedBillNo1:$('input[name="relatedBillNo1"]').val(),
            supplierId:$('input[name="supplierId"]').val(),
            description:$('input[name="description"]').val(),
            ext1:vm.fineOrderAreaId
        }
        if(vm.fineOrder_item_switch == 0){ //未选择优仓订单
            vm.wmsInboundRequest = {
                inbound:vm.inbound
            }
        }else {
            vm.leaseConfig = {
                agreement:$('input[name="fineOrderId"]').val(), //优仓订单号
                leaseType:vm.orderType,  //服务类型 零仓 包仓
                feeType:$('#id_fine_order_unit').val(),    //计费单位
                feeModel:$('#id_fine_order_feetype').val(),  //收费模式
                feeCycle:$('#id_fine_order_cycle').val(),  //计费周期
                feePrice:$('#id_fine_order_price').val() * 100 //单价
            }
            vm.wmsInboundRequest = {
                inbound:vm.inbound,
                leaseConfig:vm.leaseConfig
            }
        }
        BillManage.addInbound(vm).success(function (data) {
            if(data.additionalMsg.status == '00'){
                msgAlert.info('新增成功');
                $('input[name="inboundId"]').val(data.id);
                $('input[name="inboundCode"]').val(data.code);
                $("#inboundConfirmButton").hide();
                $("#inboundCancelButton").hide();

                //置灰入库单相关栏位
                //TODO货主
                $('#id_billType').attr('disabled','true');
                $('#id_relatedBillNo1').attr('disabled','true');
                $('#id_description').attr('readonly','true');
            }else if(data.additionalMsg.status=='01'){
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    }
    /*********** **************************************************提交添加明细方法************************************************************************************/
    vm.sumbitAddDeatil = function () {
         if(  $('input[name="productId"]').val()==""){
             msgAlert.info('请先选择先选择商品');
             return;
         }
        vm.form = $("#WmsInboundItem").serialize();
        vm.form = decodeURIComponent(vm.form,true);
        console.log(vm.form)
        $.ajax({
            url:"/wmsInboundItem/addInboundItem",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                    $('#selectCommonContacts2').modal('hide');
                    msgAlert.info('新增成功');
                    vm.pageParams = {
                        bean: 'wmsInboundItem',
                        method: 'page',
                        page: 1,
                        rows: 10,
                        inboundId:$('input[name="inboundId"]').val()
                    }
                    vm.getPage();
                    $('input[name="totalBU"]').val(data.totalBU);
                    $('input[name="productId"]').val(""); //货品id
                    $("#goods1").val("请选择商品");
                }else if(data.additionalMsg.status=='01'){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                // msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }

    /**********************************************************计费单位处理*************************************************************/
    function initFeeUnit() {
        vm.dictTypeName ='优仓计费单位';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.feeUnitList = data.rows;
        });
    }
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
        }
    }
    $('#id_billType').change(function () {
        vm.ownerAndBillAction();
    });

    vm.ownerAndBillAction = function () {
        $('#id_relatedBillNo1').val('');
        //获取单据ID 并判断单据类型
        vm.selectBillId = $('#id_billType').val();
        if(vm.userType == 4){
            if(vm.selectBillId != '10006003'){
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
    }

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

    /**********************************************************关联采购单处理*************************************************************/
    vm.columnPurchOrder = [
        {   field: "purchaseId",
            displayName: '订单编号',
            enableCellEdit: true,
            width:300,
            enableCellEditOnFocus:true
        },
        {   field: "supplierName",
            displayName: '供应商名称',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "arrivalTime",
            displayName: '应到货时间',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        },
        {   field: "warehouseName",
            displayName: '仓库名称',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {   field: "state",
            displayName: '当前状态',
            enableCellEdit: true,
            width:150,
            enableCellEditOnFocus:true,
            cellTemplate:"<span class='label label-{{row.entityPurchOrder.state==\"0\"?\"primary\":(row.entityPurchOrder.state==\"1\"?\"success\":(row.entityPurchOrder.state==\"2\"?\"default\":(row.entityPurchOrder.state==\"3\"?\"danger\":\"\")))}}' style='display:block;margin: 5px'>{{row.entityPurchOrder.state=='0'?'待审':(row.entityPurchOrder.state=='1'?'审核通过':(row.entityPurchOrder.state=='2'?'驳回':(row.entityPurchOrder.state=='3'?'已取消':'')))}}</span>"
        },
    ]
    vm.getPagePurchOrder = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.paramPurchOrder
        }).success(function(data) {
            vm.dataPurchOrder = data;
        });
    };
    //选中单据号处理
    vm.addRelateBillPurChaseNo = function () {
        if(vm.entityPurchOrder.getSelectedRows().length == 0){
            msgAlert.info('请先选择一条订单...');
            return false;
        }else if(vm.entityPurchOrder.getSelectedRows().length > 1){
            msgAlert.info('每次只能选择一条订单单');
            return false;
        }else{
            $('#selectRelatePurChaseMode').modal('hide');
            $('input[name="supplierId"]').val(vm.entityPurchOrder.getSelectedRows()[0].supplierId);
            $('#id_relatedBillNo1').val(vm.entityPurchOrder.getSelectedRows()[0].purchaseId);
            vm.selectedWareHouseId = vm.entityPurchOrder.getSelectedRows()[0].warehouseId;
        }
    }

    /**********************************************************关联出库单处理*************************************************************/
    vm.columnOutbound = [{
            field: "code",
            displayName: '出库单号',
            enableColumnMenu: false,
            //cellTemplate: '<a ui-sref="wms.outbound.details({id:row.entity.ID})" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
        },{
            field: "OWNER_NAME",
            displayName: '货主'
        },{
            field: "WAREHOUSE_NAME",
            displayName: '发货仓库'
        },{
            field: "EXPECTED_QUANTITY_BU",
            displayName: '订单数量'
        },{
        field: "STATUS",
        displayName: '订单状态',
        cellTemplate:'<div style="padding:5px">{{row.entity.STATUS=="FINISHED"?"完成":(row.entity.STATUS=="DELETE"?"删除":(row.entity.STATUS=="ACTIVE"?"生效":(row.entity.STATUS=="OPEN"?"打开":(row.entity.STATUS=="WORKING"?"作业中":(row.entity.STATUS=="ALLOCATED"?"已分配":"")))))}}</div>'
        }
    ]
    vm.getPageOutbound = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.paramOutbound
        }).success(function(data) {
            vm.dataOutbound = data;
        });
    };

}])
