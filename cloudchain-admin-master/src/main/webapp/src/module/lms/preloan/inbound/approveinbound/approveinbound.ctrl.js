angular.module('MetronicApp').controller('approveInboundController', function ($rootScope, $scope,$http,$location, uiGridConstants, settings,commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    })
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.showSwitch= 0;
    vm.inboundId =  $location.search().id;
    initial();
    function initial(){
        $http({url:"/LmsInbound/load",
            method: "post",
            params:{
                id:vm.inboundId
            }
        }).success(function(data) {
            if(data.status==00){
                vm.getPage();
                vm.objData = data.obj;
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    }


    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'lmsPreInboundDetail',
        method: 'page',
        page: 1,
        rows: 10,
        inboundId:vm.inboundId
    }
    vm.column = [
        {
            field: "id",
            displayName: 'id',
            visible: false,
            enableColumnMenu: false// 是否显示列头部菜单按钮
        },
        {
            field: "sku_id",
            displayName: '货品编码'
        },
        {
            field: "sku_name",
            displayName: '货品名称'
        },
        {
            field: "quantity",
            displayName: '货品数量'
        },
        {
            field: "unit_price",
            displayName: '单价'
        },
        {
            field: "total_price",
            displayName: '总价'
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
    //返回上一页按钮
    vm.return = function () {
        window.history.back(-1);
    }
    vm.approve=function(){
        if ($("input[name='checkStatus']").val()== "") {
            msgAlert.text('请输入审批结果');
            return false;
        }
        var checkStatus=$("#checkStatus option:selected").val();

        var checkOpinion = $("input[name='checkOpinion']").val();
        vm.approveParam={
            checkStatus:checkStatus,
            checkOpinion:checkOpinion,
            id:vm.inboundId
        };
        $http({
            url:"/LmsInbound/approve",
            method:"post",
            params:vm.approveParam
        }).success(function(data) {
            if(data.additionalMsg.status==00){
                msgAlert.info("审批成功，现在返回");
                window.location.href="#/lms/preloan/inbound";
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        }).error(function(){
            msgAlert.text('系统繁忙 >﹏<');
        });
    };

})