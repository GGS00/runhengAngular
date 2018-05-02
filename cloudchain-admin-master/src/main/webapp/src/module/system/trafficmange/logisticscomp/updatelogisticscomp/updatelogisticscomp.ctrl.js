
angular.module('MetronicApp').controller('updateLogisticsCompController', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','System','BillManage','commonUtil','citySelect','multicitySelect', function($rootScope, $scope, $http,$location, uiGridConstants,settings, System,BillManage,commonUtil,citySelect,multicitySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); //initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.id =  $location.search().id;
    vm.initial=function () {
        $http({
            url: "/externalLogisticsCompany/load", method: "post",
            params: {id:vm.id}
        }).success(function (data) {
            if (data.status == '00') {
                vm.data=data.externalLogisticsCompany;
                var addr = vm.data.provinceName + "/" + vm.data.cityName + "/" +vm.data.districtName
                $("#addr_id").val(addr);
                vm.sheetTypeVal=vm.data.sheetType;
                vm.statusVal=vm.data.status;
                vm.parentLogisticCompId=vm.data.parentLogisticCompId;
                vm.templateId=vm.data.sheetTemplateId
            }
        })
    }
    vm.initial();

    vm.initPrintTemplatePage = function () {
        vm.initTemplatePageParams = {
            bean: 'wmsPrint',
            method: 'page',
            page: 1,
            rows: 10,
            billType:vm.sheetTypeVal,
            printType:"1"
        }

        $http({
            url: "/process", method: "get",
            params: vm.initTemplatePageParams
        }).success(function (data) {
            if(data.additionalMsg.status=="00") {
                vm.templateList = data.rows;
            }
        })
    };
    vm.initPrintTemplatePage();

    vm.getPrintTemplatePage = function () {
        vm.templatePageParams = {
            bean: 'wmsPrint',
            method: 'page',
            page: 1,
            rows: 10,
            billType:vm.sheetTypeVal,
            printType:"1"
        }
        $http({
            url: "/process", method: "get",
            params: vm.templatePageParams
        }).success(function (data) {
            if(data.additionalMsg.status=="00") {
                vm.templateList = data.rows;
                if(vm.templateList!=null) {
                    vm.templateId = vm.templateList[0].templateId;
                }
            }
        })
    };



    vm.initLogisticsList = function() {
        vm.dictTypeName ='交易系统中物流名称';
        $http({url:"/sys/dict/list"/*"/process"*/,method: "get",
            params:{
                dictTypeName:vm.dictTypeName,
            }
        }).success(function(data) {
            vm.logisticsList = data.rows;

        });
    }
    vm.initLogisticsList();
    vm.return=function () {
        window.location.href="#/sys/store/traffic/logisticscomp";
    }

    vm.citySwitch = 0;
    //修改地址
    vm.updateAddr = function () {
        vm.citySwitch = 1;
    }
    //取消修改
    vm.cancelAddr = function () {
        vm.citySwitch = 0;
    }
    /********************************************初始化地区*********************************************/
    vm.sendSwitch = 0;
    vm.sendAddressList = [{id:''}];
    vm.addNewSend = function(){
        vm.sendAddressList.push({id:''});
    };
    vm.removeSend = function(index){
        vm.sendAddressList.splice(index,1);
    };
    vm.idepartmentList = "";

    vm.logisticsFeeSettings = [{sendAddressList1:[{id:''}],initialWeight:"",initialUnitPrice:"",continuedWeight:"",continuedUnitPrice:""}];
    vm.addNewSetting = function () {
        vm.logisticsFeeSettings.push({
            sendAddressList1:[{id:''}],
            initialWeight:"",
            initialUnitPrice:"",
            continuedWeight:"",
            continuedUnitPrice:""
        })
    }
    vm.removeNewSetting = function () {
        if(vm.logisticsFeeSettings.length ==1){
            return;
        }
        vm.logisticsFeeSettings.pop()
    }
    /******************************************************************************添加************************************************/
    vm.update  = function () {

        var name=$("input[name='name']").val();
        var id=$("input[name='id']").val();
        var sheetType=$("input[name='sheetType']:checked").val();
        var status=$("input[name='status']:checked").val();
        var logisticsFeeSettleDay=$("input[name='logisticsFeeSettleDay']").val();
        var toCompanyName=$("input[name='toCompanyName']").val();
        var toCompanyLegelPerson=$("input[name='toCompanyLegelPerson']").val();
        var toBankName=$("input[name='toBankName']").val();
        var toBankAccount=$("input[name='toBankAccount']").val();
        var contactorName=$("input[name='contactorName']").val();
        var contactorMobile=$("input[name='contactorMobile']").val();
        var contactorMail=$("input[name='contactorMail']").val();
        //对应电商物流
        var parentLogisticCompId = $('#parentLogisticCompId option:selected').val().substring(7);
        var parentLogisticCompCode = $('#parentLogisticCompId option:selected').text();
        var sheetOriginId = $('#sheetOriginId option:selected').val();
       /* var sheetTemplateId = $('#sheetTemplateId option:selected').val();*/
        var sheetTemplateId=vm.templateId;
        //仓库地址
        if(vm.citySwitch==0){

            var provinceName = vm.data.provinceName ;
            var cityName = vm.data.cityName;
            var districtName = vm.data.districtName;
            var provinceId =vm.data.province;//省id
            var cityId = vm.data.city;//市id
            var districtId = vm.data.district;//区id
        }else if(vm.citySwitch ==1){
            //仓库地址
            var provinceName = $('.companyAddress').find('.selectPro :selected').html();
            var cityName = $('.companyAddress').find('.selectCity :selected').html();
            var districtName = $('.companyAddress').find('.selectArea :selected').html();
            var provinceId= citySelect.getSelect().proId;//省id
            var cityId = citySelect.getSelect().cityId;//市id
            var districtId = citySelect.getSelect().areaId;//区id
        }
        var address=$("input[name='address']").val();

        var addressList= [];
        for (var i = 0; i < vm.sendAddressList.length; i++) {
            if ($('.sendAddress_'+i).find('.selectPro :selected').val()!='') {
                if ($('.sendAddress_' + i).find('.selectCity :selected').val() != '') {
                    if ($('.sendAddress_' + i).find('.selectArea :selected').val() != '') {
                        addressList[i] = {
                            province: $('.sendAddress_' + i).find('.selectPro :selected').val(),
                            provinceName: $('.sendAddress_' + i).find('.selectPro :selected').html(),
                            city: $('.sendAddress_' + i).find('.selectCity :selected').val(),
                            cityName: $('.sendAddress_' + i).find('.selectCity :selected').html(),
                            district: $('.sendAddress_' + i).find('.selectArea :selected').val(),
                            districtName: $('.sendAddress_' + i).find('.selectArea :selected').html()
                        }
                    } else {
                        addressList[i] = {
                            province: $('.sendAddress_' + i).find('.selectPro :selected').val(),
                            provinceName: $('.sendAddress_' + i).find('.selectPro :selected').html(),
                            city: $('.sendAddress_' + i).find('.selectCity :selected').val(),
                            cityName: $('.sendAddress_' + i).find('.selectCity :selected').html(),
                        }
                    }
                } else {
                    addressList[i] = {
                        province: $('.sendAddress_' + i).find('.selectPro :selected').val(),
                        provinceName: $('.sendAddress_' + i).find('.selectPro :selected').html(),
                    }
                }
            }else {
                addressList[i] = {
                    province: "all",
                    provinceName: "全国",
                }
            }
        }
        vm.sendlist =  angular.toJson(addressList);

        vm.updateParam = {
            id:id,
            code: name,
            name: name,
            provinceName: provinceName,
            cityName: cityName,
            districtName: districtName,
            provinceId: provinceId,
            cityId: cityId,
            districtId: districtId,
            address: address,
            sheetType:sheetType,
            status:status,
            logisticsFeeSettleDay:logisticsFeeSettleDay,
            toCompanyName:toCompanyName,
            toCompanyLegelPerson:toCompanyLegelPerson,
            toBankname:toBankName,
            toBankAccount:toBankAccount,
            contactorName:contactorName,
            contactorMobile:contactorMobile,
            contactorMail:contactorMail,
            parentLogisticCompId:parentLogisticCompId,
            parentLogisticCompCode:parentLogisticCompCode,
            sheetOriginId:sheetOriginId,
            sheetTemplateId:sheetTemplateId,
        }

        $http({
            url: "/externalLogisticsCompany/update", method: "post",
            params: vm.updateParam
        }).success(function (data) {
            if (data.status == '00') {
                msgAlert.info('修改成功');
                window.location.href="#/sys/store/traffic/logisticscomp";
            } else {
                msgAlert.text(' >﹏< [' + data.msg + ']');
            }
        }).error(function () {
            msgAlert.text(' 系统繁忙 >﹏< ');
        })
    }

}])



