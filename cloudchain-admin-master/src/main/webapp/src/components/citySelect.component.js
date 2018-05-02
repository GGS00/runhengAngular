angular
    .module('MetronicApp')
    .component('citySelect', {
        templateUrl: '/dist/tpl/components/citySelect.view.html',
        controller: 'citySelectCtrl',
        controllerAs: 'citySelect',
        bindings: {
            csPro: '<',
            csCity:'<',
            csArea: '<',
            fun:'&'
        }
    })
    .controller('citySelectCtrl', citySelectCtrl)
    .service('citySelect', citySelect)

citySelectCtrl.$inject = ['$timeout','$scope','$http','uiGridConstants','$log','citySelect'];


function citySelectCtrl($timeout,$scope,$http,uiGridConstants,$log,citySelect) {
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
            vm.provinceList = data.data;
            if(vm.csPro){
                vm.proSelect = vm.csPro;
                vm.csPro='';
            }else{
                vm.proSelect = data.data[0].regionId;
            }
            initialCity(vm.proSelect);
        })
    }

    function initialCity(id){
        vm.cityId = id;
        $http({url:"/user/city/getCityList/"+vm.cityId,method: "get",
            params:{
            }
        }).success(function(data) {
            vm.cityList = data.data;
            if(vm.csCity){
                vm.citySelect= vm.csCity;
                vm.csCity='';
            }else{
                vm.citySelect= data.data[0].regionId;
            }
            initialArea(vm.citySelect);
        })
    }

    function initialArea(id){
        vm.areaId = id;
        $http({url:"/user/city/getCityList/"+ vm.areaId,method: "get",
            params:{
            }
        }).success(function(data) {
            vm.areaList = data.data;
            if(vm.csArea){
                vm.areaSelect = vm.csArea;
                vm.csArea='';
            }else{
                vm.areaSelect = data.data[0].regionId;
            }
            vm.selectResult={};
            vm.selectResult.proId = vm.proSelect;
            vm.selectResult.cityId = vm.citySelect;
            vm.selectResult.areaId = vm.areaSelect;
            citySelect.setSelect(vm.selectResult)
            vm.fun();
        })
    }
    vm.selectProChange = function(){
        initialCity(vm.proSelect)
    }

    vm.selectCityChange = function(){
        initialArea(vm.citySelect)
    }
    vm.selectAreaChange = function(){
        vm.selectResult={};
        vm.selectResult.proId = vm.proSelect;
        vm.selectResult.cityId = vm.citySelect;
        vm.selectResult.areaId = vm.areaSelect;
        citySelect.setSelect(vm.selectResult)
    }


}


function citySelect(){
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
