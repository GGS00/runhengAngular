angular.module('MetronicApp')
    .controller('outboundOrderCtrl',function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        $scope.toFixed2 = function (index) {
            if(typeof(index)=="undefined"){
                return '0.00';
            }
            var num = new Number(index/100);
            return     num.toFixed(2);
        }

        $scope.toFixed3 = function (index) {
            if(typeof(index)=="undefined"){
                return '0';
            }
            var num = new Number(index/1000);
            return     num.toFixed(2);
        }

        var vm = this;
        //加载单据类型
        initBillType();
        vm.billLst = [];
        vm.menuLen = 4;
        /******************************************************************获取出库单表*********************************************************************************/
        vm.column = [{
            field: "ID",
            displayName: 'ID',
            width: '10%',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
            {
                field: 'OWNER_ID',
                displayName: '货主id',
                width: '10%',
                visible: false,
            },
            {
                field: "WAREHOUSE_ID",
                displayName: '仓库id',
                width: '10%',
                visible: false,
            },
            {
                field: "code",
                displayName: '出库单号',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                width: '20%',
                cellTemplate: '<a ui-sref="wms.outbound.details({id:row.entity.ID})" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
            },
            {
                field: "BILL_TYPE_CODE",
                displayName: '单据类型',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.BILL_TYPE_ID)}}</div>'
            },
            {
                field: "WAREHOUSE_NAME",
                displayName: '发货仓库',
                width: '10%'

            }
            ,
            {
                field: "OWNER_NAME",
                displayName: '货主',
                width: '10%'

            },
            {
                field: "URGENT",
                displayName: '是否加急',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{row.entity.URGENT==1?"加急":(row.entity.URGENT==0?"不加急":"")}}</div>'
            },
            {
                field: "STATUS",
                displayName: '订单状态',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{row.entity.STATUS=="FINISHED"?"完成":(row.entity.STATUS=="DELETE"?"删除":(row.entity.STATUS=="ACTIVE"?"生效":(row.entity.STATUS=="OPEN"?"打开":(row.entity.STATUS=="WORKING"?"作业中":(row.entity.STATUS=="ALLOCATED"?"已分配":"")))))}}</div>'

            },
            {
                field: "ALLOCATE_STATUS",
                displayName: '分配状态',
                width: '10%',
                cellTemplate:"<span>{{row.entity.ALLOCATE_STATUS=='OPEN'?'打开':(row.entity.ALLOCATE_STATUS=='ALLOCATED'?'分配完成':(row.entity.ALLOCATE_STATUS=='PART_ALLOCATED'?'部分分配':'未分配'))}}</span>"
            },
            {
                field: "PICK_STATUS",
                displayName: '拣货状态',
                width: '10%',
                cellTemplate:"<span>{{row.entity.PICK_STATUS=='PICKED'?'拣货完成':(row.entity.PICK_STATUS=='OPNE'?'打开':(row.entity.PICK_STATUS=='WORKING'?'工作中':'待拣货'))}}</span>"
            },
            {
                field: "SHIP_STATUS",
                displayName: '发运状态',
                width: '10%',
                cellTemplate:'<span>{{row.entity.SHIP_STATUS=="UN_SHIP"?"待发运":(row.entity.SHIP_STATUS=="PART_SHIPPED"?"部分发运":(row.entity.SHIP_STATUS=="SHIPPED"?"已发运":"-"))}}</span>'

            },
            {
                field: "EXPECTED_QUANTITY_BU",
                displayName: '订单数量',
                width: '10%'
            },
            {
                field: "ALLOCATED_QUANTITY_BU",
                displayName: '分配数量',
                width: '10%'
            },
            {
                field: "PICKED_QUANTITY_BU",
                displayName: '拣货数量',
                width: '10%'
            },
            {
                field: "SHIPPED_QUANTITY_BU",
                displayName: '发货数量',
                width: '10%'
            },
            {
                field: "totalWeight",
                displayName: '货品总吨数',
                width: '10%',
                cellTemplate:"<div style=\"padding:5px\">{{grid.appScope.$parent.toFixed3(row.entity.totalWeight)}}</div>"
            },
            {
                field: "totalMoney",
                displayName: '杂费总金额',
                width: '10%',
                cellTemplate:"<div style=\"padding:5px\">￥{{grid.appScope.$parent.toFixed2(row.entity.totalMoney)}}</div>"
            },
            // {
            //     field: "toReceiverContact.address",
            //     displayName: '优先级',
            //     width: '10%'
            // },
            {
                field: "CREATOR",
                displayName: '创建人',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "CREATED_TIME",
                displayName: '创建时间',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "LAST_OPERATOR",
                displayName: '修改人',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "LAST_OPERATED_TIME",
                displayName: '修改时间',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            }
        ]

        vm.outbound_params = {
            bean: 'wmsOutbound',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.getOutboundPage = function () {

            commonUtil.getList(vm.outbound_params).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.data = data;
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getOutboundPage();

        //添加杂费用
        vm.addOperationFee =function () {
            if(vm.entity.getSelectedRows().length == 0){
                msgAlert.info('请先选择要出库的出库单');
                return false;
            }else if(vm.entity.getSelectedRows().length > 1){
                msgAlert.info('只能选择一条出库单出库');
                return false;
            }
            window.location.href = "#/wms/outbound/order/outFee?id="+vm.entity.getSelectedRows()[0].ID;
        }

        /*********************************************************************获取商品表**********************************************************************/
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
        vm.placeholder_goodsName = '请输入商品名';
        vm.icon_goodsName = 'plus';
        vm.qryUserId = '';  //TODO
        vm.goodsParams = {
            bean: 'goods',
            method: 'pageQryUserSkuLst',
            qryUserId:vm.qryUserId,
            page: 1,
            rows: 10
        }
        vm.getGoodsPage = function () {
            commonUtil.getList(vm.goodsParams).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    vm.goods_data = data;
                } else{
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        };
        vm.getGoodsPage();

        /*********************************************************************获取经销商**********************************************************************/
        vm.dealcolumn = [
            {
                field: 'nickName',
                displayName: '经销商名',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: true,
                suppressRemoveSort: true,
                enableCellEdit: true, // 是否可编辑
            }
        ]
        vm.placeholder_dealer = '请输入经销商';
        vm.icon_dealer = 'plus';

        vm.dealParams = {
            bean: 'user',
            method: 'pageGetUserList',
            page: 1,
            rows: 10,
            userType: 1,

        }
        vm.getdealPage = function () {
            commonUtil.getList(vm.dealParams).success(function (data) {

                if (data.additionalMsg.status == '00' ) {
                    vm.deal_data = data;
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        };
        vm.getdealPage();
        /**************************************************************增加出库单明细*******************************************************************/
        vm.addOutboundDetail = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择一条出库单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能选择一条出运单');
                return false;
            } else if(vm.entity.getSelectedRows()[0].STATUS=="OPEN"){
                $('#selectCommonContacts').modal('show');

            }else {
                msgAlert.info('只能为订单状态为"OPEN"添加货品');
                return false;
            }

        }
        /**************************************************生效出库单*********************************************************************/
        vm.ActiveOutbound = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择一条出库单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能选择一条出库单');
            } else {
                vm.activeParam = {
                    id: vm.entity.getSelectedRows()[0].ID
                }
                BillManage.ActiveOutbound(vm).success(function (data) {

                    if (data.additionalMsg.status == '00') {
                        msgAlert.info('生效出库单成功');
                        vm.getOutboundPage();
                    } else {
                        msgAlert.text('生效出库单失败 >﹏< [' + data.additionalMsg.message + ']');
                    }
                })
            }

        }
        vm.change1 =function (){

            vm.outboundProductCode =  vm.goodsEntity.getSelectedRows()[0].skuId;
            vm.outboundId =  vm.entity.getSelectedRows()[0].ID;
            BillManage.getGoodsMaxNumber(vm).success(function (data) {

                if (data.additionalMsg.status == '00') {

                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }

        /**************************************************失效出库单*********************************************************************/
        vm.invalidOutbound = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择一条出库单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能选择一条出库单');
            } else {
                vm.invalidParam = {
                    id: vm.entity.getSelectedRows()[0].ID
                }
                BillManage.invalidOutbound(vm).success(function (data) {

                    if (data.additionalMsg.status == '00') {
                        msgAlert.info('失效出库单成功');
                        vm.getOutboundPage();
                    } else {
                        msgAlert.text('失效出库单失败 >﹏< [' + data.additionalMsg.message + ']');
                    }
                })
            }

        }
        /**************************************************************增加出库单明细确认*******************************************************************/
        vm.OutboundDetailSure = function () {
            if ($('#id_goods').val() == "") {
                msgAlert.info('请选择商品');
                return false;
            }
            if ($('#id_quantity').val() == "") {
                msgAlert.info('请输入数量');
                return false;
            }
            if ($('#id_intensify').val() == "") {
                msgAlert.info('请选择库存状态');
                return false;
            }
            if ($('#id_deal').val() == "") {
                msgAlert.info('请选择经销商');
                return false;
            }
            if ($('#Id_weight').val() == "") {
                msgAlert.info('请输入重量');
                return false;
            }

            vm.outboundDetail_save = {
                id: vm.entity.getSelectedRows()[0].ID,
                productCode: vm.goodsEntity.getSelectedRows()[0].skuId,
                quantity: $('#id_quantity').val(),
                invStatus: $('#id_intensify').val(),
                supplierId: vm.dealEntity.getSelectedRows()[0].userId,
                weight: $('#Id_weight').val()
            }
            BillManage.SaveOutboundDetail(vm).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    msgAlert.info('添加出库单明细成功');
                    vm.goodsEntity.getSelectedRows()[0].title = "";
                    vm.dealEntity.getSelectedRows()[0].nickName = ""
                    $('#id_goods').val("");
                    $('#id_quantity').val("");
                    $('#id_intensify').val("");
                    $('#id_deal').val("");
                    $("#selectCommonContacts").modal('hide');
                    vm.getOutboundPage();
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            })

        }
        $(function () {
            $('#selectCommonContacts').on('hide.bs.modal', function () {
                if ($('#id_goods').val() != "") {
                    vm.goodsEntity.getSelectedRows()[0].title = "";
                }
                $('#id_goods').val("");
                $('#id_quantity').val("");
                $('#id_intensify').val("");
                if ($('#id_deal').val() != "") {
                    vm.dealEntity.getSelectedRows()[0].nickName = ""
                }
                $('#id_deal').val("");
            })
        });
        /**************************************************************删除出库单***********************************************************************/
        vm.outboundId = "";
        vm.outboundDelete = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择要删除的出库单');
                return false;
            }
            if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('请选择一条要删除的出库单');
                return false;
            }

            vm.outboundId = vm.entity.getSelectedRows()[0].ID;
            vm.outbound_del = {
                id: vm.outboundId
            }
            BillManage.DeleteOutbound(vm).success(function (data) {

                if ( data.additionalMsg.status == '00') {
                    msgAlert.info('删除出库单成功');
                    vm.getOutboundPage();
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }

        vm.toCreateWaybill = function () {
            window.location.href = "#/wms/outbound/order/add";
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
            })};
        vm.ownerPage();
        /*************************************************搜索出库单*******************************************************/
        vm.OutboundFind =function () {
            vm.outbound_params = {
                bean: 'wmsOutbound',
                method: 'page',
                page: 1,
                rows: 10,
                code: $("#code").val(),
                ownerId: $("#ownerId").val(),
                bill_type_id: $("#bill_type_id").val(),
                productName: $("#productName").val(),
                urgent: $("#urgent").val(),
                status: $("#status").val(),
                allocateStatus: $("#allocateStatus").val(),
                pickStatus:$("#pickStatus").val(),
                shipStatus :$("#shipStatus").val(),
                createtime: $('.createtime span').html()
            }
            vm.getOutboundPage();
        }
        /**********************************************************获取单据类型*************************************************************/
        function initBillType() {
            vm.dictTypeName ='出库单据类型';
            BillManage.getBillTypeList(vm).success(function(data) {
                vm.billTypeList = data.rows;
                vm.billLst = data.rows;
            });
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

        //一键生成作业单
        vm.quickPick = function (isAutoPick) {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择一条出库单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能选择一条出库单');
                return false;
            } else if(vm.entity.getSelectedRows()[0].STATUS != 'OPEN'){
                msgAlert.info('出库单已作生效,不能进行一键出库或生成作业单操作');
                return false;
            }else {
                $('#quickPick_id').attr("disabled", true);
                vm.outboundId = vm.entity.getSelectedRows()[0].ID;
                vm.params = {
                    isAutoPick:isAutoPick,
                }
                BillManage.quickPick(vm).success(function (data) {
                    if (data.additionalMsg.status == '00') {
                        msgAlert.info('交易成功');
                        vm.getOutboundPage();
                        $('#quickPick_id').removeAttr("disabled");
                    } else {
                        msgAlert.text('交易失败 >﹏< [' + data.additionalMsg.message + ']');
                        $('#quickPick_id').removeAttr("disabled");
                    }
                });
            }
        }

        //导入出库单
        vm.toImportFile = function () {
            window.location.href = "#/wms/outbound/order/import";
        }


        vm.print = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择一条出库单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能打印一条出库单');
                return false;
            }
            BillManage.getOutboundPrint(vm.entity.getSelectedRows()[0].ID).success(function (data) {
                if(data.status == 00){

                    var typeName = "拣货出库单";
                    var cnt = data.outboundPrintListModel.cnt
                    var wmsOutboundInfo = data.outboundPrintListModel.outbound
                    var wmsOutBoundList = data.outboundPrintListModel.packingList
                    var wmsOutBoundDetailList = data.outboundPrintListModel.uniqueCodeList
                    vm.ifPrintSerial = false;
                    // 动态生成打印表格页面代码
                    var innerHtml = "<table  style='width: 94.5%;font-size: 12px;' border='1' cellSpacing=0 cellPadding=1 >"
                        + "<thead style='height: 60px;font-size: large;width: 90%'>" + "<tr>"
                        + "<th colspan='10' align='center'><b>柴米云仓  " + typeName + "</b></th>" + "</tr>" + "</thead>"
                        + "<tbody>" + "<tr align='left' >" + "<th colspan='2' >出库订单号:</th>" + "<td colspan='3'>"
                        + (wmsOutboundInfo.code == null ? "-" : wmsOutboundInfo.code) + "</td>"
                        + "<th colspan='2'>运单号:</th>" + "<td colspan='3'>"
                        + (wmsOutboundInfo.wayBillCode == null ? "-" : wmsOutboundInfo.wayBillCode)
                        + "<input id='barcodeId' type='hidden' value='" + wmsOutboundInfo.wayBillCode + "'> </td>"
                        + "</tr>" + "<tr align='left'>" + "<th colspan='2'>货主:</th>" + "<td colspan='3'>"
                        + (wmsOutboundInfo.ownerName == null ? "-" : wmsOutboundInfo.ownerName) + "</td>"
                        + "<th colspan='2'>日期:</th>" + "<td colspan='3'>"
                        + (wmsOutboundInfo.orderTime == null ? "-" : wmsOutboundInfo.orderTime) + "</td>"
                        + "</tr>" + "<tr align='left'>" + "<th colspan='2'>客户名称:</th>" + "<td colspan='3'>"
                        + (wmsOutboundInfo.receiverName == null ? "-" : wmsOutboundInfo.receiverName)
                        + "</td>" + "<th colspan='2'>出库数量:</th>" + "<td colspan='3'>" + cnt + "</td>" + "</tr>"
                        + "<tr align='left'>" + "<th colspan='2'>地址:</th>" + "<td colspan='3'>"
                        + (wmsOutboundInfo.receiverAddress == null ? "-"
                            :wmsOutboundInfo.receiverAddress )
                        + "</td>" + "<th colspan='2'>箱数:</th>" + "<td colspan='3'>" + "-" + "</td>" + "</tr>"
                        + "<tr align='left'>" + "<th colspan='2'>联系人:</th>" + "<td colspan='3'>"
                        + (wmsOutboundInfo.receiverName == null ? "-" : wmsOutboundInfo.receiverName)
                        + "</td>" + "<th colspan='2'>电话:</th>" + "<td colspan='3'>"
                        + (wmsOutboundInfo.receiverMobile== null ? "-"
                            : wmsOutboundInfo.receiverMobile)
                        + "</td>" + "</tr>" + "<tr align='left'>" + "<th>备注:</th>" + "<td colspan='5' style='height: 30px;'>"
                        + (wmsOutboundInfo.description == null ? "-" : wmsOutboundInfo.description) + "</td>"
                        + "<th>代收货款:</th>" + "<td colspan='2'><b>" + wmsOutboundInfo.unReceicePayAmount + "元</b></td>"
                        + "</tr>" + "<tr>" + "<th colspan='10' align='center' style='height: 40px;'><b>订单详情</b></th>" + "</tr>"
                        + "<tr align='center'>" + "<th colspan='3'>货物品牌</th>" + "<th colspan='4'>货品名称</th>"
                        + "<th colspan='3'>数量</th>" + "</tr>";
                    for(var i = 0; i < wmsOutBoundList.length; i++) {
                        var map = wmsOutBoundList[i];
                        innerHtml += "<tr align='center'>" + "<td colspan='3'>"
                            + (map.brand == null ? "-" : map.brand) + "</td>" + "<td colspan='4'>"
                            + (map.name == null ? "-" : map.name) + "</td>" + "<td colspan='3'>"
                            + (map.quantity_bu == null ? "0" : map.quantity_bu ) + "</td>" + "</tr>";
                    }

                    // 打印串号明细并且存在串号设备
                    if ("true" == vm.ifPrintSerial && wmsOutBoundDetailList.length > 0) {
                        innerHtml += "<tr>" + "<th align='center' colspan='8' style='height: 40px;'>串号明细</th>" + "</tr>"
                            + "<tr align='center'>" + "<th>序号</th>" + "<th>品牌</th>" + "<th>货品名称</th>" + "<th>序列号</th>"
                            + "<th>序号</th>" + "<th>品牌</th>" + "<th>货品名称</th>" + "<th>序列号</th></tr><tr>";
                        for (var i = 0; i < wmsOutBoundDetailList.length; i++) {
                            var map = wmsOutBoundDetailList[i];
                            if ((i + 1) % 2 == 0) {
                                innerHtml += "<td>" + (i + 1) + "</td>" + "<td>"
                                    + (map.brand == null ? "-" : map.brand) + "</td>" + "<td>"
                                    + (map.name == null ? "-" : map.name) + "</td><td>"
                                    + (map.serial_no == null ? "-" : map.serial_no) + "</td>" + "</tr>";
                            }
                            else {
                                innerHtml += "<tr align='center'>" + "<td>" + (i + 1) + "</td>" + "<td>"
                                    + (map.brand == null ? "-" : map.get("brand")) + "</td>" + "<td>"
                                    + (map.name == null ? "-" : map.name) + "</td><td>"
                                    + (map.serial_no == null ? "-" : map.serial_no) + "</td>";
                            }
                        }

                        if (wmsOutBoundDetailList.length % 2 != 0) {
                            innerHtml += "<td></td><td></td><td></td><td></td></tr>";
                        }
                    }
                    innerHtml += "</tbody>" + "<tfoot style='margin-top: 90%'>" + "<tr align='right'>"
                        + "<th colspan='7' style='height: 30px;'><b>签字盖章：</b>&nbsp;&nbsp;&nbsp;</th>" + "<th colspan='1'></th>"
                        + "</tr>" + "</tfoot>" + "</table>";

                    LODOP.PRINT_INIT("");
                    LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW",true);
                    LODOP.SET_PRINT_PAGESIZE (1, 0, 0,"A4");
                    LODOP.ADD_PRINT_TABLE(150,27,664,880,innerHtml);
                    // LODOP.ADD_PRINT_BARCODE(70,"74%",170,45,"128A",barcodeId);
                    LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
                    LODOP.PREVIEW()

                }
            });

        }




    });



