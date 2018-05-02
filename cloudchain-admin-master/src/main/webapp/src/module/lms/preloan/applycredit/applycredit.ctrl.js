/**
 * 贷款规则控制器
 */
angular.module('MetronicApp').controller('applyCreditController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','commonUtil','Table', function ($rootScope, $scope, $http, uiGridConstants, settings, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'lmsPreApplyCredit',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.column = [{
        field: "id",
        displayName: 'ID',
        width: '5%',
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {
            field: "customer_code",
            displayName: '客户编码',
            width: '10%'
        },
        {
            field: 'customer_name',
            displayName: '客户名称',
            width: '10%'
        },
        {
            field: "code",
            displayName: '申请编号',
            width: '10%'
        },
        {
            field: "apply_type",
            displayName: '申请方式',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.apply_type=="MANUAL"?"手工新建":(row.entity.apply_type=="ONLINE"?"网上申请":row.entity.data.apply_type)}}</div>'
        },
        {
            field: "apply_date",
            displayName: '申请日期',
            width: '10%'
        },
        {
            field: "check_status",
            displayName: '总审核状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.check_status=="WAIT_COMMIT"?"待提交":(row.entity.check_status=="WAIT_CHECK"?"待审核":(row.entity.check_status=="ACTIVE"?"生效":(row.entity.check_status=="FINISHED"?"完成":(row.entity.check_status=="WAIT_IN"?"待入库":(row.entity.check_status=="CHECKING"?"审核中":(row.entity.check_status=="CHECKED"?"已审核":(row.entity.check_status=="FINISH_IN"?"入库完成":(row.entity.check_status=="UN_CHECKED"?"未审核":(row.entity.check_status=="STATUS_CHECK_PASS"?"审核通过":(row.entity.check_status=="CHECK_FAIL"?"审核失败":(row.entity.check_status=="EXTENDED"?"已放款":(row.entity.check_status=="PART_REFUND"?"部分还款":(row.entity.check_status=="REFUNDED"?"还款完成":(row.entity.check_status=="NONE"?"无需回款":(row.entity.check_status=="UN_BACKED"?"未回款":(row.entity.check_status=="UN_CLEARED"?"未结清":(row.entity.check_status=="CLEARED"?"已结清":(row.entity.check_status=="NO_CLEARED"?"无需结清":(row.entity.check_status=="INVALID"?"失效":(row.entity.check_status=="OPEN"?"打开":row.entity.check_status))))))))))))))))))))}}</div>'
        },
        {
            field: "check_status1",
            displayName: '审核状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.check_status1=="WAIT_COMMIT"?"待提交":(row.entity.check_status1=="WAIT_CHECK"?"待审核":(row.entity.check_status1=="ACTIVE"?"生效":(row.entity.check_status1=="FINISHED"?"完成":(row.entity.check_status1=="WAIT_IN"?"待入库":(row.entity.check_status1=="CHECKING"?"审核中":(row.entity.check_status1=="CHECKED"?"已审核":(row.entity.check_status1=="FINISH_IN"?"入库完成":(row.entity.check_status1=="UN_CHECKED"?"未审核":(row.entity.check_status1=="STATUS_CHECK_PASS"?"审核通过":(row.entity.check_status1=="CHECK_FAIL"?"审核失败":(row.entity.check_status1=="EXTENDED"?"已放款":(row.entity.check_status1=="PART_REFUND"?"部分还款":(row.entity.check_status1=="REFUNDED"?"还款完成":(row.entity.check_status1=="NONE"?"无需回款":(row.entity.check_status1=="UN_BACKED"?"未回款":(row.entity.check_status1=="UN_CLEARED"?"未结清":(row.entity.check_status1=="CLEARED"?"已结清":(row.entity.check_status1=="NO_CLEARED"?"无需结清":(row.entity.check_status1=="INVALID"?"失效":(row.entity.check_status1=="OPEN"?"打开":row.entity.check_status1))))))))))))))))))))}}</div>'
        },
        {
            field: "check_person_name1",
            displayName: '审核人姓名',
            width: '10%'
        },
        {
            field: "check_time1",
            displayName: '审核时间',
            width: '10%'
        },
        {
            field: "check_option1",
            displayName: '审核意见',
            width: '10%'
        },
        {
            field: "description",
            displayName: '备注',
            width: '10%'

        },
        {
            field: "creator",
            displayName: '创建人',
            width: '10%'
        },
        {
            field: "created_time",
            displayName: '创建时间',
            width: '10%'
        },
        {
            field: "last_operator",
            displayName: '最后修改人',
            width: '10%'
        },
        {
            field: "last_operated_time",
            displayName: '最后修改时间',
            width: '10%'
        }



    ]
    vm.getPage = function () {
        $http({
            url: "/process", method: "get",
            params: vm.pageParams
        }).success(function (data) {
            vm.data = data;
        })
    };
    vm.getPage();

    /*审批*/
    vm.approve = function () {
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要审批的客户资料');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能审批一条客户资料');

        }else{

            window.location.href = "#/lms/preloan/applycredit/approve?id="+vm.entity.getSelectedRows()[0].id;
        }
    };



    vm.getPageByFilter = function(){
        var code = $('input[name="code"]').val();

        var check_status = $('#id_check_status').val();
        if(check_status == " "){
            check_status ="";
        }
        var customerCode = $('input[name="customerCode"]').val();
        if(customerCode == " "){
            customerCode ="";
        }
        if(code == "" && check_status == ""&& customerCode=="" ){
            msgAlert.info('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            code:code,
            customerCode:customerCode,
            check_status:check_status,
            bean:'lmsPreApplyCredit',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }

}])



