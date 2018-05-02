/* Setup LmsController page controller */
angular.module('MetronicApp').controller('inboundController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings,commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    /******************************************************************获取列表*********************************************************************************/
    vm.menuLen = 4;

    vm.pageParams = {
        bean: 'lmsPreInbound',
        method: 'page',
        page: 1,
        rows: 10,

    }

    vm.column = [
        {
            field: "id",
            displayName: 'id',
            width: '5%',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
        {
            field: 'code',
            displayName: '入库单号',
            width: 250,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
            cellTemplate: '<a ui-sref="loan.inboundDetails({id:row.entity.id})" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
        },
        {
            field: "order_amount",
            displayName: '订单金额',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
        },
        {
            field: "order_time",
            displayName: '下单时间',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
        },
        {
            field: "warehouseName",
            displayName: '入库仓库',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
        },
        {
            field: "check_status",
            displayName: '审核状态',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true,
            cellTemplate:'<div style="padding:5px">{{row.entity.check_status=="WAIT_COMMIT"?"待提交":(row.entity.check_status=="WAIT_CHECK"?"待审核":(row.entity.check_status=="ACTIVE"?"生效":(row.entity.check_status=="FINISHED"?"完成":(row.entity.check_status=="WAIT_IN"?"待入库":(row.entity.check_status=="CHECKING"?"审核中":(row.entity.check_status=="CHECKED"?"已审核":(row.entity.check_status=="FINISH_IN"?"入库完成":(row.entity.check_status=="UN_CHECKED"?"未审核":(row.entity.check_status=="STATUS_CHECK_PASS"?"审核通过":(row.entity.check_status=="CHECK_FAIL"?"审核失败":(row.entity.check_status=="EXTENDED"?"已放款":(row.entity.check_status=="PART_REFUND"?"部分还款":(row.entity.check_status=="REFUNDED"?"还款完成":(row.entity.check_status=="NONE"?"无需回款":(row.entity.check_status=="UN_BACKED"?"未回款":(row.entity.check_status=="UN_CLEARED"?"未结清":(row.entity.check_status=="CLEARED"?"已结清":(row.entity.check_status=="NO_CLEARED"?"无需结清":(row.entity.check_status=="INVALID"?"失效":(row.entity.check_status=="OPEN"?"打开":row.entity.check_status))))))))))))))))))))}}</div>'
        },
        {
            field: "status",
            displayName: '入库状态',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true,
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="WAIT_COMMIT"?"待提交":(row.entity.status=="WAIT_CHECK"?"待审核":(row.entity.status=="ACTIVE"?"生效":(row.entity.status=="FINISHED"?"完成":(row.entity.status=="WAIT_IN"?"待入库":(row.entity.status=="CHECKING"?"审核中":(row.entity.status=="CHECKED"?"已审核":(row.entity.status=="FINISH_IN"?"入库完成":(row.entity.status=="UN_CHECKED"?"未审核":(row.entity.status=="STATUS_CHECK_PASS"?"审核通过":(row.entity.status=="CHECK_FAIL"?"审核失败":(row.entity.status=="EXTENDED"?"已放款":(row.entity.status=="PART_REFUND"?"部分还款":(row.entity.status=="REFUNDED"?"还款完成":(row.entity.status=="NONE"?"无需回款":(row.entity.status=="UN_BACKED"?"未回款":(row.entity.status=="UN_CLEARED"?"未结清":(row.entity.status=="CLEARED"?"已结清":(row.entity.status=="NO_CLEARED"?"无需结清":(row.entity.status=="INVALID"?"失效":(row.entity.status=="OPEN"?"打开":row.entity.status))))))))))))))))))))}}</div>'
        },
        {
            field: "check_person",
            displayName: '审核人',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
        },
        {
            field: "check_time",
            displayName: '审核时间',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
        },
        {
            field: "check_opinion",
            displayName: '审核意见',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
        },
        {
            field: "creator",
            displayName: '创建人',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
        },
        {
            field: "created_time",
            displayName: '创建时间',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
        },
        {
            field: "last_operator",
            displayName: '最后修改人',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
        },
        {
            field: "last_operated_time",
            displayName: '最后修改时间',
            enableCellEdit: true,
            width: 180,
            enableCellEditOnFocus: true
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
    vm.getPageByFilter = function () {
        var code = $('input[name="code"]').val();

        var checkStatus = $('#id_check_status').val();
        if (checkStatus == " ") {
            checkStatus = "";
        }
        if (code == "" && checkStatus == "") {
            msgAlert.info('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            code: code,
            checkStatus: checkStatus,
            bean: 'lmsPreInbound',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.getPage();
    }



//审批
    vm.approve = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要审批的入库单');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能审批一条入库单');

        }else{

            window.location.href="#/lms/preloan/inbound/approveinbound?id="+vm.entity.getSelectedRows()[0].id;

        }
    }

}])
