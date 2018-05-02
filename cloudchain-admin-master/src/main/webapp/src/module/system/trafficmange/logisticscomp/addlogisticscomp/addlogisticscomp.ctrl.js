
angular.module('MetronicApp').controller('addLogisticsCompController', ['$rootScope', '$scope','$http','uiGridConstants','d2p', 'settings','System','BillManage','commonUtil','citySelect','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,d2p,settings, System,BillManage,commonUtil,citySelect,multicitySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.sheetType="10";
    vm.return=function () {
        window.location.href="#/sys/store/traffic/logisticscomp";
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
    vm.initLogisticsList= function() {
        vm.dictTypeName ='交易系统中物流名称';
        $http({url:"/sys/dict/list"/*"/process"*/,method: "get",
            params:{
                dictTypeName:vm.dictTypeName,
            }
        }).success(function(data) {
            vm.logisticsList = data.rows;
            vm.parentLogisticCompId=vm.logisticsList[0].dataValue;
        });
    }
    vm.initLogisticsList();

    vm.getPrintTemplatePage = function () {
        vm.templatePageParams = {
            bean: 'wmsPrint',
            method: 'page',
            page: 1,
            rows: 10,
            billType:vm.sheetType,
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
     vm.getPrintTemplatePage();

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
    vm.addNewCompany  = function () {

        var name=$("input[name='name']").val();
        var address=$("input[name='address']").val();
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
      /*  var sheetTemplateId = $('#sheetTemplateId option:selected').val();*/
        var sheetTemplateId=vm.templateId;
        //仓库地址
        var provinceName = $('.companyAddress').find('.selectPro :selected').html();
        var cityName = $('.companyAddress').find('.selectCity :selected').html();
        var districtName = $('.companyAddress').find('.selectArea :selected').html();
        var provinceId= citySelect.getSelect().proId;//省id
        var cityId = citySelect.getSelect().cityId;//市id
        var districtId = citySelect.getSelect().areaId;//区id

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

        vm.addParam = {
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
            toBankName:toBankName,
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
            url: "/externalLogisticsCompany/add", method: "post",
            params: vm.addParam
        }).success(function (data) {
            if (data.status == '00') {
                msgAlert.info('添加成功');
                window.location.href="#/sys/store/traffic/logisticscomp";
            } else {
                msgAlert.text(' >﹏< [' + data.msg + ']');
            }
        }).error(function () {
            msgAlert.text(' 系统繁忙 >﹏< ');
        })
    }

}])



