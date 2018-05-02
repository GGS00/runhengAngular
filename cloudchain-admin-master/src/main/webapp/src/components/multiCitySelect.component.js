angular
    .module('MetronicApp')
    .component('multicitySelect', {
        templateUrl: '/dist/tpl/components/multiCitySelect.view.html',
        controller: 'multicitySelectCtrl',
        controllerAs: 'multicitySelect',
    })
    .controller('multicitySelectCtrl', multicitySelectCtrl)
    .service('multicitySelect', multicitySelect)

multicitySelectCtrl.$inject = ['$timeout','$scope','$http','uiGridConstants','$log','multicitySelect'];


function multicitySelectCtrl($timeout,$scope,$http,uiGridConstants,$log,multicitySelect) {
    var vm = this;
    $(".select2me").select2();
    $(".select2").css('width','auto');
    initialPro(1);
    function initialPro(id){
        vm.proId = id;
        $http({url:"/user/city/getCityList/"+vm.proId,method: "get",
            params:{
            }
        }).success(function(data) {
            vm.proSelect= '';
            vm.provinceList = data.data;
            if(vm.proSelect = ''){
                vm.citySelect= '';
                vm.areaSelect= '';
                vm.selectResult={};
                vm.selectResult.proId = vm.proSelect;
                vm.selectResult.cityId = vm.citySelect;
                vm.selectResult.areaId = vm.areaSelect;
                multicitySelect.setSelect(vm.selectResult)
            }else{
                initialCity(vm.proSelect);
            }
        })
    }

    function initialCity(id){
        vm.cityId = id;
        if(vm.cityId == ''){
            vm.citySelect = '';
            vm.areaSelect= '';
            vm.selectResult={};
            vm.selectResult.proId = vm.proSelect;
            vm.selectResult.cityId = vm.citySelect;
            vm.selectResult.areaId = vm.areaSelect;
            multicitySelect.setSelect(vm.selectResult)
        }else{
            $http({url:"/user/city/getCityList/"+vm.cityId,method: "get",
                params:{
                }
            }).success(function(data) {
                vm.citySelect= '';
                vm.cityList = data.data;
                if(vm.citySelect !=''){
                    initialArea(vm.citySelect);
                }else{
                    vm.areaSelect= '';
                    vm.selectResult={};
                    vm.selectResult.proId = vm.proSelect;
                    vm.selectResult.cityId = vm.citySelect;
                    vm.selectResult.areaId = vm.areaSelect;
                    multicitySelect.setSelect(vm.selectResult)
                }
            })
        }
    }

    function initialArea(id){
        vm.areaId = id;
        if(vm.areaId ==''){
            vm.selectResult={};
            vm.selectResult.proId = vm.proSelect;
            vm.selectResult.cityId = vm.citySelect;
            vm.selectResult.areaId = vm.areaSelect;
            multicitySelect.setSelect(vm.selectResult)
        }else{
            $http({url:"/user/city/getCityList/"+ vm.areaId,method: "get",
                params:{
                }
            }).success(function(data) {
                vm.areaSelect = '';
                vm.areaList = data.data;
                vm.selectResult={};
                vm.selectResult.proId = vm.proSelect;
                vm.selectResult.cityId = vm.citySelect;
                vm.selectResult.areaId = vm.areaSelect;
                multicitySelect.setSelect(vm.selectResult)
            })
        }

    }
    vm.selectProChange = function(){

        if(vm.proSelect==''){
            vm.proSelect = '';
            vm.citySelect = '';
            vm.areaSelect = '';
            vm.cityList = [];
            vm.areaList = [];
            vm.selectResult={};
            vm.selectResult.proId = vm.proSelect;
            vm.selectResult.cityId = vm.citySelect;
            vm.selectResult.areaId = vm.areaSelect;
            multicitySelect.setSelect(vm.selectResult)
        }else{
            initialCity(vm.proSelect)
        }
    }

    vm.selectCityChange = function(){
        if(vm.citySelect==''){
            vm.areaSelect = '';
            vm.areaList = [];
            vm.selectResult={};
            vm.selectResult.proId = vm.proSelect;
            vm.selectResult.cityId = vm.citySelect;
            vm.selectResult.areaId = vm.areaSelect;
            multicitySelect.setSelect(vm.selectResult);
        }else{
            initialArea(vm.citySelect)
        }

    }
    vm.selectAreaChange = function(){
        vm.selectResult={};
        vm.selectResult.proId = vm.proSelect;
        vm.selectResult.cityId = vm.citySelect;
        vm.selectResult.areaId = vm.areaSelect;
        multicitySelect.setSelect(vm.selectResult)
    }


}


function multicitySelect(){
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
