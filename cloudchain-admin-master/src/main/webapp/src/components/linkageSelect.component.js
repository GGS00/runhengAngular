/**
 * Created by shaobinhua on 2017/3/29.
 */
angular
    .module('MetronicApp')
    .component('linkageSelect', {
        templateUrl: '/dist/tpl/components/linkageSelect.view.html',
        controller: 'linkageSelectCtrl',
        controllerAs: 'linkageSelect',
        bindings: {
            warehouse:'='
        }
    })
    .controller('linkageSelectCtrl', linkageSelectCtrl)
    .service('linkageSelect', linkageSelect)

linkageSelectCtrl.$inject = ['$timeout','$scope','$http','uiGridConstants','$log','linkageSelect'];


function linkageSelectCtrl($timeout,$scope,$http,uiGridConstants,$log,linkageSelect) {
    var vm = this;
    initialArea(vm.warehouse);
    console.log(vm.warehouse)
    function initialArea(id){
        vm.warehouseId = id;
        $http({url:"/wmsWarehouseArea/qryAreaLstExistLoc/"+vm.warehouseId,method: "get",
            params:{}
        }).success(function(data) {
            vm.areaSelect = data.data[0].id;
            vm.areaList = data.data;
            initialLocation(vm.areaSelect);
        })
    }

    function initialLocation(id){
        vm.areaId = id;
        $http({url:"/process",method: "get",
            params:{
                bean:'wmsWarehouseLocation',
                method:'page',
                type:'STOREAGE',
                page:1,
                rows:1000,
                areaId:vm.areaId
            }
        }).success(function(data) {
            vm.locationSelect= data.rows[0].id;
            vm.markSelect = data.rows[0].mark;
            vm.locationList = data.rows;
            vm.selectResult={};
            vm.selectResult.warehouseId = vm.warehouse;
            vm.selectResult.areaId = vm.areaSelect;
            vm.selectResult.locationId =  vm.locationSelect;
            vm.selectResult.mark =  vm.markSelect;
            linkageSelect.setSelect(vm.selectResult)
        })
    }


    vm.selectAreaChange = function(){
        initialLocation(vm.areaSelect)
    }

    vm.selectLocationChange = function(){
        vm.selectResult={};
        vm.selectResult.warehouseId = vm.warehouse;
        vm.selectResult.areaId = vm.areaSelect;
        vm.selectResult.locationId = vm.locationSelect;
        vm.selectResult.mark =  vm.markSelect;
        linkageSelect.setSelect(vm.selectResult)
    }
    $(".select2me").select2();
    $(".select2").css('width','auto');


}


function linkageSelect(){
    var selectResult = "";
    return {
        setSelect: function(value) {
            selectResult = value;
        },
        getSelect: function () {
            return selectResult
        },
    }
}
