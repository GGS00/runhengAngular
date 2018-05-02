angular.module('MetronicApp').controller('productCheckController',

    function ($rootScope, $scope,$http,$location, uiGridConstants, settings,commonUtil, Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        })
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;
        vm.showSwitch= 0;
        vm.id =  $location.search().id;
        initial();
        function initial(){
            $http({url:"/LmsInReceiptForLoan/load",
                method: "post",
                params:{
                    id:vm.id
                }
            }).success(function(data) {
                vm.objData = data;
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
            if ($("input[name='checkStatus1']").val()== "") {
                msgAlert.text('请输入审批结果');
                return false;
            }
            if ($("input[name='realTotalAmount']").val()== "") {
                msgAlert.text('请输入实际产品总价');
                return false;
            }
            var checkStatus1=$("#checkStatus1 option:selected").val();
            var realTotalQuantity = $("input[name='realTotalQuantity']").val();
            var realTotalAmount = $("input[name='realTotalAmount']").val();
            var checkOption1 = $("input[name='checkOption1']").val();
            var applyLoanId = $("input[name='applyLoanId']").val();
            var customerId= $("input[name='customerId']").val();
            vm.approveParam={
                checkStatus1:checkStatus1,
                checkOption1:checkOption1,
                id:vm.id,
                realTotalAmount:realTotalAmount,
                realTotalQuantity:realTotalQuantity,
                applyLoanId:applyLoanId,
                customerId:customerId
            };
            vm.form = $("#productcheck").serialize();
            vm.form = decodeURIComponent(vm.form,true);
            /*  $.ajax({
             url:"/LmsInReceiptForLoan/productCheck",
             data:vm.form,
             type:"post",
             dataType:"json",
             success:function(data){
             if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
             msgAlert.info('审批成功，现在返回');
             window.location.href = "#/lms/inloan/productcheck";
             }else if(data.additionalMsg.status=='01'){
             msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
             }
             },
             error:function(){
             msgAlert.text('系统繁忙 >﹏<');
             }
             })*/
            $http({
                url:"/LmsInReceiptForLoan/productCheck",
                method:"post",
                params:vm.approveParam
            }).success(function(data) {
                if(data.additionalMsg.status==00){
                    msgAlert.info("审批成功，现在返回")
                    window.location.href="#/lms/inloan/product";
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            }).error(function(){
                msgAlert.text('系统繁忙 >﹏<');
            });
        };

    })