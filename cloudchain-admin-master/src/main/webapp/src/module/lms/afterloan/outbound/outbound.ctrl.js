angular.module('MetronicApp')
    .controller('outboundController', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings',  'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings,  commonUtil, Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.menuLen = 4;
        /******************************************************************获取出库单表*********************************************************************************/
        vm.column = [{
            field: "id",
            displayName: 'ID',
            width: '10%',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
            {
                field: "CODE",
                displayName: '出库单号',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                width: '20%',
                cellTemplate: '<a ui-sref="loan.outboundDetail({id:row.entity.id})" style="display: block;margin: 5px;" >{{row.entity.CODE}}</a>'
            },
            {
                field: "ORDER_AMOUNT",
                displayName: '订单金额',
                width: '10%',

            },
            {
                field: "ORDER_TIME",
                displayName: '时间',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "REPERTORY_NAME",
                displayName: '仓库名称',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            /*  {
             field: "STORAGE_COST",
             displayName: '仓储费',
             width: '10%',
             enableCellEdit: true,
             enableCellEditOnFocus: true
             },*/
            {
                field: "check_status",
                displayName: '审核状态',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                cellTemplate:'<div style="padding:5px">{{row.entity.check_status=="WAIT_COMMIT"?"待提交":(row.entity.check_status=="WAIT_CHECK"?"待审核":(row.entity.check_status=="ACTIVE"?"生效":(row.entity.check_status=="FINISHED"?"完成":(row.entity.check_status=="WAIT_IN"?"待入库":(row.entity.check_status=="CHECKING"?"审核中":(row.entity.check_status=="CHECKED"?"已审核":(row.entity.check_status=="FINISH_IN"?"入库完成":(row.entity.check_status=="UN_CHECKED"?"未审核":(row.entity.check_status=="STATUS_CHECK_PASS"?"审核通过":(row.entity.check_status=="CHECK_FAIL"?"审核失败":(row.entity.check_status=="EXTENDED"?"已放款":(row.entity.check_status=="PART_REFUND"?"部分还款":(row.entity.check_status=="REFUNDED"?"还款完成":(row.entity.check_status=="NONE"?"无需回款":(row.entity.check_status=="UN_BACKED"?"未回款":(row.entity.check_status=="UN_CLEARED"?"未结清":(row.entity.check_status=="CLEARED"?"已结清":(row.entity.check_status=="NO_CLEARED"?"无需结清":(row.entity.check_status=="INVALID"?"失效":(row.entity.check_status=="OPEN"?"打开":row.entity.check_status))))))))))))))))))))}}</div>'
            },
            {
                field: "status",
                displayName: '状态',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                cellTemplate:'<div style="padding:5px">{{row.entity.status=="WAIT_COMMIT"?"待提交":(row.entity.status=="WAIT_CHECK"?"待审核":(row.entity.status=="ACTIVE"?"生效":(row.entity.status=="FINISHED"?"完成":(row.entity.status=="WAIT_IN"?"待入库":(row.entity.status=="CHECKING"?"审核中":(row.entity.status=="CHECKED"?"已审核":(row.entity.status=="FINISH_IN"?"入库完成":(row.entity.status=="UN_CHECKED"?"未审核":(row.entity.status=="STATUS_CHECK_PASS"?"审核通过":(row.entity.status=="CHECK_FAIL"?"审核失败":(row.entity.status=="EXTENDED"?"已放款":(row.entity.status=="PART_REFUND"?"部分还款":(row.entity.status=="REFUNDED"?"还款完成":(row.entity.status=="NONE"?"无需回款":(row.entity.status=="UN_BACKED"?"未回款":(row.entity.status=="UN_CLEARED"?"未结清":(row.entity.status=="CLEARED"?"已结清":(row.entity.status=="NO_CLEARED"?"无需结清":(row.entity.status=="INVALID"?"失效":(row.entity.status=="OPEN"?"打开":row.entity.status))))))))))))))))))))}}</div>'
            },
            {
                field: "PAY_AMOUNT",
                displayName: '支付总额',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "PAY_TIME",
                displayName: '支付完成时间',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "PAY_METHOD",
                displayName: '支付方式',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "DELIVERY_METHOD",
                displayName: '配送方式',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "BANK_ACCOUNT",
                displayName: '账户',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "BANK_NAME",
                displayName: '开户行',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "DELIVERY_METHOD",
                displayName: '发货方式',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "PICK_NAME",
                displayName: '收货人',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "PICK_CID",
                displayName: '收货人身份证',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "PICK_MOBILE",
                displayName: '联系方式',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "RETAIN_AMOUNT",
                displayName: '保价金额',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "ADDRESS",
                displayName: '地址',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "REMARK",
                displayName: '备注',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "ACCOUNT_NAME",
                displayName: '银行账号名',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "BANK_ACCOUNT",
                displayName: '账号',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "BANK_NAME",
                displayName: '开户行名称',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "ARRIVAL_ACCOUNT_NAME",
                displayName: '到账银行账户名',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "ARRIVAL_ACCOUNT",
                displayName: '到账银行账号',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "ARRIVAL_BANK_NAME",
                displayName: '到账银行开户行名称',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "CHECK_PERSON",
                displayName: '审核人',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "CHECK_TIME",
                displayName: '审核时间',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "CHECK_OPINION",
                displayName: '备注',
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
            bean: 'aAfterOutbound',
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

        //审批
        vm.approve = function(){
            if(vm.entity.getSelectedRows().length == 0){

                msgAlert.text('请先选择要审批的出库单');
                return false;

            }else if(vm.entity.getSelectedRows().length > 1){

                msgAlert.text('每次只能审批一条出库单');

            }else{

                window.location.href="#/lms/afterloan/outbound/approveoutbound?id="+vm.entity.getSelectedRows()[0].id;

            }
        }
        vm.settlement=function(){
            if(vm.entity.getSelectedRows().length == 0){

                msgAlert.text('请先选择要结算的出库单');
                return false;

            }else if(vm.entity.getSelectedRows().length > 1){
                msgAlert.text('每次只能结算一条出库单');

            }else {
                window.location.href = "#/lms/afterloan/outbound/settleoutbound?id=" + vm.entity.getSelectedRows()[0].id;
            }
        }
        vm.getPageByFilter = function(){
            var code = $('input[name="code"]').val();

            var status = $('#id_status').val();
            if(status == " "){
                status ="";
            }

            if(code == ""  && status == ""){
                msgAlert.info('搜索条件不能为空');
                return false;
            }
            vm.outbound_params = {
                code:code,
                status:status,
                bean:'aAfterOutbound',
                method:'page',
                page:1,
                rows:10
            }
            vm.getOutboundPage();
        }
    }]);



