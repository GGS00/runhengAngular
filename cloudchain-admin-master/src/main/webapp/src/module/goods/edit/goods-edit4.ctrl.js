angular.module('MetronicApp').controller('GoodsEdit4Controller', function($stateParams, $scope, $timeout,Goods,commonUtil) {

    $scope.$on('$viewContentLoaded', function () {


    });
    var vm = this;
    var spuId = $stateParams.Id;
    Goods.getSpu(spuId,3).success(function (data) {
        var p = angular.copy(data.obj)
        Goods.getPSB(p.cId).success(function (data) {
            vm.propList = data.resultMap.propList;
            for(var a in vm.propList){
                var groupList = vm.propList[a].groupList
                for(var b in groupList){
                    for(var c in groupList[b].paramList){
                         var pm = groupList[b].paramList[c]
                         for(var key in p.spuProps){
                             if(p.spuProps[key].paramId == pm.paramId){
                                 if(p.spuProps[key].settingType == 2){
                                     pm.val = p.spuProps[key].paramValue.split(",")
                                 }else{
                                     pm.val = p.spuProps[key].paramValue
                                 }

                             }
                         }
                    }
                }
            }
        })
    })
    
    vm.save = function () {
        var spuProps = []
        for(key in vm.propList){
            for(key2 in vm.propList[key].groupList){
                for(key3 in vm.propList[key].groupList[key2].paramList){
                    var item = vm.propList[key].groupList[key2].paramList[key3];
                    if(item.settingType == 0 || item.settingType == 1){
                        // if(item.val == undefined || item.val == "" ){
                        //     msgAlert.text('有没填写/选择的属性');
                        //     return;
                        // }
                        spuProps.push({
                            paramName:item.paramName,
                            paramValue:item.val,
                            groupId:item.groupId,
                            propId:vm.propList[key].groupList[key2].propId,
                            paramId:item.paramId,
                        })
                    }
                    if(item.settingType == 2){
                        // var a = [];
                        // for(var n in item.valList){
                        //     if(item.valList[n].checked == 1){
                        //         a.push(item.valList[n].val)
                        //     }
                        // }
                        // if(item.val.length < 1){
                        //     msgAlert.text('请至少选择一个多选项');
                        //     return;
                        // }
                        if(item.val != undefined){
                            spuProps.push({
                                paramName:item.paramName,
                                paramValue:item.val.join(),
                                groupId:item.groupId,
                                propId:vm.propList[key].groupList[key2].propId,
                                paramId:item.paramId,
                            })
                        }
                    }
                    if(item.settingType == 3){
                        // var time = $("#"+ item.paramId+ " span").html()
                        // if(time == undefined || time == "-"){
                        //     msgAlert.text('请选择时间属性');
                        //     return;
                        // }
                        spuProps.push({
                            paramName:item.paramName,
                            paramValue:item.val,
                            groupId:item.groupId,
                            propId:vm.propList[key].groupList[key2].propId,
                            paramId:item.paramId,
                        })
                    }
                }
            }
        }

        var info = {
            spuId:spuId,
            spuProps:spuProps,
        }

        Goods.updateGoods(3,info).success(function (data) {
            if(data.status == 00){
                window.history.back(-1)
            }else{
                msgAlert.text(data.msg);
            }
        })
    }
});