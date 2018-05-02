//新建调拨单
angular.module('MetronicApp')
    .controller('requisitionAddCtrl', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table,Goods) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.pageParams = {
            bean:'wmsRequisitionItem',
            method:'page',
            page:1,
            requisitionId: vm.requisitionId,
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
            userType: 4,
            ownerType: 1
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
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        };
        vm.warehousePage();

     /*******************************************************新建调拨单******************************************************/
        vm.SaveOutbound = function (func) {
            if ($('#id_owner').val() == "") {
                msgAlert.info('请选择货主');
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
            if($('#id_warehouse_receive').val() == ''){
                msgAlert.info('调拨出库时,请选择收货仓库');
                return false;
            }else if($('#id_warehouse_receive').val() == $('#id_warehouse').val()){
                msgAlert.info('调拨出库时,收货仓库与发货仓库不能相同...');
                return false;
            }

            vm.ownerId = vm.ownerEntity.getSelectedRows()[0].userId,
            vm.warehouseId = $('#id_warehouse').val();
            vm.description = $('#id_description').val();
            vm.extendProp1 =  $('#id_warehouse_receive').val();
            vm.params = {
                description: vm.description,
                warehouseId: vm.warehouseId,
                ownerId:vm.ownerId,
                extendProp1:vm.extendProp1,
                extendProp2: $('#id_warehouseName').val(),
                extendProp3 : $('#id_warehouse_receiveName').val(),
            }
            BillManage.wmsRequisitionAdd(vm).success(function (data) {
                if ( data.status == '00') {
                    msgAlert.info('添加调拨单成功');
                    vm.requisitionId = data.obj.id;
                    $("#inboundConfirmButton").hide();
                    $("#inboundCancelButton").hide();
                    $('#id_description').attr('disabled','true');
                    vm.pageParams = {
                        bean: 'wmsRequisitionItem',
                        method: 'page',
                        page: 1,
                        rows: 10,
                        requisitionId:vm.requisitionId
                    }
                    vm.getPage();
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            })
        }
        
        vm.addOutboundDetail = function () {
            if(vm.requisitionId == '' || vm.requisitionId == undefined){
                msgAlert.text('请先创建调拨单...');
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
        $scope.cIds ="";
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

        vm.qryGoods = function () {
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

        //返回按钮
        vm.returnButton = function () {
            window.history.back();
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
            vm.params = {
                requisitionId:vm.requisitionId,
                productId: vm.goodsEntity.getSelectedRows()[0].skuId,
                expectedQuantityBu:$('#id_quantity').val(),
                inventoryStatus: $('#id_instock').val(),
                supplierId: vm.dealEntity.getSelectedRows()[0].userId,
                extendProp1:vm.goodsEntity.getSelectedRows()[0].title
            }
            BillManage.wmsRequisitionItemAdd(vm).success(function (data) {

                if (data.status == '00') {
                    msgAlert.info('添加调拨单明细成功');
                    $('#selectCommonContacts').modal('hide');
                    vm.getPage();
                    $('#id_quantity').val("");
                    $('#id_instock').val("GOOD");
                    $('#goods1').val("请选择商品");
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            })

        }


    });


