/**
 * 上架控制器
 */
angular.module('MetronicApp').controller('ShelfAllotControl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','$location','linkageSelect', function($rootScope, $scope,$http,uiGridConstants, settings, BillManage,commonUtil,$location,linkageSelect) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;

    vm.id = $location.search().id;

    vm.pageParams = {
        bean:'wmsShelvedocItem',
        shelfDocId:vm.id,
        method:'page',
        page:1,
        rows:10
    }
    vm.column = [ {  field: "id",
        displayName: 'id',
        width:'5%',
        visible:false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        { field: 'ownerId',
            displayName: '货主id',
            width: '10%',
            visible:false,
        },
        {  field: "warehouseId",
            displayName: '仓库id',
            width: '10%',
            visible:false,
        },
        {  field: "code",
            displayName: '上架单号',
            suppressRemoveSort: true,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: '25%',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
        },
        {  field: "ownerName",
            displayName: '货主',
            width: '12%'
        },
        {  field: "expectedQuantityBU",
            displayName: '计划上架数量',
            width: '10%'
        },
        {  field: "allocatedQuantityBU",
            displayName: '分配数量',
            width: '10%'
        },
        {  field: "movedQuantityBU",
            displayName: '实际上架数量',
            width: '10%'
        },
        {  field: "inboundCode",
            displayName: '入库单号',
            width: '20%'
        },
        {  field: "inventoryStatus",
            displayName: '库存状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.inventoryStatus=="GOOD"?"良品":(row.entity.inventoryStatus=="BAD"?"不良品":row.entity.inventoryStatus)}}</div>'
        },
        {  field: "info.createdTime",
            displayName: '上架单创建时间',
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
    vm.toSeparateOrder = function(){
        window.location.href="#/tms/separateOrder";
    }
    vm.toSeparateOrderByAmount = function(){
        window.location.href="#/tms/separateByAmount";
    }

    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }

    vm.allocate =  function () {
        $.fn.modal.Constructor.prototype.enforceFocus = function () { }
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要分配的上架单明细');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.info('每次只能分配一条上架单明细');
            return false;
        }else if(vm.entity.getSelectedRows()[0].expectedQuantityBU==vm.entity.getSelectedRows()[0].allocatedQuantityBU){
            msgAlert.info('只能选择未完成分配的上架单进行分配');
            return false;
        }
        else{
            $('#selectCommonContacts').modal('show');
            $('input[name="productName"]').val(vm.entity.getSelectedRows()[0].productName);
            $('input[name="inventoryStatus"]').val(vm.entity.getSelectedRows()[0].inventoryStatus=="GOOD"?"良品":"不良品");
            $('input[name="allocatedQuantityBu"]').val(vm.entity.getSelectedRows()[0].expectedQuantityBU - vm.entity.getSelectedRows()[0].allocatedQuantityBU);
            vm.warehouse = vm.entity.getSelectedRows()[0].warehouseId

        }


    }
    vm.confirmAllocate = function(){
        $('input[name="id"]').val(vm.entity.getSelectedRows()[0].id);
        $('input[name="destLocationId"]').val(linkageSelect.getSelect().locationId);
        vm.form = $("#allocateForm").serialize();
        vm.form = decodeURIComponent(vm.form,true);
        console.log(vm.form)
        $.ajax({
            url:"/shelveDoc/doManulAllocate",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                    msgAlert.info('分配成功');
                    $("#selectCommonContacts").modal('hide');
                    vm.getPage();
                }else if(data.additionalMsg.status=='01'){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })
    }
}])

