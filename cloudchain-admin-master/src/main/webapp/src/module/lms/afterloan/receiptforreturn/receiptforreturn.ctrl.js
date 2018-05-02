angular.module('MetronicApp')
    .controller('receiptForReturnController', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings',  'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings,  commonUtil, Table) {
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
                field: "customer_name",
                displayName: '客户名称',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                width: '20%',
            },
            {
                field: "customer_id",
                displayName: '客户ID',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                width: '20%',
                visible: false,
            },
            {
                field: "loan_type",
                displayName: '贷款类型',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                width: '20%',
                cellTemplate:'<div style="padding:5px">{{row.entity.loan_type=="INVENTORY_FINANCE"?"货好贷":(row.entity.loan_type=="ORDER_FINANCE"?"单好贷":row.entity.loan_type)}}</div>'
            },
            {
                field: "apr",
                displayName: '月利率',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                width: '20%',
            },
            {
                field: "apply_loan_code",
                displayName: '申请编号',
                width: '10%',

            },
            {
                field: "borrow_date",
                displayName: '借款日期',
                width: '10%',

            },
            {
                field: "original_capital",
                displayName: '贷款金融',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "to_repay_capital",
                displayName: '未还本金',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "refund_interest",
                displayName: '已还利息',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "refund_amount",
                displayName: '已还总额',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "refund_capital",
                displayName: '已还本金',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
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
                field: "payment_days",
                displayName: '放款期限(天)',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "expire_date",
                displayName: '到期日期',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "creator",
                displayName: '创建人',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "created_time",
                displayName: '创建时间',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "last_operator",
                displayName: '修改人',
                width: '10%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "last_operated_time",
                displayName: '最后修改时间',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "description",
                displayName: '放款备注',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "extend_loan_code",
                displayName: '放款编号',
                width: '16%',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            }
        ]
        vm.receiptForReturnParams = {
            bean: 'lmsAfterReceiptForReturn',
            method: 'page',
            page: 1,
            rows: 10,
        }
        vm.getReceiptForReturnPage = function () {

            commonUtil.getList(vm.receiptForReturnParams).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.data = data;
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getReceiptForReturnPage();

        //按单结算
        vm.settleByOrder = function(){
            if(vm.entity.getSelectedRows().length == 0){

                msgAlert.text('请先选择要结算的记录');
                return false;

            }else{
                vm.ids=vm.entity.getSelectedRows()[0].id;
                var customerId=vm.entity.getSelectedRows()[0].customer_id;
                if(vm.entity.getSelectedRows().length >=1){
                    for(var i=1;i<vm.entity.getSelectedRows().length;i++){
                        if(vm.entity.getSelectedRows()[i].customer_id!=customerId){
                            msgAlert.text('请选择相同客户的记录');
                            return false;
                        }
                        vm.ids=vm.ids+","+vm.entity.getSelectedRows()[0].id;
                    }
                }
                window.location.href="#/lms/afterloan/receiptforreturn/settlebyorder?ids="+vm.ids;
            }
        }
        //按客户结算
        vm.settleByCustomer=function(){
            window.location.href="#/lms/afterloan/receiptforreturn/settlebycustomer";
        }
        vm.getPageByFilter = function(){
            var customerName = $('input[name="customerName"]').val();
            var applyLoanCode = $('input[name="applyLoanCode"]').val();
            var status = $('#id_status').val();
            if(status == " "){
                status ="";
            }
            if(customerName == ""  && status == ""&& applyLoanCode==""){
                msgAlert.info('搜索条件不能为空');
                return false;
            }
            vm.receiptForReturnParams = {
                customerName:customerName,
                applyLoanCode:applyLoanCode,
                status:status,
                bean:'lmsAfterReceiptForReturn',
                method:'page',
                page:1,
                rows:10
            }
            vm.getReceiptForReturnPage();
        }
    }]);



