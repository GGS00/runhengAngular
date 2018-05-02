angular.module('MetronicApp')
    .controller('addstockCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', 'citySelect', 'd2p', 'Goods', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table, citySelect, d2p, Goods) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;

        vm.checkList = {dis: "true", count: 0, clist: []};
        vm.dataLength = 0;
        //查询仓库列表
        BillManage.qryAuthorityHouseLst().success(function (data) {
            for (var j = 0; j < data.length; j++) {
                vm.checkList.clist.push({name: data[j].wareHouseName, flag: false, val: data[j].wareHouseId});
            }
            vm.dataLength = data.length;
        })

        vm.goodsList = [];
        vm.goodsList2 = [];
        /************************************************************上移操作**********************************************************************************/
        vm.topMove = function (pindex, index) {
            vm.goodsList2[pindex].wmsStockTakeAreas[index - 1] = vm.goodsList2[pindex].wmsStockTakeAreas.splice(index, 1, vm.goodsList2[pindex].wmsStockTakeAreas[index - 1])[0];
        }
        /************************************************************下移操作**********************************************************************************/
        vm.downMove = function (pindex, index) {
            vm.goodsList2[pindex].wmsStockTakeAreas[index + 1] = vm.goodsList2[pindex].wmsStockTakeAreas.splice(index, 1, vm.goodsList2[pindex].wmsStockTakeAreas[index + 1])[0];
        }
        vm.rotationFlag = false;//是否轮盘
        /************************************************************库区轮盘是否轮盘 按钮监听***********************************************************************************/
        vm.areaLinsener = function () {
            if (vm.rotationFlag) {//是 轮盘
                if (vm.radioFlag == 1) {//全部盘点
                    vm.currentIndex = 0;
                    vm.goodsList2 = [];
                    vm.allQryAreaLstByHouseId();
                } else if (vm.radioFlag == 0) {//部分盘点
                    vm.goodsList2 = [];
                    vm.currentIndex = 0;
                    vm.checklist2 = [];
                    for (var i = 0; i < vm.checkList.clist.length; i++) {
                        if (vm.checkList.clist[i].flag == true) {
                            vm.checklist2.push({
                                houseId: vm.checkList.clist[i].val,
                                index: i,
                            })
                        }
                    }
                    if (vm.checklist2.length != 0) {
                        vm.allQryAreaLstByHouseId();
                    }
                }

            }else {//否 轮盘
                if (vm.radioFlag == 1) {//全部盘点
                    vm.goodsList2 = [];
                    for(var i=0;i< vm.checkList.clist.length;i++){
                        vm.goodsList2.push(
                            {
                                wareHouseName: vm.checkList.clist[i].name,
                                wareHouseId: vm.checkList.clist[i].val,
                                wmsStockTakeAreas: []
                            }
                        );
                    }
                } else if (vm.radioFlag == 0) {//部分盘点
                    vm.goodsList2 = [];
                    for (var i = 0; i < vm.checkList.clist.length; i++) {
                        if (vm.checkList.clist[i].flag == true) {
                            vm.goodsList2.push(
                                {
                                    wareHouseName: vm.checkList.clist[i].name,
                                    wareHouseId: vm.checkList.clist[i].val,
                                    wmsStockTakeAreas: []
                                }
                            )
                        }
                    }

                }

            }
        }
        /************************************************************根据仓库id查询仓库下所有的库区******************************************************************************/
        vm.allQryAreaLstByHouseId = function () {
            if (vm.radioFlag == 1) {//全部盘点
                if (vm.currentIndex >= vm.checkList.clist.length) {
                    return;
                }
                vm.houseId = vm.checkList.clist[vm.currentIndex].val;
            } else if (vm.radioFlag == 0) {//部分盘点
                if (vm.currentIndex >= vm.checklist2.length) {
                    return;
                }
                vm.houseId = vm.checklist2[vm.currentIndex].houseId;
                vm.index = vm.checklist2[vm.currentIndex].index;
            }
            BillManage.qryAreaLstByHouseId(vm.houseId).success(function (data) {
                if (data.status == '00') {
                    if (data.data.length != 0) {
                        if (vm.radioFlag == 1) {//是
                            vm.goodsList2.push(
                                {
                                    wareHouseName: vm.checkList.clist[vm.currentIndex].name,
                                    wareHouseId: vm.checkList.clist[vm.currentIndex].val,
                                    wmsStockTakeAreas: []
                                }
                            );
                        } else if (vm.radioFlag == 0) {//部分
                            vm.goodsList2.push(
                                {
                                    wareHouseName: vm.checkList.clist[vm.index].name,
                                    wareHouseId: vm.checkList.clist[vm.index].val,
                                    wmsStockTakeAreas: []
                                }
                            );
                        }
                        for (var i = 0; i < data.data.length; i++) {
                            vm.goodsList2[vm.goodsList2.length - 1].wmsStockTakeAreas.push({
                                areaId: data.data[i].areaId,
                                areaName: data.data[i].areaName,

                            })
                        }
                    }
                    vm.currentIndex++;
                    vm.allQryAreaLstByHouseId();
                } else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }

        vm.radioFlag = 0;
        /************************************************************选择仓库监听******************************************************************************/
        vm.selectWare = function (index) {
            if (vm.checkList.dis == "") { //仓库可点击  非全部盘点
                if ($('#checkbox' + index).is(':checked')) {
                    vm.checkList.count++;
                    if (vm.rotationFlag) {//是 轮盘
                        BillManage.qryAreaLstByHouseId(vm.checkList.clist[index].val).success(function (data) {
                            if (data.status == '00') {
                                if (data.data.length != 0) {
                                    vm.goodsList2.push(
                                        {
                                            wareHouseName: vm.checkList.clist[index].name,
                                            wareHouseId: vm.checkList.clist[index].val,
                                            wmsStockTakeAreas: []
                                        }
                                    );
                                    for (var i = 0; i < data.data.length; i++) {
                                        vm.goodsList2[vm.goodsList2.length - 1].wmsStockTakeAreas.push({
                                            areaId: data.data[i].areaId,
                                            areaName: data.data[i].areaName,
                                        })
                                    }
                                }
                            } else {
                                msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                            }
                        })
                    }else {//否  非轮盘
                        vm.goodsList2.push(
                            {
                                wareHouseName: vm.checkList.clist[index].name,
                                wareHouseId: vm.checkList.clist[index].val,
                                wmsStockTakeAreas: []
                            }
                        );
                    }

                } else {
                    vm.checkList.count--;
                    for (var i = 0; i < vm.goodsList2.length; i++) {
                        if (vm.checkList.clist[index].name == vm.goodsList2[i].wareHouseName) {
                            vm.goodsList2.splice(i, 1);
                        }
                    }
                }
                if (vm.checkList.count == vm.dataLength) {
                    vm.warelinsener(1);
                }
            }

        }
        /************************************************************选择仓库监听-设置checkbox选中/不选中状态******************************************************************************/
        vm.warelinsener = function (index) {
            if (index == 1) {//盘点全部
                vm.radioFlag = 1;
                vm.checkList.dis = "true";
                vm.checkList.count = vm.dataLength;
                for (var i = 0; i < vm.checkList.clist.length; i++) {
                    vm.checkList.clist[i].flag = true;
                }
            } else if (index == 0) {//盘点部分
                vm.radioFlag = 0;
                vm.checkList.dis = "";
                vm.checkList.count = 0;
                for (var i = 0; i < vm.checkList.clist.length; i++) {
                    vm.checkList.clist[i].flag = false;
                }
            }
            vm.areaLinsener();
        }
        vm.warelinsener(vm.radioFlag);
        vm.stockType = "01";
        /**************************************************盘点类型监听***********************************************************/
        vm.stockTypeLinsener = function (index) {
            if (index == 1) {//全盘
                vm.stockType = "01";
            } else if (index == 2) {//动碰盘
                vm.stockType = "02";
            } else if (index == 3) {//抽盘
                vm.stockType = "03";
            }
        }


        vm.cIds = "";//商品分类树id，用于获取商品详细
        /*********** **************************************************获取GMS商品信息************************************************************************************/
        vm.skuColumn = [
            {
                field: 'skuId',
                displayName: '商品id',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: true,
                suppressRemoveSort: true,
                enableCellEdit: true, // 是否可编辑
            }, {
                field: "title",
                displayName: '商品名称',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            }
        ]
        vm.placeholder_skuName = '请输入货品';
        vm.icon_sku = 'plus';
        vm.skuParams = {
            bean: 'goods',
            method: 'pageQryUserSkuLst',
            qryUserId: '',
            page: 1,
            rows: 10
        }
        vm.skuPage = function () {
            vm.skuParams.cId = vm.cIds;
            vm.skuParams.title = $scope.skuName;
            commonUtil.getList(vm.skuParams).success(function (data) {
                if (data.additionalMsg.status == '成功' || data.additionalMsg.status == '00') {
                    vm.skuData = data;
                } else if (data.additionalMsg.status == '01') {
                    msgAlert.text('获取商品列表失败 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        };
        //盘点方式
        vm.stockwaya ="01";
        vm.stockway = function (index) {
            if (index == 1) {//明盘
                vm.stockwaya = "01";
            } else if (index == 2) {//暗盘
                vm.stockwaya = "02";
            }
        }
        
        vm.cancel =function () {
            window.location.href ="#/wms/inventory/stocktaking";
        }
        /*********************************************************添加盘点计划***********************************************************/
        vm.add = function () {
            if (vm.stockType == 1) {//全盘

            } else if (vm.stockType == 2) {//动碰盘
                vm.rotorStartTime = $('.rotorStartTime').find("span").html();
                vm.rotorEndTime = $('.rotorEndTime').find("span").html();
                var rotorDay = (new Date(vm.rotorEndTime).getTime() - new Date(vm.rotorStartTime).getTime()) / (24 * 60 * 60 * 1000);
                if (rotorDay >= 0 && rotorDay <= 30) {

                } else {
                    msgAlert.info('请选择最近一个月的时间,且不能超过30天');
                    return;
                }
            } else if (vm.stockType == 3) {//抽盘
            }

            vm.stockStartTime = $('.stockStartTime').find("span").html();
            vm.stockEndTime = $('.stockEndTime').find("span").html();
            var stockDay = (new Date(vm.stockEndTime).getTime() - new Date(vm.stockStartTime).getTime()) / (24 * 60 * 60 * 1000);
            if (stockDay >= 0 && stockDay <= 30) {

            } else {
                msgAlert.info('请选择未来一个月的时间,且不能超过30天');
                return;
            }
            if(vm.goodsList2.length==0){
                msgAlert.info('请选至少勾选一个仓库');
                return;
            }
            vm.proids = [];
            for (var i = 0; i < vm.goodsList.length; i++) {
                vm.proids.push(vm.goodsList[i].spuId);
            }
            if (vm.rotationFlag) {//轮盘
                vm.areaTurnFlag = 1;
                for (var i=0;i<vm.goodsList2.length;i++){
                    for(var j=0;j< vm.goodsList2[i].wmsStockTakeAreas.length;j++){  //轮盘获盘点开始和结束时间
                        vm.goodsList2[i].wmsStockTakeAreas[j].startDt = $('.stockSTime'+i+j ).find("span").html();
                        vm.goodsList2[i].wmsStockTakeAreas[j].endDt= $('.stockETime'+i+j).find("span").html();
                    }
                }
            } else {//非轮盘
                vm.areaTurnFlag = 0;
            }
            vm.wmsStockTakePlanModel = {
                stockTakeHouseInfos: vm.goodsList2, //需要盘点仓库
                checkType: vm.stockType, //盘点类型
                chgSt: vm.rotorStartTime,//  动碰起始时间
                chgEt: vm.rotorEndTime,//动碰截止时间
                productIds: vm.proids, //盘点商品列表
                checkMode: vm.stockwaya,  //盘点方式
                startDt: vm.stockStartTime,    //盘点开始时间
                endDt: vm.stockEndTime,  //盘点结束时间
                areaTurnFlg: vm.areaTurnFlag  //库区轮盘标志
            }

            BillManage.addStockTakePlan( vm).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.info('盘点计划添加成功');
                    window.location.href="#/wms/inventory/stocktaking";
                }else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        }
        /*********************************************************选择商品对话框***********************************************************/
        vm.goodselectDialog = function () {
            $('#lar11ge').modal('show');
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
                "plugins": ["dnd", "state", "types"]
            })

        }

        Goods.getCategoryList().success(function (data) {
            console.log(data)
            var oldbox = data.data;
            var row = new Array();

            row.push({"id": 0, "parent": "#", "text": "全部商品"})
            if (oldbox != null) {
                for (var i = 0; i < oldbox.length; i++) {
                    if (oldbox[i].parentCId == 0) {
                        row.push({"id": oldbox[i].cId, "parent": "#", "text": oldbox[i].name})
                    } else {
                        row.push({"id": oldbox[i].cId, "parent": oldbox[i].parentCId, "text": oldbox[i].name})
                    }
                }
            }
            categoryTree()
            $("#categoryTree").jstree(true).settings.core.data = row;
            $('#categoryTree').jstree(true).deselect_all();
            $("#categoryTree").jstree(true).refresh('true');
            $("#categoryTree").on('changed.jstree', function (e, data) {
                vm.cIds = "";
                var i, j;
                for (i = 0, j = data.selected.length; i < j; i++) {
                    var node = data.instance.get_node(data.selected[i]);
                    if (data.instance.is_leaf(node)) {
                        if (node.id == 0) {
                            node.id = "";
                        }
                        vm.cIds = node.id;
                        vm.skuParams.cId = vm.cIds;
                        vm.skuPage()
                    }
                }
            });
        })
        vm.serachGoods = function () {
            vm.skuPage()
        }
        vm.overClick = function () {
            if (vm.skuEntity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择至少一条商品');
                return false;
            } else {
                // $("#goods1").val(vm.skuEntity.getSelectedRows()[0].title);
                for (var i = 0; i < vm.skuEntity.getSelectedRows().length; i++) {
                    var flag = true;
                    for (var j = 0; j < vm.goodsList.length; j++) {
                        if (vm.skuEntity.getSelectedRows()[i].spuId == vm.goodsList[j].spuId) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        vm.goodsList.push({
                            spuId: vm.skuEntity.getSelectedRows()[i].spuId,
                            spName: vm.skuEntity.getSelectedRows()[i].title,
                            spType: vm.skuEntity.getSelectedRows()[i].cName,
                            spUnit: vm.skuEntity.getSelectedRows()[i].unit
                        })
                    }
                }
                $('#lar11ge').modal('hide');
            }

        }
        vm.removeGoods = function (spuId) {
            for (var j = 0; j < vm.goodsList.length; j++) {
                if (spuId == vm.goodsList[j].spuId) {
                    vm.goodsList.splice(j, 1);
                }
            }
        }
    }
    ]);

