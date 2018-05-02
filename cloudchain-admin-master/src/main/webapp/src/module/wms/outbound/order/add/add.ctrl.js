angular.module('MetronicApp')
//新建出库单
.controller('outboundAddCtrl', ['$rootScope', '$scope', '$http', '$location', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table','Goods', 'suppServer',function ($rootScope, $scope, $http, $location, uiGridConstants, settings, BillManage, commonUtil, Table,Goods,suppServer) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.ownerId = "";
    vm.showSwitch= 0;
    vm.relatedBillNo1_switch = 0;  //关联单据号显示开关
    vm.receive_wareHouse_switch = 0;
    vm.id_receiver_switch = 1;
    vm.qryAddresUserId = '';
    vm.qryAddrType = '';
    vm.selectBillId = '';
    vm.pageParams = {
        bean:'wmsOutboundItem',
        method:'page',
        page:1,
        outboundId: vm.outboundId,
        rows:10
    }
    vm.column = [ {  field: "ID",
        displayName: 'ID',
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {  field: "lineNo",
            displayName: '行号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
        { field: 'PRODUCT_ID',
            displayName: '货品代码',
        },
        {  field: "PRODUCT_NAME",
            displayName: '货品名称',
        },

        {  field: "expectedQuantityBU",
            displayName: '数量',
        },
        {  field: "SUPPLIER_NAME",
            displayName: '供应商',
        },
        {  field: "inventoryStatus",
            displayName: '库存状态',
            cellTemplate:'<div style="padding:5px">{{row.entity.inventoryStatus=="GOOD"?"良品":(row.entity.inventoryStatus=="BAD"?"不良品":"")}}</div>'
        }
    ]
    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function (data) {

            if ( data.additionalMsg.status == '00') {
                vm.data = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };

    /*************************************************************获取货主信息************************************************************************************/
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
    vm.placeholder_ownerName = '请选择货主';
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
        })
    };
    vm.ownerPage();
    /**********************************************************获取收发货仓库*************************************************************/
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
    vm.placeholder_warehouseName = '请选择出货仓库';
    vm.placeholder_warehouseInName = '请选择收货仓库';
    vm.icon_warehouse = 'plus';
    vm.warehouseParams = {
        bean: 'wmsWarehouse',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.warehousePage = function () {
        commonUtil.getList(vm.warehouseParams).success(function (data) {
            if (data.additionalMsg.status == '00') {
                vm.warehouseData = data;
                vm.warehouseInData = data;
            } else  {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };
    vm.warehousePage();

    //取消按钮
    vm.toTmsOrder = function () {
        window.history.back(-1);
    }

    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }
    /*******************************************************************新增出库单明细***********************************************************************/
    vm.qryGoods = function () {
        //更新商品列表
        if(vm.dealEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择供应商信息');
            return false;
        }else if(vm.ownerId != vm.dealEntity.getSelectedRows()[0].userId){
            vm.goodsParams = {
                bean: 'gmsSupplier',
                method: 'pageGetSupplierSkuList',
                qryType:'03',
                supplierId:vm.dealEntity.getSelectedRows()[0].userId,
                page: 1,
                rows: 10
            }
            vm.goodsParams.cId = $scope.cIds
            vm.goodsParams.title = $scope.skuName
        }else {
            vm.goodsParams = {
                bean: 'goods',
                method: 'pageQryUserSkuLst',
                qryUserId:vm.ownerId,
                page: 1,
                rows: 10
            }
            vm.goodsParams.cId = $scope.cIds
            vm.goodsParams.title = $scope.skuName
        }

        vm.getGoodsPage();
    }

    vm.goodscolumn = [
        {
            field: 'skuId',
            displayName: '商品id',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            visible: false,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "title",
            displayName: '商品名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.addOutboundDetail = function () {
        if(vm.httpId == '' || vm.httpId == undefined){
            msgAlert.text('请填写入库单基础信息,并点击确定按钮创建入库单...');
            return false;
        }else {
            vm.showSwitch = 1;
            /*********************************************************************获取供应商**********************************************************************/
            vm.dealcolumn = [
                {
                    field: 'nickName',
                    displayName: '供应商名',
                    enableColumnMenu: false,// 是否显示列头部菜单按钮
                    enableHiding: true,
                    suppressRemoveSort: true,
                    enableCellEdit: true, // 是否可编辑
                }
            ]
            vm.placeholder_dealer = '请输入供应商';
            vm.icon_dealer = 'plus';

            vm.dealParams = {
                bean:'user',
                method:'pageOUsersByUserId',
                qryUserId:vm.ownerEntity.getSelectedRows()[0].userId,
                userType:4,
                ownerType:2,
                isSupply:'1',
                page:1,
                rows:10
            }
            vm.placeholder_goodsName = '请输入商品名';
            vm.icon_goodsName = 'plus';


            vm.httpName = 'wmsOutboundItem/getInv';

            vm.getdealPage();
            $('#selectCommonContacts').modal('show');
        }

    }
    /*********************************************************************获取商品表**********************************************************************/
    vm.getdealPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.dealParams
        }).success(function (data) {

            if (data.additionalMsg.status == '00' ) {
                vm.deal_data = data;
            } else  {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };

    vm.getGoodsPage = function () {
        if(vm.dealEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择供应商信息');
            return false;
        }else if(vm.ownerId != vm.dealEntity.getSelectedRows()[0].userId){
            vm.goodsParams = {
                bean: 'gmsSupplier',
                method: 'pageGetSupplierSkuList',
                qryType:'03',
                supplierId:vm.dealEntity.getSelectedRows()[0].userId,
                page: 1,
                rows: 10
            }
            vm.goodsParams.cId = $scope.cIds
            vm.goodsParams.title = $scope.skuName
        }else {
            vm.goodsParams = {
                bean: 'goods',
                method: 'pageQryUserSkuLst',
                qryUserId:vm.ownerId,
                page: 1,
                rows: 10
            }
            vm.goodsParams.cId = $scope.cIds
            vm.goodsParams.title = $scope.skuName
        }
        commonUtil.getList(vm.goodsParams).success(function (data) {
            if (data.additionalMsg.status == '00') {
                vm.goods_data = data;
            } else{
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });

    };
    /*********************************************************选择商品对话框***********************************************************/
    vm.aaaa =function () {
        $('#lar11ge').modal('show');
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
                    vm.goodsParams.cId = $scope.cIds,
                        vm.getGoodsPage()
                }
            }
        });
    })
    vm.serachGoods = function () {
        vm.getGoodsPage()
    }
    vm.overClick = function () {
        if(vm.goodsEntity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择至少一条商品');
            return false;
        }else  if(vm.goodsEntity.getSelectedRows().length > 1) {
            msgAlert.info('不能选择多条商品');
            return false;
        }else {
            $("#goods1").val(vm.goodsEntity.getSelectedRows()[0].title);
            $('#lar11ge').modal('hide');
        }
    }
    /**************************************************************增加出库单明细确认*******************************************************************/
    vm.OutboundDetailSure = function () {
        if($("#id_deal").val()==""){
            msgAlert.info('请先选择供应商');
            return false;
        }
        if ($('#goods1').val() == "请选择商品") {
            msgAlert.info('请选择商品');
            return false;
        }
        if ($('#id_quantity').val() == "") {
            msgAlert.info('请输入数量');
            return false;
        }
        if ($('#id_instock').val() == "") {
            msgAlert.info('请选择库存状态');
            return false;
        }
        vm.outboundDetail_save = {
            id: vm.httpId,
            productCode: vm.goodsEntity.getSelectedRows()[0].skuId,
            quantity: $('#id_quantity').val(),
            invStatus: $('#id_instock').val(),
            supplierId: vm.dealEntity.getSelectedRows()[0].userId,
            goodsName:vm.goodsEntity.getSelectedRows()[0].title
        }
        BillManage.SaveOutboundDetail(vm).success(function (data) {

            if (data.additionalMsg.status == '00') {
                msgAlert.info('添加出库单明细成功');
                $('#selectCommonContacts').modal('hide');
                vm.pageParams = {
                    bean: 'wmsOutboundItem',
                    method: 'page',
                    page: 1,
                    rows: 10,
                    outboundId:vm.httpId
                }
                vm.getPage();
                $('input[name="totalBU"]').val(data.totalBU);
                $('#id_quantity').val("");
                $('#id_instock').val("GOOD");
                $('#goods1').val("请选择商品");
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        })

    }

    /*******************************************************************新增出库单-保存操作***********************************************************************/
    vm.ownerId = "";
    vm.billType = "";
    vm.mark_1 = "";
    vm.warehouseId = "";
    vm.description = "";
    vm.SaveOutbound = function (func) {
        if ($('#id_owner').val() == "") {
            msgAlert.info('请选择货主');
            return false;
        }
        if ($('#id_billType').val() == "") {
            msgAlert.info('请选择单据类型');
            return false;
        }
        if ($('#id_intensify').val() == "") {
            msgAlert.info('请选择加急关系');
            return false;
        }
        if ($('#id_warehouse').val() == "") {
            msgAlert.info('请选择出货仓库');
            return false;
        }
        if($('#id_warehouse_receive').val() != '' && $('#id_warehouse_receive').val() == $('#id_warehouse').val()){
            msgAlert.info('调拨出库时,收货仓库与发货仓库不能相同...');
            return false;
        }
        vm.ownerId = vm.ownerEntity.getSelectedRows()[0].userId;
        vm.ownerNmae = vm.ownerEntity.getSelectedRows()[0].nickName;
        vm.billType = $('#id_billType').val();
        vm.mark_1 = $('#id_intensify').val();
        if(vm.billType == '10007005'){
            if($('#id_warehouse_receive').val() == ''){
                msgAlert.info('调拨出库时,请选择收货仓库');
                return false;
            }else if($('#id_warehouse_receive').val() == $('#id_warehouse').val()){
                msgAlert.info('调拨出库时,收货仓库与发货仓库不能相同...');
                return false;
            }
            //收货人信息
            vm.receiverName = vm.warehouseInEntity.getSelectedRows()[0].CONTROLLER;
            vm.receiverMobile = vm.warehouseInEntity.getSelectedRows()[0].TEL;
            vm.receiverProvince = vm.warehouseInEntity.getSelectedRows()[0].PROVINCE_NAME;
            vm.receiverCity = vm.warehouseInEntity.getSelectedRows()[0].CITY_NAME;
            vm.receiverDistrict = vm.warehouseInEntity.getSelectedRows()[0].DISTRICT_NAME;
            vm.receiverAddress = vm.warehouseInEntity.getSelectedRows()[0].ADDRESS;
        }
        if($('#id_receiver').val() == ""){
            if(vm.ownerEntity.getSelectedRows()[0].userType == '0' && vm.billType == '10007001'){
                $('#id_receiver').val('-');
            }else {
                msgAlert.info('请选择收货信息.');
                return false;
            }
        }

        vm.warehouseId = $('#id_warehouse').val()
        vm.description = $('#id_description').val();
           
        vm.outbound_save = {
            description: vm.description,
            warehouseId: vm.warehouseId,
            ownerId: vm.ownerId,
            ownerNmae:vm.ownerNmae,
            mark_1: vm.mark_1,
            billType: vm.billType,
            receiverName:vm.receiverName,
            receiverMobile:vm.receiverMobile,
            receiverProvince:vm.receiverProvince,
            receiverCity:vm.receiverCity,
            receiverDistrict:vm.receiverDistrict,
            receiverName:vm.receiverName,
            receiverAddress:vm.receiverAddress,
            relatedBillNo1:$('#id_relatedBillNo1').val(),
            relatedInfo4:$('#id_warehouse_receive').val()
        }
        BillManage.NewOutbound(vm).success(function (data) {
            if ( data.additionalMsg.status == '00') {
                msgAlert.info('添加出库单成功');
                vm.httpId = data.id;
                $('input[name="outboundId"]').val(data.id);
                $('input[name="outboundCode"]').val(data.code);
                $("#inboundConfirmButton").hide();
                $("#inboundCancelButton").hide();

                $('#id_receiver').attr('disabled','true');
                $('#id_description').attr('disabled','true');
                $('#id_intensify').attr('disabled','true');
                $('#id_billType').attr('disabled','true');
                $('#id_relatedBillNo1').attr('disabled','true');
                vm.outboundId = data.id;

                vm.pageParams = {
                    bean: 'wmsOutboundItem',
                    method: 'page',
                    page: 1,
                    rows: 10,
                    outboundId:vm.outboundId
                }
                vm.getPage();
            } else  {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    }

    /*******************************************************************新增一键出库单***********************************************************************/
    vm.oneBtnOutbound = function () {
        $('#selectPdtKeyInvMode').modal('show');

        vm.paramInv = {
            ownerId:vm.ownerId,
            wareHouseId:vm.warehouseId,
            bean:'wmsInventory',
            method:'pageProductKeyInvent',
            page:1,
            rows:10
        }
        vm.getPageInv();
    }
    vm.columnInv = [
        {  field: "product_key_id",
            displayName: '批次编号',
            width: '8%',
            visible: false,
        },
        {  field: "code",
            displayName: '相关单号',
            width: '15%',
            cellTemplate: '<a ng-click="grid.appScope.$parent.qryDetail(row.entity)" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
        },
        {   field: "skuName",
            displayName: '商品名称',
            width: '8%'
        },
        {  field: "owner_id",
            displayName: '货主ID',
            width: '8%',
            visible: false,
        },
        {  field: "ownerName",
            displayName: '货主',
            width: '8%',
            visible: false,
        },
        {   field: "supplier_id",
            displayName: '供应商ID',
            width: '8%',
            visible: false,
        },
        {   field: "supplierName",
            displayName: '供应商',
            width: '8%'
        },
        {   field: "moved_quantity_bu",
            displayName: '上架数量',
            width: '10%',
            visible: false,
            cellTemplate:'<div style="padding:5px">{{row.entity.shelveType!="MV_OWNER"?row.entity.moved_quantity_bu:"-"}}</div>'
        },
        {   field: "inventory",
            displayName: '库存数量',
            width: '10%'
        },
        {   field: "freezeInventory",
            displayName: '冻结数量',
            width: '10%'
        },
        {   field: "wareHouseName",
            displayName: '仓库',
            width: '8%',
            visible: false,
        },
        {   field: "areaName",
            displayName: '库区',
            width: '8%'
        },
        {   field: "locName",
            displayName: '库位',
            width: '8%'
        },
        {   field: "dest_location_id",
            displayName: '库位ID',
            width: '8%',
            visible: false,
        },
        {   field: "skuId",
            displayName: '商品编号',
            width: '8%',
            visible: false,
        },
        {   field: "locMark",
            displayName: '是否良品',
            width: '8%',
            cellTemplate:'<div style="padding:5px">{{row.entity.locMark==0?"良品":(row.entity.locMark==1?"不良品":row.entity.locMark)}}</div>'
        },
    ]
    vm.getPageInv = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params:vm.paramInv
        }).success(function(data) {
            vm.dataInv = data;
        })
    }
    /*******************************************************************新增一键出库单***********************************************************************/

    /**********************************************************获取收货人*************************************************************/
    vm.columnContact = [
        {   field: "contactName",
            displayName: '联系人',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "mobile",
            displayName: '联系电话',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "address",
            displayName: '联系地址',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.provinceName+row.entity.cityName+row.entity.countyName+row.entity.address}}</div>'
        }
    ]
    vm.choseContacts = function(){
        if(vm.qryAddresUserId == ''){
            msgAlert.info('请先选择货主信息和单据信息');
            return false;
        }
        $('#selectCommonAddress').modal('show');
        //避免重复调后台
        if(vm.addresUserId != vm.qryAddresUserId){
            vm.addresUserId = vm.qryAddresUserId;
            /*常用地址*/
            vm.pageParamsContact = {
                bean:'umsAddress',
                method:'page',
                qryUserId:vm.addresUserId,
                addrType:vm.qryAddrType,
                page:1,
                rows:10
            }

            vm.getPageContact = function () {
                $http({
                    url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
                    params: vm.pageParamsContact
                }).success(function(data) {
                    vm.dataContact = data;
                });
            };
            vm.getPageContact();
        }
    }
    //添加收获地址信息
     vm.addUserAddress = function () {
         $('#addReceiptDetail').modal('show');


     }

     //添加收获地址信息确认
    var mobilereg = /^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;
     vm.addReceiptDetailSure  = function () {
         if( $("#id_contactsa").val()==undefined|| $("#id_contactsa").val()==""){
             msgAlert.text('请输入收获人姓名');
             return ;
         }
         if( $("#id_ctsphone").val()!=undefined|| $("#id_ctsphone").val()!=""){
             if ($("#id_ctsphone").val().match(mobilereg) == null) {
                 msgAlert.text('请输入正确格式的手机号码');
                 return;
             }
         }else {
             msgAlert.text('手机号码不能为空');
             return;
         }
         if( $("#id_addressa").val()==undefined|| $("#id_addressa").val()==""){
             msgAlert.text('请输入收获人地址');
             return ;
         }

         vm.addrParams ={
             addrTypes:vm.qryAddrType,
             contactName :$("#id_contactsa").val(),
             mobile : $("#id_ctsphone").val(),
             province :$('.provideAddress2').find('.selectPro :selected').val().substr(7),
             provinceName : $('.provideAddress2').find('.selectPro :selected').html(),
             city :$('.provideAddress2').find('.selectCity :selected').val().substr(7),
             cityName:$('.provideAddress2').find('.selectCity :selected').html(),
             county :$('.provideAddress2').find('.selectArea :selected').val().substr(7),
             countyName : $('.provideAddress2').find('.selectArea :selected').html(),
             address :$("#id_addressa").val(),
         }
         suppServer.addUserAddress(vm.addresUserId, vm.addrParams).success(function (data) {
             if (data.status == '00') {
                 $('#addReceiptDetail').modal('hide');
                 msgAlert.text('添加成功');
                 vm.getPageContact();

             } else {
                 msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
             }
         });
     }
    vm.addAddress = function() {
        if (vm.entityContact.getSelectedRows().length == 0) {
            msgAlert.info('请先选择一条收货信息');
            return false;
        } else if (vm.entityContact.getSelectedRows().length > 1) {
            msgAlert.info('只能选用一条收货信息');
            return false;
        }else{
            $('#selectCommonAddress').modal('hide');
            $('#id_receiver').val(vm.entityContact.getSelectedRows()[0].contactName+'/'+vm.entityContact.getSelectedRows()[0].mobile+'/'+vm.entityContact.getSelectedRows()[0].address);
            vm.receiverId = vm.entityContact.getSelectedRows()[0].addressId;
            vm.receiverName = vm.entityContact.getSelectedRows()[0].contactName;
            vm.receiverMobile = vm.entityContact.getSelectedRows()[0].mobile;
            vm.receiverProvince = vm.entityContact.getSelectedRows()[0].provinceName;
            vm.receiverCity = vm.entityContact.getSelectedRows()[0].cityName;
            vm.receiverDistrict = vm.entityContact.getSelectedRows()[0].countyName;
            vm.receiverAddress = vm.entityContact.getSelectedRows()[0].address;
        }
    }
    /**********************************************************单据类型处理*************************************************************/
    initial();
    function initial() {
        vm.dictTypeName ='出库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
            vm.selectedOption = '10007001';
        });
    }
    //单据类型选择监听
    vm.selectClickAction = function () {
        if(vm.ownerEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择货主信息');
            return false;
        }else {
            vm.userType = vm.ownerEntity.getSelectedRows()[0].userType;
        }
        if(vm.ownerId != '' && vm.ownerId != vm.ownerEntity.getSelectedRows()[0].userId){
            //货主重选
            $('#id_relatedBillNo1').val('');
            $('#id_warehouse').val('');
            $('#id_receiver').val('');
        }
        vm.ownerId = vm.ownerEntity.getSelectedRows()[0].userId;
        vm.qryAddresUserId = vm.ownerEntity.getSelectedRows()[0].userId;
        if(vm.userType == 4){
            //普通货主,单据类型默认
            vm.selectedOption = '10007001';
            vm.relatedBillNo1_switch = 0;
            vm.qryAddrType = '100';
        }else {
            vm.qryAddrType = '111';
        }
    }
    $('#id_billType').change(function () {
        //获取单据ID 并判断单据类型
        vm.selectBillId = $('#id_billType').val();
        if(vm.userType == 4){
            if(vm.selectBillId != '10007001'){
                msgAlert.info('普通货主单据类型只能选择默认出库');
                return false;
            }
        }
        if(vm.selectBillId=='10007004'){
            vm.relatedBillNo1Title = '请选择对应采购入库单';
            vm.relatedBillNo1_switch = 1;
        }else if(vm.selectBillId=='10007002'){
            vm.relatedBillNo1Title = '请选择对应销售订单';
            vm.relatedBillNo1_switch = 1;
        }else if(vm.selectBillId=='10007003'){
            vm.relatedBillNo1Title = '请选择对应铺仓入库单';
            vm.relatedBillNo1_switch = 1;
        }else if(vm.selectBillId=='10007005'){ //调拨出库
            $('#id_warehouse_receive').val('')
            vm.relatedBillNo1_switch = 0;
            vm.receive_wareHouse_switch = 1;
            //$('#id_receiver').attr('disabled','true');
            $('#id_receiver').val('-');
            vm.id_receiver_switch = 0;
        }else {
            vm.relatedBillNo1_switch = 0;
        }
    });
    //关联单据选择
    vm.qryRelateBillNo = function () {
        if(vm.ownerEntity.getSelectedRows().length == 0){
            msgAlert.info('请先选择货主信息');
            return false;
        }else {
            vm.qryUserId = vm.ownerEntity.getSelectedRows()[0].userId;
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
        if(vm.selectBillId=='10007002'){
            $('#searchRelateNo').attr('placeholder','销售订单编号');
        }else if(vm.selectBillId=='10007004'){
            $('#searchRelateNo').attr('placeholder','采购入库单编号');
            vm.paramRelateOrder = {
                bean:'omsPurchaseOrder',
                method:'pageGetPurchaseOrder',
                page:1,
                rows:10
            }
            vm.getPageRelateOrder();
        }else if(vm.selectBillId=='10007003'){
            $('#searchRelateNo').attr('placeholder','铺仓入库单编号');
            $('#selectRelateInboundMode').modal('show');
            //避免重复调用
            if(vm.ownerId != vm.qryInboundUserId){
                vm.qryInboundUserId = vm.ownerId;
                vm.paramInbound = {
                    bean:'wmsInbound',
                    method:'page',
                    ownerId:vm.qryInboundUserId,
                    billType:'10006002', //铺仓入库
                    page:1,
                    rows:10
                }
                vm.getPageInbound();
            }
        }
    }
    vm.columnRelateOrder = [
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
            cellTemplate:"<span class='label label-{{row.entity.state==\"0\"?\"primary\":(row.entity.state==\"1\"?\"success\":(row.entity.state==\"2\"?\"default\":(row.entity.state==\"3\"?\"danger\":\"\")))}}' style='display:block;margin: 5px'>{{row.entity.state=='0'?'待审':(row.entity.state=='1'?'审核通过':(row.entity.state=='2'?'驳回':(row.entity.state=='3'?'已取消':'')))}}</span>"
        },
    ]
    vm.getPageRelateOrder = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.paramRelateOrder
        }).success(function(data) {
            vm.dataRelateOrder = data;
        });
    };
    //选中单据号处理
    vm.addRelateBillNo = function () {
        if(vm.entityRelateOrder.getSelectedRows().length == 0){
            msgAlert.info('请先选择一条订单');
            return false;
        }else if(vm.entityRelateOrder.getSelectedRows().length > 1){
            msgAlert.info('每次只能选择一条订单单');
            return false;
        }else{
            $('#selectRelateBillMode').modal('hide');
            $('#id_relatedBillNo1').val(vm.entityRelateOrder.getSelectedRows()[0].purchaseId);
        }
    }

    /**********************************************************关联铺仓入库单处理*************************************************************/
    vm.columnInbound = [{
        field: "code",
        displayName: '入库单号',
        //cellTemplate: '<a ui-sref="wms.inbound.details({id:row.entity.id})" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
    },{
        field: "owner.nickName",
        displayName: '货主'
    },{
        field: "warehouse.name",
        displayName: '仓库',
    },{
        field: "status",
        displayName: '状态',
        cellTemplate:'<div style="padding:5px">{{row.entity.status=="OPEN"?"打开":(row.entity.status=="WORKING"?"工作中":(row.entity.status=="ACTIVE"?"生效":(row.entity.status=="FINISHED"?"完成":(row.entity.status=="DELETE"?"删除":row.entity.status))))}}</div>'
    },{
        field: "supplier.nickName",
        displayName: '供应商'
    },{
        field: "expectedQuantityBU",
        displayName: '总期待数量'
    },{
            field: "receivedQuantityBU",
            displayName: '实际收货数量'
     },{
        field: "description",
        displayName: '描述',
        width: '10%',
        enableCellEdit: true,
        enableCellEditOnFocus: true
    }
    ]
    vm.getPageInbound = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.paramInbound
        }).success(function(data) {
            vm.dataInbound = data;
        });
    };
    //选中入库单号处理
    vm.addRelateInboundNo = function () {
        if(vm.entityInbound.getSelectedRows().length == 0){
            msgAlert.info('请先选择一条订单');
            return false;
        }else if(vm.entityInbound.getSelectedRows().length > 1){
            msgAlert.info('每次只能选择一条订单单');
            return false;
        }else if(vm.entityInbound.getSelectedRows()[0].status != 'FINISHED'){
            msgAlert.info('入库单尚未完成');
            return false;
        }else {
            $('#selectRelateInboundMode').modal('hide');
            $('#id_relatedBillNo1').val(vm.entityInbound.getSelectedRows()[0].code);
            $('#id_warehouse').val(vm.entityInbound.getSelectedRows()[0].warehouse.id);
            vm.qryAddresUserId = vm.entityInbound.getSelectedRows()[0].supplier.userId;
            vm.qryAddrType = '111';
        }
    }
}]);
