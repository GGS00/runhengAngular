/**
 * 防伪码查询控制器
 */
angular.module('MetronicApp').controller('traceabilityQueryCtrl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','Traceability','commonUtil', function($rootScope, $scope,$http,uiGridConstants, settings, Traceability,commonUtil) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.column = [
            { field: 'code',
             width: '20%',
            displayName: '防伪码编码',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true // 是否可编辑
        }   ,
            {  field: "goodsName",
                displayName: '商品名称',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "supplierName",
                displayName: '供货商名称',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "distributorName",
                displayName: '经销商名称',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "lot",
                displayName: '批次',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            }, {  field: "createdTime",
                displayName: '创建时间',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            }

        ]
        vm.mSecurityCode ='';
        vm.pageParams = {
            bean:'tbmsSecurityCode',
            method:'page',
            code: '',
            page:1,
            rows:10
        }
        vm.getPage = function () {
            commonUtil.getList( vm.pageParams).success(function(data) {
                if(data.additionalMsg.status=='00'){
                    vm.data = data;
                }else {
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            });
        };
        vm.getPage();
        vm.find=function(){

            vm.mSecurityCode =  $("#mSecurityCode").val();
            vm.pageParams = {
                bean:'tbmsSecurityCode',
                method:'page',
                code: vm.mSecurityCode,
                page:1,
                rows:10
            }
            vm.getPage();
        }
    }]);


