/**
 * 上架控制器
 */
angular.module('MetronicApp').controller('ShelfTaskSureControl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','$location','Table', function($rootScope, $scope,$http,uiGridConstants, settings, BillManage,commonUtil,$location,Table) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.id = $location.search().id
    vm.menuLen = 4;
    vm.pageParams = {
        bean:'wmsShelveTask',
        shelveWorkId:vm.id,
        method:'page',
        page:1,
        rows:10
    }
    vm.column = [ {  field: "id",
        displayName: 'ID',
        width:'5%',
        visible:false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {  field: "code",
            displayName: '作业单',
            suppressRemoveSort: true,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: '25%',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
        },
        {  field: "originalBillCode",
            displayName: '关联单据号',
            width: '20%'

        },
        {  field: "skuId",
            displayName: '货品代码',
            width: '10%'

        },
        {  field: "title",
            displayName: '货品名称',
            width: '10%'

        },
        {  field: "locationId",
            displayName: '库位ID',
            visible:false,
            width: '10%'
        },
        {  field: "locationName",
            displayName: '库位名称',
            width: '10%'
        },
        {  field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="OPEN"?"打开":(row.entity.status=="FINISHED"?"完成":(row.entity.status=="WORKING"?"工作中":(row.entity.status=="NON_WORK_DOC"?"未生成作业单":row.entity.status)))}}</div>'
        },
        {  field: "planQuantityBU",
            displayName: '计划数量',
            width: '10%'
        },
        {  field: "movedQuantityBU",
            displayName: '上架数量',
            width: '10%'
        },
        {  field: "createdTime",
            displayName: '创建时间',
            width: '15%'
        }
    ]
    vm.getPage = function () {
        $http({url:"/process"/*'../js/services/dashBoard.json'*/,method: "get",
            params:vm.pageParams
        }).success(function(data) {
            vm.data = data;
        })
    };
    vm.getPage();

    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }

    vm.singleShelve =  function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要上架的任务单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('只能选择一条上架单进行作业确认');
            return false;
        }else if(vm.entity.getSelectedRows()[0].status == "FINISHED"){
            msgAlert.info('作业单已完成确认');
            return false;
        }else {
            $('#selectCommonContacts').modal('show');
            $('#quantity').val(vm.entity.getSelectedRows()[0].planQuantityBU - vm.entity.getSelectedRows()[0].movedQuantityBU);
        }
    }
    vm.confirmSingleShelve = function(){

        BillManage.confirmSingleShelve(vm).success(function(data) {

            if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){

                msgAlert.info('确认成功');
                $('#selectCommonContacts').modal('hide');
                vm.getPage();
                vm.entity.clearSelectedRows();

            }else if(data.additionalMsg.status=='01'){

                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                vm.entity.clearSelectedRows();

            }

        });
    }


}]);


