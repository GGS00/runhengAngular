angular.module('MetronicApp')
    .controller('goodmanageCtrl',function ($rootScope, $scope, $stateParams,$http, uiGridConstants, settings, BillManage, commonUtil, Goods) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.menuLen = 4;
        var userid = $stateParams.Id;
        vm.channe1 = "";
        vm.column = [{
            field: "skuId",
            displayName: '商品sku编号',
            width: 100,
            // visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
            {
                field: 'skuName',
                displayName: '商品名称',
                width: 100,
                // visible: false,
            },
            {
                field: 'spec',
                displayName: '规格',
                // visible: false,
            },
            {
                field: "cName",
                displayName: '商品分类',
                width: 100,
                // visible: false,
            },
            {
                field: "supplierId",
                displayName: '供应商编号',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                width: 100,
                // cellTemplate: '<a ui-sref="wms.outbound.details({id:row.entity.ID})" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
            },
            {
                field: "supplierName",
                displayName: '公司简称',
                width: 200,
                // cellTemplate:'<div style="padding:5px">{{row.entity.BILL_TYPE_CODE=="sales_out"?"销售出库单":(row.entity.BILL_TYPE_CODE=="traces_out"?"溯源出库单":(row.entity.BILL_TYPE_CODE=="traces_in"?"溯源入库单":(row.entity.BILL_TYPE_CODE=="sales_in"?"销售入库单":(row.entity.BILL_TYPE_CODE=="sales_out"?"销售出库单":""))))}}</div>'

            },
            {
                field: "priceStr",
                displayName: '供货价',
                width: 150,
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">' +
                                '<a ng-show="!row.entity.pricecheck" ng-click="row.entity.pricecheck = true">{{row.entity.priceStr}}</a>' +
                                '<input ng-show="row.entity.pricecheck" ng-blur="grid.appScope.$parent.goodmanage.priceblur(row.entity.index)" ng-model="row.entity.price" type="number" min="0" class="form-control" style="padding-left:6px !important;" />' +
                                '</div>'

            },
            {
                field: "qty",
                displayName: '供应量',
                width: 150,
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">' +
                            '<a ng-show="!row.entity.qtycheck" ng-click="row.entity.qtycheck = true">{{row.entity.qty}}</a>' +
                            '<input ng-show="row.entity.qtycheck" ng-blur="grid.appScope.$parent.goodmanage.qtyblur(row.entity.index)" ng-model="row.entity.qty" type="number" min="0" class="form-control" style="padding-left:6px !important;" />' +
                            '</div>'
            },
            // {
            //     field: "channel",
            //     displayName: '销售渠道',
            //     width: 240,
            //     // cellTemplate:'<div style="padding:5px" ng-model="goodmanage.channe1">{{grid.appScope.$parent.goodmanage.channe1}}</div>'
            //     cellTemplate:"<div class=\"ui-grid-cell-contents\" ng-init=\"cList = ['批发','零售','门店','联盟']\"><span ng-if=\"row.entity.channel != '0000'\" ng-repeat=\"list in row.entity.channel.split('') track by $index\">{{list == 1?cList[$index]+'/':''}}</span><span ng-if=\"row.entity.channel == '0000'\">未设置销售渠道</span></div>"
            // },
            // {
            //         field: "STATUS",
            //     displayName: '批发价格',
            //     width: 100,
            //     cellTemplate:'<div style="padding:5px">{{row.entity.STATUS=="FINISHED"?"完成":(row.entity.STATUS=="DELETE"?"删除":(row.entity.STATUS=="ACTIVE"?"生效":(row.entity.STATUS=="OPEN"?"打开":(row.entity.STATUS=="WORKING"?"作业中":(row.entity.STATUS=="ALLOCATED"?"已分配":"")))))}}</div>'
            // },
            // {
            //     field: "ALLOCATE_STATUS",
            //     displayName: '添加来源',
            //     width: 100,
            //     cellTemplate:"<div class=\"ui-grid-cell-contents\" ng-init=\"dataFrom = ['','A','供应商','TMS']\"><span>{{dataFrom[row.entity.dataFrom]}}</span></div>"
            // },
            // {
            //     field: "PICK_STATUS",
            //     displayName: '当前状态',
            //     width: 100,
            // },
            // {
            //     field: "SHIP_STATUS",
            //     displayName: '操作',
            //     width: 100,
            //     cellTemplate: '<a style="display: block;margin: 5px;">查看</a>'
            //     // cellTemplate:'<span>{{row.entity.SHIP_STATUS=="UN_SHIP"?"待发运":(row.entity.SHIP_STATUS=="PART_SHIPPED"?"部分发运":(row.entity.SHIP_STATUS=="SHIPPED"?"已发运":"-"))}}</span>'
            // }
        ]
        vm.params = {
            supplierId: userid,
            bean: 'gmsSupplier',
            method: 'pageGetSupplierSkuList',
            page: 1,
            rows: 10
        }
        vm.addrType1 = new Array();
        vm.getPage = function () {
            commonUtil.getList(vm.params).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    for(var i =0;i < data.rows.length;i++) {
                        data.rows[i].index = i;
                        data.rows[i].qtycheck = false;
                        data.rows[i].pricecheck = false;
                        data.rows[i].price = data.rows[i].price/100
                    }
                    vm.data = data;
                    vm.rows = data.rows
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getPage();


        vm.qtyblur = function (i) {
            vm.data.rows[i].qtycheck = false;
            $scope.batch(i)
        }

        vm.priceblur = function (i) {
            vm.data.rows[i].pricecheck = false;
            $scope.batch(i)
        }

        $scope.batch = function (key) {
            var info =[{
                id:vm.rows[key].relId,
                price: vm.rows[key].price * 100,
                skuId:vm.rows[key].skuId,
                supplierId:vm.rows[key].supplierId,
                qty:vm.rows[key].qty,
            }]
            Goods.batchSupplier(angular.toJson(info)).success(function (data) {
                if(data.status == "00"){
                    vm.getPage();
                }else{
                    msgAlert.text(data.msg);
                }
            })
        }
        
        $scope.allshow = function (id) {
            if(vm.entity.getSelectedRows().length == 0){
                msgAlert.text('至少选择一个');
                return false;
            }
            switch (id){
                case 1:
                    $("#priceEdit").modal('show')
                    break;
                case 2:
                    $("#qtyEdit").modal('show')
                    break;
            }
        }

        $scope.batchPrice = function () {
            if(vm.listPrice == "" || vm.listPrice == undefined){
                alert("不能为空值");return;
            }
            var info = [];
            var a = vm.entity.getSelectedRows();
            for(var key in a){
                info[key] ={
                    id:a[key].relId,
                    price: vm.listPrice * 100,
                    skuId:a[key].skuId,
                    supplierId:a[key].supplierId,
                    qty:a[key].qty,
                }
            }
            $scope.batchSupplier(info)
        }

        $scope.batchQty = function () {
            if(vm.listQty == "" || vm.listQty == undefined){
                alert("不能为空值");return;
            }
            var info = [];
            var a = vm.entity.getSelectedRows();
            for(var key in a){
                info[key] ={
                    id:a[key].relId,
                    price: a[key].priceStr * 100,
                    skuId:a[key].skuId,
                    supplierId:a[key].supplierId,
                    qty:vm.listQty,
                }
            }
            $scope.batchSupplier(info)
        }

        $scope.batchSupplier = function (info) {
            Goods.batchSupplier(angular.toJson(info)).success(function (data) {
                if(data.status == "00"){
                    vm.getPage();
                    msgAlert.text("保存成功");
                }else{
                    msgAlert.text(data.msg);
                }
            })
        }


        //返回按钮
        vm.returnButton = function () {
            window.history.back(-1);
        }
        vm.toCreateWaybill = function () {
            window.location.href = "#/supplier/addgood/"+"gm";

        }

        /*************************************************搜索商品管理*******************************************************/
        vm.GoodManageFind =function () {
            vm.params = {
                bean: 'gmsSupplier',
                method: 'pageGetSupplierSkuList',
                page: 1,
                rows: 10,
                skuId : $("#skuId_id").val(),
                supplierId: $("#supplierId_id").val(),
            }
            vm.getPage();

        }


    });



