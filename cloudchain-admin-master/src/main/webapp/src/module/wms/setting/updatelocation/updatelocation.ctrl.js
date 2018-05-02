angular.module('MetronicApp')
    .controller('updatelocationCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', 'citySelect', 'd2p', 'Goods', '$stateParams','$location', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table, citySelect, d2p, Goods, $stateParams,$location) {

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.regionId = $location.search().Id;
        vm.areaName = $location.search().areaName;
        vm.wareHouseName = $location.search().wareHouseName;

        $("#id_warehouse").val(vm.wareHouseName);
        $("#id_area").val(vm.areaName);
        //返回按钮
        vm.returnButton = function () {
           window.location.href="#/wms/setting/location";
        }
        var locationData ;
        var wmsStoreCateList;
        BillManage.qryHouseLocationDetailById(vm).success(function (data) {
            if (data.status == '00') {
                locationData = data.resultMap.location;

                vm.regList = {
                    Name:locationData.name ,
                    mark:locationData.mark+"",
                    radioFlag:locationData.goodsFlg,
                    cIds: []
                };

                wmsStoreCateList =  data.resultMap.wmsStoreCateList;
                if(wmsStoreCateList==null||wmsStoreCateList == undefined||wmsStoreCateList==""){

                }else {
                    for(var i =0 ;i<wmsStoreCateList.length;i++){
                        vm.regList.cIds.push(wmsStoreCateList[i].cateId);
                    }
                }
            } else {
                msgAlert.text(' >﹏< [' + data.message + ']');
            }
        })
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
        vm.submitUser = function () {
            var n = []
            if ($.trim(vm.regList.Name) == "") {
                msgAlert.text('有未填写的库位名称')
                return;
            }
            if (vm.regList.radioFlag == 0) {
                n = vm.regList.cIds;
                n.join();
            }
            vm.updateParam = {
              locationId:vm.regionId,
              locationCode:locationData.code,
              locationName:vm.regList.Name,
              locationType:locationData.type,
                mark:vm.regList.mark,
              goodsFlg:vm.regList.radioFlag,
              skuLst:n
            }
            BillManage.wmsWarehouseLocationUpdate(vm).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.text('修改成功');
                    window.location.href = "#/wms/setting/location";
                } else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }
    }
    ]);

