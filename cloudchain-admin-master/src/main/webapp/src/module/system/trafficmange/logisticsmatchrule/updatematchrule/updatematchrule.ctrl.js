
angular.module('MetronicApp').controller('updateMatchRuleController', ['$rootScope', '$scope','$http','uiGridConstants','$location', 'settings','System','BillManage','commonUtil','citySelect','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,$location,settings, System,BillManage,commonUtil,citySelect,multicitySelect) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.id =  $location.search().id;

    vm.sendAddressList = [];
    vm.fahuoSwitch = [];
    vm.fahuoVal = [];
    var mAreasDate;
    vm.initial=function () {
        $http({
            url: "/logisticsMatchRule/load", method: "post",
            params: {id:vm.id}
        }).success(function (data) {
            if (data.status == '00') {
                vm.matchRuleData = data.resultMap.matchRule;
                vm.matchRuleItemData = data.resultMap.matchRuleItem;
                vm.ruleTypeVal = vm.matchRuleData.ruleType;
                var invalidDate=data.resultMap.invalidDate;
                var activeDate=data.resultMap.activeDate;

                $('.activeTime span').html(activeDate);

                if(vm.matchRuleData.foreverFlg==0){
                    vm.add_invalid_time_switch = 1; //添加页面的合作开始时间控件显示标志
                    $('.invalidTime span').html(invalidDate);
                }else{
                    vm.add_invalid_time_switch =0
                    $('#add_check_flg').prop('checked',true);
                    $('#add_foreverFlg').val(vm.matchRuleData.foreverFlg);

                }

                vm.ruleDetailList = [];
                if (vm.ruleTypeVal == 1) {
                    vm.itemId1 = vm.matchRuleItemData[0].id;
                    vm.logisticsCompId1 = vm.matchRuleItemData[0].logisticsCompId;
                } else {
                    for (var i = 0; i < vm.matchRuleItemData.length; i++) {
                        if (vm.matchRuleItemData[i].maxWeight !== "" && vm.matchRuleItemData[i].maxWeight !== null) {
                            vm.ruleDetailList.push({
                                id: vm.matchRuleItemData[i].id,
                                minWeight: vm.matchRuleItemData[i].minWeight,
                                maxWeight: vm.matchRuleItemData[i].maxWeight,
                                logisticsCompId: vm.matchRuleItemData[i].logisticsCompId
                            })
                        }
                        else {
                            vm.lastItemId = vm.matchRuleItemData[i].id;
                            vm.lastItemMinWeight = vm.matchRuleItemData[i].minWeight;
                            vm.lastLogisticsComp01 = vm.matchRuleItemData[0].logisticsCompId;
                        }
                    }
                }

                mAreasDate = data.resultMap.shipAreas;
                for (var i = 0; i < mAreasDate.length; i++) {
                    vm.sendAddressList.push({id: ''});
                    if (mAreasDate[i].cityName == null && mAreasDate[i].districtName == null) {
                        vm.fahuoVal.push(mAreasDate[i].provinceName);
                    } else if (mAreasDate[i].cityName != null && mAreasDate[i].districtName == null) {
                        vm.fahuoVal.push(mAreasDate[i].provinceName + "/" + mAreasDate[i].cityName);
                    } else if (mAreasDate[i].cityName != null && mAreasDate[i].districtName != null) {
                        vm.fahuoVal.push(mAreasDate[i].provinceName + "/" + mAreasDate[i].cityName + "/" +mAreasDate[i].districtName);
                    }
                    vm.fahuoSwitch.push(i);
                }
            }
        })

        vm.supParams = {
            bean:'omsExternalLogisticsCompany',
            method:'page',
            page:1,
            rows:10
        };

        commonUtil.getList(vm.supParams).success(function(data) {
            vm.logisticsCompanyList = data.rows;
        });

    }

    vm.initial();
    vm.sendSwitch = 0;

    vm.updateArea = function (index) {
        vm.fahuoSwitch[index] = index + 1;
    }

    vm.cancelUpdateArea = function (index) {

        vm.fahuoSwitch[index] = index;
    }

    vm.addNewArea = function(){
        vm.fahuoSwitch.push(vm.sendAddressList.length + 1);
        vm.sendAddressList.push({id: ''});
        vm.fahuoVal.push("");
    };
    vm.removeArea = function(index){
        vm.sendAddressList.splice(index,1);
    };
    vm.idepartmentList = "";

    vm.ruleDetailList = [{minWeight:"",maxWeight:"",logisticsComp:[]}];
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
        var id=$("input[name='id']").val();
        var ruleType=$("input[name='ruleType']:checked").val();

        var ruleDetailArray=[];
        if(ruleType==1){
            ruleDetailArray[0]= {
                //id: $("input[name='itemId1']").val(),
                LogisticsCompId: $('#externalLogisticsCompanyId1 option:selected').val().substring(7),
                logisticsCompCode : $('#externalLogisticsCompanyId1 option:selected').text()

            }
        }else if(ruleType==0) {
            for (var i = 0; i < vm.ruleDetailList.length; i++) {
                ruleDetailArray[i] = {
                    //id: $("input[name='itemId']").val(),
                    LogisticsCompId: $('.ruleDetailList_' + i).find('#externalLogisticsCompanyId0 option:selected').val().substring(7),
                    logisticsCompCode: $('.ruleDetailList_' + i).find('#externalLogisticsCompanyId0 option:selected').text(),
                    minWeight: $('.ruleDetailList_' + i).find("input[name='minWeight']").val(),
                    maxWeight: $('.ruleDetailList_' + i).find("input[name='maxWeight']").val()
                }
            }
            ruleDetailArray[ruleDetailArray.length]={
                //id: $("input[name='itemId01']").val(),
                minWeight: $("input[name='minWeight0']").val(),
                maxWeight: "",
                LogisticsCompId: $('#externalLogisticsCompanyId01 option:selected').val().substring(7),
                logisticsCompCode: $('#externalLogisticsCompanyId01 option:selected').text(),
            }
        }
        var ruleItemString =  angular.toJson(ruleDetailArray);
        var invalidTime;
        var status;
        if($('#add_foreverFlg').val()==0) {
            if ($('.invalidTime span').html() < $('.activeTime span').html()) {
                msgAlert.info('失效时间不能早于生效时间。。。');
                return false;

            } else {
                invalidTime = $('.invalidTime span').html();
                status="ACTIVE";
            }
        }else {
            status="ACTIVE";
        }
        var foreverFlag=$('#add_foreverFlg').val();
        var activeTime=$('.activeTime span').html();

        var addressList= [];
        for (var i = 0; i < vm.sendAddressList.length; i++) {
            if (vm.fahuoSwitch[i] !== i) {
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
            } else {
                addressList[i] = {
                    province: mAreasDate[i].province,
                    provinceName:mAreasDate[i].provinceName,
                    city:mAreasDate[i].city,
                    cityName:mAreasDate[i].cityName,
                    district: mAreasDate[i].district,
                    districtName:mAreasDate[i].districtName
                }
            }
        }
        var sendlist =  angular.toJson(addressList);

        vm.updParam = {
            id:id,
            code: name,
            name: name,
            ruleType: ruleType,
            ruleItemString:ruleItemString,
            shipAreas:sendlist,
            invalidDate:invalidTime,
            activeDate:activeTime,
            foreverFlg:foreverFlag,
            status:status
        }
        $http({
            url: "/logisticsMatchRule/update", method: "post",
            params: vm.updParam
        }).success(function (data) {
            if (data.status == '00') {
                msgAlert.info('修改成功');
                window.location.href="#/sys/store/traffic/logisticsmatchrule";
            } else {
                msgAlert.text(' >﹏< [' + data.msg + ']');
            }
        }).error(function () {
            msgAlert.text(' 系统繁忙 >﹏< ');
        })
    }
}])



