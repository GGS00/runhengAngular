
angular.module('MetronicApp').controller('addMatchRuleController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','System','BillManage','commonUtil','citySelect','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,settings, System,BillManage,commonUtil,citySelect,multicitySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;


    vm.initial=function () {
        vm.supParams = {
            bean:'omsExternalLogisticsCompany',
            method:'page',
            page:1,
            rows:10
        }
        commonUtil.getList(vm.supParams).success(function(data) {
            vm.logisticsCompanyList = data.rows;
            vm.logisticsComp=vm.logisticsCompanyList[0].id;
            vm.logisticsComp01=vm.logisticsCompanyList[0].id;
        });
    }

    vm.initial();
    /********************************************初始化地区*********************************************/
    vm.sendSwitch = 0;
    vm.sendAddressList = [{id:''}];
    vm.addNewArea = function(){
        vm.sendAddressList.push({id:''});
    };
    vm.removeArea = function(index){
        vm.sendAddressList.splice(index,1);
    };
    vm.idepartmentList = "";
    vm.ruleDetailList = [{minWeight:"",maxWeight:"",logisticsComp:""}];
    vm.addNewRuleDetail = function () {
        vm.ruleDetailList.push({
            minWeight:"",
            maxWeight:"",
            logisticsComp:vm.logisticsCompanyList[0].id
        })
    }
    vm.removeNewRuleDetail = function () {
        if(vm.ruleDetailList.length ==1){
            return;
        }
        vm.ruleDetailList.pop();
    }

    vm.ruleTypeVal=1;

    vm.add_invalid_time_switch = 1; //添加页面的合作开始时间控件显示标志
    //监听添加页面永久有效事件
    vm.addCheckFlg = function(){
        if($('#add_check_flg').is(':checked')){
            $('#add_foreverFlg').val(1);
            vm.add_invalid_time_switch = 0;
        }else {
            $('#add_foreverFlg').val(0);
            vm.add_invalid_time_switch = 1;
        }
    }
    vm.return=function () {
        window.location.href="#/sys/store/traffic/logisticsmatchrule";
    }
    /******************************************************************************提交************************************************/
    vm.submitUser  = function () {

        var name=$("input[name='name']").val();
        var ruleType=$("input[name='ruleType']:checked").val();

        var ruleDetailArray=[];
        if(ruleType==1){
            ruleDetailArray[0]= {
                LogisticsCompId: $('#externalLogisticsCompanyId1 option:selected').val().substring(7),
                logisticsCompCode : $('#externalLogisticsCompanyId1 option:selected').text()

            }
        }else if(ruleType==0) {
            for (var i = 0; i < vm.ruleDetailList.length; i++) {
                ruleDetailArray[i] = {

                    LogisticsCompId: $('.ruleDetailList_' + i).find('#externalLogisticsCompanyId0 option:selected').val().substring(7),
                    logisticsCompCode: $('.ruleDetailList_' + i).find('#externalLogisticsCompanyId0 option:selected').text(),
                    minWeight: $('.ruleDetailList_' + i).find("input[name='minWeight']").val(),
                    maxWeight: $('.ruleDetailList_' + i).find("input[name='maxWeight']").val()
                }
            }
            ruleDetailArray[ruleDetailArray.length]={
                minWeight: $("input[name='minWeight0']").val(),
                maxWeight: "",
                LogisticsCompId: $('#externalLogisticsCompanyId01 option:selected').val().substring(7),
                logisticsCompCode: $('#externalLogisticsCompanyId01 option:selected').text(),
            }
        }
        var ruleItemString =  angular.toJson(ruleDetailArray);
        var invalidTime;
        var status;
        var foreverFlg=$('#add_foreverFlg').val()
        if($('#add_foreverFlg').val()==0) {
            if ($('.invalidTime span').html() < $('.activeTime span').html()) {
                msgAlert.info('失效时间不能早于生效时间。。。');
                return false;

            } else {
                invalidTime = $('.invalidTime span').html();
                status="ACTIVE";
            }
        }else{
            status="ACTIVE";
        }
        var activeTime=$('.activeTime span').html();

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
        var sendlist =  angular.toJson(addressList);

        vm.addParam = {
            code: name,
            name: name,
            ruleType: ruleType,
            ruleItemString:ruleItemString,
            shipAreas:sendlist,
            invalidDate:invalidTime,
            activeDate:activeTime,
            foreverFlg:foreverFlg,
            status:status
        }
        $http({
            url: "/logisticsMatchRule/add", method: "post",
            params: vm.addParam
        }).success(function (data) {
            if (data.status == '00') {
                msgAlert.info('添加成功');
                window.location.href="#/sys/store/traffic/logisticsmatchrule";
            } else {
                msgAlert.text(' >﹏< [' + data.msg + ']');
            }
        }).error(function () {
            msgAlert.text(' 系统繁忙 >﹏< ');
        })
    }
}])



