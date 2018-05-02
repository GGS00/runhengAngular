angular.module('MetronicApp').controller('updateregionCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', '$stateParams', 'commonUtil', 'Table', 'Goods', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, $stateParams, commonUtil, Table, Goods) {

    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.regionId = $stateParams.Id;
    vm.wareFlag = 1;//是否修改仓库

    var storeMentStr2 = new Array("普通", "冷藏", "恒温", "特种", "气调");
    var storeMentStr1 = new Array("01", "02", "03", "04", "05");
    var wareHouseData;//获取仓库的信息值
    var wareHouseArea;//获取库区信息
    var wmsStoreCateList;//分类商品信息
    vm.radioFlag = 0;//存放商品 1全部  0部分
    BillManage.qryHouseAreaDetailById(vm).success(function (data) {
        if (data.status == '00') {
            wareHouseData = data.resultMap.wareHouse;
            wareHouseArea =  data.resultMap.wareHouseArea;

            $("#id_warehouse").val(wareHouseData.name);
            var storeMent = wareHouseData.storeMent;
            vm.radiolist = new Array();
            for (var j = 0; j < storeMentStr1.length; j++) {
                if (storeMent == storeMentStr1[j]) {
                    vm.radiolist.push({"name": storeMentStr2[j], "value": storeMentStr1[j]})
                }
            }
            vm.upradioValue = storeMentStr1[0];//获取库区类型值
            vm.radioFlag = 1;
            vm.regList = {
                Name:wareHouseArea.name ,
                radioFlag:wareHouseArea.goodsFlg,
                cIds: []
            };

             wmsStoreCateList =  data.resultMap.wmsStoreCateList;
            if(wmsStoreCateList==null||wmsStoreCateList == undefined||wmsStoreCateList==""){

            }else {
                for(var i =0 ;i<wmsStoreCateList.length;i++){
                    vm.regList.cIds.push(wmsStoreCateList[i].cateId);
                }
            }
            $("#id_lowtemp").val(wareHouseArea.lowTemper);
            $("#id_higthtemp").val(wareHouseArea.highTemper);
        } else {
            msgAlert.text(' >﹏< [' + data.message + ']');
        }
    })

    //返回按钮
    vm.returnButton = function () {
        window.history.back(-1);
    }

    function categoryTree() {
        $("#categoryTree").jstree({
            "core": {
                "themes": {
                    "responsive": false
                },
                // so that create works
                "check_callback": true,
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state": {"key": "demo2"},
            "plugins": ["dnd", "state", "types", "checkbox"]
        });
    }


    vm.setShowClassify = function () {
        $('#confirmEdit').modal('show');
        Goods.getCategoryList().success(function (data) {
            var oldbox = data.data;
            var row = new Array();
            if (oldbox != null) {
                for (var m = 0; m < oldbox.length; m++) {
                    if (oldbox[m].parentCId == 0) {
                        row.push({"id": oldbox[m].cId, "parent": "#", "text": oldbox[m].name})
                    } else {
                        row.push({"id": oldbox[m].cId, "parent": oldbox[m].parentCId, "text": oldbox[m].name})
                    }
                }
            }
            categoryTree()
            $("#categoryTree").jstree().settings.core.data = row;
            $("#categoryTree").jstree().refresh(true);
            $("#categoryTree").on('changed.jstree', function (e, data) {
                var i, j;
                vm.regList.cIds = [];
                var dataSelect = data.selected;
                for (i = 0, j = dataSelect.length; i < j; i++) {
                    var node = data.instance.get_node(dataSelect[i]);
                    if (node.parent == "#" && node.children.length == 0) {
                        $("#categoryTree").jstree('uncheck_node', node.id);//将节点选中
                        return;
                    } else if (data.instance.is_leaf(node)) {
                        vm.regList.cIds.push(node.id);
                    }
                }
            });

        })
    }
    $('#confirmEdit').on('hide.bs.modal', function () {
        $('#categoryTree').jstree("destroy");
    })
    var id_WarehouseId;
    vm.submitUser = function () {
            var n = []
            if ($.trim(vm.regList.Name) == "") {
                msgAlert.text('有未填写的库区名称')
                return;
            }
            if (vm.regList.radioFlag == 0) {
                n = vm.regList.cIds;
                n.join();
            }
        vm.addParam = {
            areaName:vm.regList.Name,
            goodsFlg: vm.regList.radioFlag,
            areaId:wareHouseArea.id,
            areaCode:wareHouseArea.code ,
            areaType: vm.upradioValue,
            lowTemper: $('#id_lowtemp').val(),
            highTemper: $('#id_higthtemp').val(),
            skuLst: n
        }
        BillManage.wmsWarehouseupdate(vm).success(function (data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.text('修改成功');
                window.location.href = "#/wms/setting/region";
            } else {
                msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
            }
        })
    }
}
]);

