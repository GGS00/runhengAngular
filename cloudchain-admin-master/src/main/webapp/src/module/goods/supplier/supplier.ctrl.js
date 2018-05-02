
angular.module('MetronicApp').controller('goodSupplierController', function($rootScope, $scope, $stateParams,Goods,commonUtil,$timeout, $mdSidenav, $log) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;


    })



    var vm = this;

    var spuId = $stateParams.Id

    vm.column = [
        {field: 'userId',
            displayName: '供应商ID',
            enableCellEdit: true,
            enableCellEditOnFocus:false,
        },
        { field: 'nickName',
            displayName: '供应商名称',
            enableCellEdit: true,
            enableCellEditOnFocus:false,
        },
    ]

    vm.pageParams = {
        bean:'user',
        method:'pageGetUserList',
        userType:4,
        page:1,
        rows:10,
        ownerType:2,
        isSupply:1
    }
    supplier()
    function supplier() {
        Goods.supplier(spuId).success(function (data) {
            $scope.skus = data.data[0].skus
            for(var i in  $scope.skus){
                $scope.skus[i].active = false;
            }
            $scope.getSpList($scope.skus[0].skuId)
        })
    }

    vm.getList = function () {
        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    }
    vm.getList()
    
    $scope.getSpList = function (id) {
        for(var key in  $scope.skus){
            $scope.skus[key].active = false;
            if($scope.skus[key].skuId == id){
                $scope.skus[key].active = true;
                $scope.spList = $scope.skus[key].skuSuplierRelList
            }
        }
    }
    

    $scope.addSupplier = function () {
        var supplierIds = [];
        if(vm.entity.getSelectedRows().length <1){
            alert("请先选择一个供应商")
            return
        }
        for(key in vm.entity.getSelectedRows()){
            supplierIds.push(vm.entity.getSelectedRows()[key].userId)
        }

        Goods.setSupplier(spuId,supplierIds).success(function (data) {
            if(data.status == 00){
                supplier()
                $("#show").modal('hide')
            }else{
                $("#show").modal('hide')
                msgAlert.text(data.msg);
            }
        })
    }

    $scope.batchSupplier = function () {
        var info = [];
        for(key in $scope.list){
            info[key] ={
                id:$scope.list[key].relId,
                price: $scope.list[key].priceStr * 100,
                skuId:$scope.list[key].skuId,
                supplierId:$scope.list[key].supplierId,
                qty:$scope.list[key].qty,
            }
        }
        Goods.batchSupplier(angular.toJson(info)).success(function (data) {
            if(data.status == 00){
                supplier()
                msgAlert.text("保存成功");
            }else{
                $("#show").modal('hide')
                msgAlert.text(data.msg);
            }
        })
    }
    
    // $scope.showDel = function (id) {
    //     $("#showDel").modal("show");
        $scope.delSupplier = function (id) {
            Goods.delSupplier(id).success(function (data) {
                if(data.status == 00){
                    supplier()
                    $("#showDel").modal('hide')
                }else{
                    $("#showDel").modal('hide')
                    msgAlert.text(data.msg);
                }
            })
        }
    // }

})

/**
 * Created by sq on 2017/4/24.
 */
