angular.module('MetronicApp')
    .controller('requisitionCtrl', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        /******************************************************************获取调拨单表*********************************************************************************/
        vm.column = [{
            field: "ID",
            displayName: 'ID',
            width: '10%',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        }, {
            field: "code",
            displayName: '调拨单号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: '20%',
            cellTemplate: '<a ui-sref="wms.outbound.requisitionDetail({id:row.entity.ID})" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
        },
            {
                field: "ownerId",
                displayName: '货主id',
                width: '10%',
                visible: false,
            },
            {
                field: "warehouseId",
                displayName: '仓库id',
                width: '10%',
                visible: false,
            },
            {
                field: "expectedQuantityBu",
                displayName: '调拨数量',
                width: '10%',
            },
            {
                field: "description",
                displayName: '描述',
                width: '10%',
            },
            {
                field: "warehouseName",
                displayName: '仓库名称',
                width: '10%',
            },
            {
                field: "ownerName",
                displayName: '货主名称',
                width: '10%'
            },
            {
                field: "status",
                displayName: '调拨单状态',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{row.entity.status=="0"?"打开":(row.entity.status=="1"?"待出库":(row.entity.status=="2"?"出库中":(row.entity.status=="3"?"待入库":(row.entity.status=="4"?"入库中":(row.entity.status=="5"?"完成":"失效")))))}}</div>'

            },
            {
                field: "creator",
                displayName: '创建人',
                width: '10%',
            },  {
                field: "inboundCode",
                displayName: '入库单编号',
                width: '10%',
            },  {
                field: "outboundCode",
                displayName: '出库单编号',
                width: '10%',
            },  {
                field: "outboundFinishTime",
                displayName: '出库单结束时间',
                width: '10%',
            },  {
                field: "inboundFinishTime",
                displayName: '入库单结束时间',
                width: '10%',
            },

            {
                field: "createdTime",
                displayName: '创建时间',
                width: '16%',
            }
            ,
            {
                field: "lastOperator",
                displayName: '最后操作人',
                width: '16%',
            }
            ,
            {
                field: "lastOperatedTime",
                displayName: '最后操作时间',
                width: '16%',
            }
        ]

        vm.outbound_params = {
            bean: 'wmsRequisition',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.getOutboundPage = function () {

            commonUtil.getList(vm.outbound_params).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.data = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getOutboundPage();
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
            qryUserId: vm.qryUserId,
            page: 1,
            rows: 10
        }
        vm.getGoodsPage = function () {
            commonUtil.getList(vm.goodsParams).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    vm.goods_data = data;
                } else {
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

                if (data.additionalMsg.status == '00') {
                    vm.deal_data = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        };
        vm.getdealPage();
        /**************************************************************增加调拨单明细*******************************************************************/
        vm.addOutboundDetail = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择一条调拨单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能选择一条出运单');
                return false;
            } else if (vm.entity.getSelectedRows()[0].STATUS == "OPEN") {
                $('#selectCommonContacts').modal('show');

            } else {
                msgAlert.info('只能为订单状态为"OPEN"添加货品');
                return false;
            }

        }
        /**************************************************生效调拨单*********************************************************************/
        vm.ActiveOutbound = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择一条调拨单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能选择一条调拨单');
            } else {

                BillManage.wmsRequisitionActive(vm.entity.getSelectedRows()[0].ID).success(function (data) {

                    if (data.status == '00') {
                        msgAlert.info('生效调拨单成功');
                        vm.getOutboundPage();
                    } else {
                        msgAlert.text('生效调拨单失败 >﹏< [' + data.message + ']');
                    }
                })
            }

        }

        /**************************************************失效调拨单*********************************************************************/
        vm.invalidOutbound = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择一条调拨单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('每次只能选择一条调拨单');
            } else {
                BillManage.wmsRequisitionInvalid(vm.entity.getSelectedRows()[0].ID).success(function (data) {
                    if (data.status == '00') {
                        msgAlert.info('失效调拨单成功');
                        vm.getOutboundPage();
                    } else {
                        msgAlert.text('失效调拨单失败 >﹏< [' + data.msg + ']');
                    }
                })
            }

        }
        /**************************************************************增加调拨单明细确认*******************************************************************/
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
                    msgAlert.info('添加调拨单明细成功');
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
        /**************************************************************删除调拨单***********************************************************************/
        vm.outboundId = "";
        vm.outboundDelete = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择要删除的调拨单');
                return false;
            }
            if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.info('请选择一条要删除的调拨单');
                return false;
            }

            vm.outboundId = vm.entity.getSelectedRows()[0].ID;
            vm.outbound_del = {
                id: vm.outboundId
            }
            BillManage.DeleteOutbound(vm).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    msgAlert.info('删除调拨单成功');
                    vm.getOutboundPage();
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }

        //新建调拨单
        vm.toCreateWaybill = function () {
            window.location.href = "#/wms/outbound/requisition/requisitionAdd";
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
        /*************************************************搜索调拨单*******************************************************/
        vm.OutboundFind = function () {
            vm.outbound_params = {
                bean: 'wmsRequisition',
                method: 'page',
                page: 1,
                rows: 10,
                createdTime : $('.senderTime span').html(),
                code: $("#code").val(),
                status: $("#status").val(),
                inboundCode: $("#in_code").val(),
                outboundCode: $("#out_code").val(),
                outboundFinishTime:$('.outboundFinishTime span').html(),
                inboundFinishTime:$('.inboundFinishTime span').html(),
            }
            vm.getOutboundPage();
        }
    });



