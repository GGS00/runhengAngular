angular.module('MetronicApp')
.controller('packControl', function ($rootScope, $scope, $http, $stateParams, uiGridConstants, settings, BillManage, commonUtil, Table) {
    var vm = this
    vm.id = $stateParams.ID
    $scope.ifPrintSerial = true

    vm.getPage = function () {
        vm.shipParams = {
            bean: 'wmsShip',
            method: 'page',
            id:  vm.id ,
            page: 1,
            rows: 10
        }
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.shipParams
        }).success(function (data) {
            $scope.data = data.rows[0];
            vm.pageParams.outboundId = $scope.data.OUTBOUND_ID ,
            vm.pageParams.warehouseId = $scope.data.WAREHOUSE_ID ,

            vm.getOutPage()
            vm.getShipPage()
        })
    };
    vm.getPage();


    vm.pageParams = {
        bean: 'wmsOutboundItem',
        method: 'page',
        page: 1,
        rows: 10
    }

    vm.column = [
        {
            field: 'ID',
            displayName: '序号',
        },
        {
            field: 'PRODUCT_CODE',
            displayName: '货品编码',
        },
        {
            field: 'PRODUCT_NAME',
            displayName: '货品名称',
        },
        // {
        //     field: 'OWNER_ID',
        //     displayName: '国标码',
        // },
        {
            field: 'expectedQuantityBU',
            displayName: '计划数量',
        },
        {
            field: 'inventoryStatus',
            displayName: '货品状态',
        },
        // {
        //     field: 'OWNER_ID',
        //     displayName: '串码管理',
        // },
        // {
        //     field: 'OWNER_ID',
        //     displayName: '串码',
        // },
    ]

    vm.getOutPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.pageParams
        }).success(function (data) {
            vm.outdata = data;
        })
    };

    vm.shipParams = {
        bean: 'wmsShipItem',
        method: 'page',
        page: 1,
        rows: 10,
        shipId:vm.id
    }

    vm.shipcolumn = [
        {
            field: 'id',
            displayName: '序号',
        },
        {
            field: 'package_box_no',
            displayName: '箱号',
        },
        {
            field: 'weight',
            displayName: '重量',
        },
    ]

    vm.getShipPage = function () {
        $http({
            url: "/process", method: "get",
            params: vm.shipParams
        }).success(function (data) {
            vm.shipdata = data;
        })
    }

    vm.printList = function () {
        BillManage.getOutboundPrintData(vm.id).success(function (data) {
            vm.outbound = data.outboundPrintListModel.outbound
            vm.packageTask = data.outboundPrintListModel.packageTask
            vm.packingList = data.outboundPrintListModel.packingList
            vm.uniqueCodeList = data.outboundPrintListModel.uniqueCodeList
            var innerHtml = "<table id='table0' style='width:760px;font-size: 12px;' border='1' cellSpacing=0 cellPadding=1 >"
                + "<thead style='height: 60px;font-size: large;width: 760px'>" + "<tr>"
                + "<th colspan='6' align='center' ><b>柴米云仓 出库单</b></th>" + "</tr>" + "</thead>" + "<tbody>"
                + "<tr align='left' >" + "<td style='width:100px;height: 20px'  >出库订单号</td>"
                + "<td style='width:250px;' align='center'>"
                + (vm.packageTask[0].outboundCode == null ? "-" : vm.packageTask[0].outboundCode )
                + "</td>" + "<td style='width:60px;'>货主</td>" + "<td style='width:100px;'align='center'>"
                + (vm.packageTask[0].name == null ? "-" : vm.packageTask[0].name) + "</td>"
                + "<td style='width:60px;'>日期</td>" + "<td style='width:100px;'colspan='3' align='center' >"
                + (vm.packageTask[0].generateTime == null ? "-" :vm.packageTask[0].generateTime)
                + "</td>" + "</tr>" + "<tr align='left'>" + "<td style='width:100px;height: 20px'>客户名称</td>"
                + "<td align='center'>"
                + (vm.packageTask[0].receiverName == null ? "-" : vm.packageTask[0].receiverName)
                + "</td>" + "<td >联系人</td>" + "<td align='center'>"
                + (vm.packageTask[0].contactor == null ? "-" : vm.packageTask[0].contactor)
                + "</td>" + "<td >电话</td>" + "<td align='center' colspan='3'>"
                + (vm.packageTask[0].mobile == null ? "-" : vm.packageTask[0].mobile) + "</td>"
                + "</tr>" + "<tr align='left'>" + "<td style='width:100px;height: 20px'>地址</td>"
                + "<td align='center' colspan='3'>"
                + (vm.packageTask[0].address == null ? "-" : vm.packageTask[0].address) + "</td>"
                + "<td >出库数量</td>" + "<td align='center' style='font-size:15pt;font-weight:bold'>" + 0 + "</td>"
                + "<td style='width:40px;'>箱数</td>" + "<td align='center'>"
                + (vm.packageTask[0].packageBoxQuantity == null ? "0" :vm.packageTask[0].packageBoxQuantity )
                + "</td>" + "</tr>" + "<tr align='left'>" + "<td>备注</td>" + "<td style='height: 20px;' colspan='9'>"
                + (vm.packageTask[0].description == null ? "-" : vm.packageTask[0].description)
                + "</td>" + "</tr>";
            // if (!vm.packageTask[0].project_code == "51FAST" && !vm.packageTask[0].project_code == "51CHANGE") {
            //     innerHtml += "<tr>"
            //         + "<td style='width:100px;height: 35px'>代收货款：</td><td colspan='7' ><b style='font-size:16px;'>"
            //         + (vm.packageTask[0].un_receive_payment == null ? "0" : "￥" + vm.packageTask[0].un_receive_payment)
            //         + "元" + "</b>" + "&nbsp;&nbsp;=&nbsp;&nbsp;订单总金额:￥" + wmsPackinginfo.get(0).get("total_amount")
            //         + "元&nbsp;&nbsp;-&nbsp;&nbsp;已付金额:￥" + wmsPackinginfo.get(0).get("paid_amount")
            //         + "元&nbsp;&nbsp;-&nbsp;&nbsp;减免金额:￥" + wmsPackinginfo.get(0).get("reduction_amount")
            //         + "元 &nbsp;&nbsp;+&nbsp;&nbsp;运费:￥" + wmsPackinginfo.get(0).get("freight") + "元" + " </td>"
            //         + "</tr>";
            // }
            innerHtml += "</tbody></table>"
                + "<table id='table1'style='width:760px;font-size: 12px;' border='1' cellSpacing=0 cellPadding=1><tbody><tr>"
                + "<th colspan='10' align='center'  border='0' style='height: 20px;' colspan='10'><b>订单详情</b></th>"
                + "</tr>" + "<tr align='center'>" + "<td style='width:200px; height: 20px'>货品名称</td>"
                + "<td style='width:90px;'>数量</td>" + "<td style='width:90px;'>单价</td>"
                + "<td style='width:200px;'>货品名称</td>" + "<td style='width:90px;'>数量</td>"
                + "<td style='width:90px;'>单价</td>" + "</tr><tr align='center'>";
                for (var i = 0; i < vm.packingList.length; i++) {
                        if ((i + 1) % 2 == 0) {
                            innerHtml += "<td style=' height: 20px'>" + (vm.packingList[i].name == null ? "-" :  vm.packingList[i].name) + "</td>"
                                       + "<td >" +  (vm.packingList[i].quantity_bu == null ? "0" :vm.packingList[i].quantity_bu) + "</td>"
                                       + "<td >" + (vm.packingList[i].price == null ? "0" : vm.packingList[i].price) + "</td>" + "</tr>";
                        }
                        else {
                            innerHtml += "<td>" + (vm.packingList[i].name == null ? "-" : vm.packingList[i].name) + "</td>"
                                       + "<td>" + (vm.packingList[i].quantity_bu == null ? "0" : vm.packingList[i].quantity_bu) + "</td>"
                                       + "<td>" + (vm.packingList[i].price == null ? 0 : vm.packingList[i].price) + "</td>";
                        }
                }
                if (vm.packingList.length % 2 != 0) {
                    innerHtml += "<td></td><td></td><td></td></tr>";
                }
                console.log(innerHtml)
            // 打印串号明细并且存在串号设备
            if ("true"== $scope.ifPrintSerial && vm.uniqueCodeList.length > 0) {
                innerHtml += "</tbody></table><table id='table2' style='width:760px;font-size: 12px;' border='1' cellSpacing=0 cellPadding=1><thead>"
                    + "<tr border='0'>"
                    + "<th align='center'  border='0' style='height: 20px;' colspan='10'>串号明细</th></thead>"
                    + "</tr>" + "<tbody><tr align='center'>" + "<th  style='width:50px;'>序号</th>"
                    + "<th  style='width:200px;'>货品名称</th>" + "<th  style='width:130px;'>序列号</th>"
                    + "<th  style='width:50px;'>序号</th>" + "<th  style='width:200px;'>货品名称</th>"
                    + "<th  style='width:130px;'>序列号</th></tr><tr align='center'>";
                for (var i = 0; i < vm.uniqueCodeList.length > 0; i++) {
                    // Map<String, Object> map = wmsOutBoundDetailList.get(i);
                    if ((i + 1) % 2 == 0) {
                        innerHtml += "<td>" + (i + 1) + "</td>" + "<td>"
                            + (vm.uniqueCodeList[i].name == null ? "-" : vm.uniqueCodeList[i].name) + "</td><td>"
                            + (vm.uniqueCodeList[i].serial_no == null ? "-" : vm.uniqueCodeList[i].serial_no) + "</td></tr>";
                    }
                    else {
                        innerHtml += "<tr align='center'>" + "<td>" + (i + 1) + "</td>" + "<td>"
                            + (vm.uniqueCodeList[i].name == null ? "-" : vm.uniqueCodeList[i].name) + "</td><td >"
                            + (vm.uniqueCodeList[i].serial_no == null ? "-" : vm.uniqueCodeList[i].serial_no) + "</td>";
                    }
                }
                if (vm.uniqueCodeList.length % 2 != 0) {
                    innerHtml += "<td></td><td ></td><td></td></tr>";
                }
            }


            innerHtml += "</tbody>" + "<tfoot style='margin-top: 90%'>" + "<tr align='left'>"
                + "<td  style='padding-left:8px;height: 30px;'colspan='6'><b>您的签字代表您已确认所收货物与清单一致并外观无损，您签收后，柴米云仓无法对非功能性故障负责。&nbsp;签收人：_______________</b></td>"
                + "</tr>" + "</tfoot>" + "</table>";

            var shipData0 = innerHtml.split("</table>")[0]+"</table>";
            var shipData1 = innerHtml.split("</table>")[1]+"</table>";
            var shipData2 = innerHtml.split("</table>")[2]+"</table>";
            LODOP.PRINT_INIT("");
            LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW",true);
            LODOP.SET_PRINT_PAGESIZE (1, 0, 0,"A4");
            LODOP.ADD_PRINT_TABLE(60,0,"100%","85%",shipData0);
            LODOP.ADD_PRINT_TABLE(0,0,"100%","85%",shipData1);
            LODOP.SET_PRINT_STYLEA(0,"LinkedItem",-1);
            LODOP.ADD_PRINT_TABLE(0,0,"100%","85%",shipData2);
            LODOP.SET_PRINT_STYLEA(0,"LinkedItem",-1);
            // LODOP.ADD_PRINT_BARCODE(70,"74%",170,45,"128A",barcodeId);
            LODOP.SET_PRINT_STYLEA(0,"FontSize",13);


            // if(!continuity){
            //     LODOP.ADD_PRINT_LINE("150.5mm","1mm","150.5mm","195mm",2,0);
            //     LODOP.ADD_PRINT_TEXT("148.5mm","95mm","30mm","10mm","沿此线剪开");
            //     LODOP.ADD_PRINT_TABLE(620,0,"100%","85%",shipData0);
            //     LODOP.ADD_PRINT_TABLE(0,0,"100%","85%",shipData1);
            //     LODOP.SET_PRINT_STYLEA(0,"LinkedItem",-1);
            //     LODOP.ADD_PRINT_TABLE(0,0,"100%","85%",shipData2);
            //     LODOP.SET_PRINT_STYLEA(0,"LinkedItem",-1);
            //     // LODOP.ADD_PRINT_BARCODE(630,"74%",170,45,"128A",barcodeId);
            //     LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
            // }


            // LODOP.ADD_PRINT_TABLE(150,27,664,880,innerHtml);
            LODOP.PREVIEW ();



            // if ((wmsPackinginfo.get(0).get("name")).equals("蜂星订货会")) {
            //
            //     innerHtml += "<tr align='left'>"
            //         + "<td  style='padding-left:8px;height: 30px;'colspan='6'><b>请收到机器同时不要忘记在B2B系统里签收串码</b></td>"
            //         + "</tr>";
            // }


        })
    }

    vm.printOut = function () {
        var ids = {
            outboundId:vm.pageParams.outboundId,
            warehouseId:vm.pageParams.warehouseId,
            packageTaskId:vm.id,
        }
        BillManage.getWayBillData(ids).success(function (data) {
            var cartonLabelData = data.cartonLabelObjectList
            var wayBillData = data.wayBillData
            //<%-- 打印模板 --%>
            var wayBill_Lodop_obj = getLodop();
            wayBill_Lodop_obj.PRINT_INITA("2mm","-2mm","98mm","98mm","printWayBillTemplate");
            wayBill_Lodop_obj.SET_PRINT_PAGESIZE(1,"100mm","100mm","");
            wayBill_Lodop_obj.SET_PRINT_MODE("RESELECT_PRINTER",true);
            //判断是否蜂云物流
            if(wayBillData.related_info1 == null){
                wayBill_Lodop_obj.ADD_PRINT_LINE(80,10,80,370,0,1);
                wayBill_Lodop_obj.ADD_PRINT_LINE(45,220,45,370,0,1);
                wayBill_Lodop_obj.ADD_PRINT_LINE(10,220,370,220,0,1);
                wayBill_Lodop_obj.ADD_PRINT_LINE(80,30,230,30,0,1);
                wayBill_Lodop_obj.ADD_PRINT_LINE(230,10,230,370,0,1);
                wayBill_Lodop_obj.ADD_PRINT_LINE(270,220,270,370,0,1);
                wayBill_Lodop_obj.ADD_PRINT_LINE(230,295,315,295,0,1);
                wayBill_Lodop_obj.ADD_PRINT_LINE(315,10,315,370,0,1);
                wayBill_Lodop_obj.ADD_PRINT_LINE(315,90,370,90,0,1);
                wayBill_Lodop_obj.ADD_PRINT_LINE(340,10,340,370,0,1);
                wayBill_Lodop_obj.ADD_PRINT_RECT(10,10,360,360,0,1);
                wayBill_Lodop_obj.ADD_PRINT_BARCODE(14,24,217,64,"EAN128A",cartonLabelData.boxNo);
                wayBill_Lodop_obj.ADD_PRINT_BARCODE(235,39,180,58,"128A",wayBillData.wayBillCode);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"ShowBarText",0);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(294,44,165,25,wayBillData.wayBillCodeFormat);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(115,13,29,112,"客户信息");
                wayBill_Lodop_obj.ADD_PRINT_TEXT(245,245,45,25,"重量");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(287,225,70,35,wayBillData.realWeight+'KG');
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(282,297,78,36,cartonLabelData.boxQty);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",16);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(245,312,47,26,"件数");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(322,26,79,25,"发件日期");
                wayBill_Lodop_obj.ADD_PRINT_TEXT(322,131,53,25,"始发地");

                wayBill_Lodop_obj.ADD_PRINT_TEXT(345,18,84,20,wayBillData.sendDate);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(345,112,137,26,cartonLabelData.platName);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(346,266,110,24,cartonLabelData.shipWarehouse);
                if(wayBillData.billType =="AFTERSALE_SHIP"){
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(12,200,150,43,cartonLabelData.toPlatFormName);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(55,350,100,30,cartonLabelData.toPlatNo);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Italic",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(48,222,145,73,cartonLabelData.toDistrict);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Alignment",3);
                    wayBill_Lodop_obj.ADD_PRINT_TABLE(84,240,100,92,wayBillData.seal);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(318,289,27,25,"H");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(180,230,138,54,wayBillData.description);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",9);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                }else{
                    //加急图标放到外层 by zangdongjin
                    /*if(wayBillData.urgent==1){
                     wayBill_Lodop_obj. ADD_PRINT_SETUP_BKIMG("<img border='0' src='../images/urgent.png' style='z-index: -1;'/>");
                     wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);
                     wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_PRINT",1);
                     wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_LEFT",200);
                     wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_TOP",200);
                     }*/
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(10,222,150,38,cartonLabelData.toProvinceName);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(44,200,150,43,cartonLabelData.toPlatFormName);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Alignment",2);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(55,350,100,30,cartonLabelData.toPlatNo);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Italic",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(83,222,145,37,cartonLabelData.toDistrict);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Alignment",3);
                    wayBill_Lodop_obj.ADD_PRINT_LINE(150,220,150,370,0,1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(159,231,23,59,"客户签收");
                    // if((wayBillData.unReceivePayAmount).indexOf("￥0.0元")<0){
                    //     wayBill_Lodop_obj.ADD_PRINT_LINE(118,222,117,369,0,1);
                    //     wayBill_Lodop_obj.ADD_PRINT_TEXT(124,258,100,30,"代收货款");
                    //     wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",15);
                    //     wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Italic",1);
                    // }
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(111,250,115,55,wayBillData.unReceivePayAmount);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",15);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(211,249,115,23,"     年   月   日");
                    wayBill_Lodop_obj.ADD_PRINT_LINE(200,250,200,370,0,1);
                    wayBill_Lodop_obj.ADD_PRINT_LINE(150,250,230,250,0,1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(318,289,27,25,"C");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                }
                wayBill_Lodop_obj.ADD_PRINT_TEXT(83,35,191,46,wayBillData.toReceiverName);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(128,34,189,20,wayBillData.toReceiverContactorName);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(148,35,188,21,wayBillData.toReceiverContactorPhone);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(169,34,188,62,wayBillData.toTransLocationAddress);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",10);

                //加急图标  by zangdongjin
                if(wayBillData.urgent==1){
                    wayBill_Lodop_obj. ADD_PRINT_SETUP_BKIMG("<img border='0' src='../resource/img/urgent.png' style='z-index: -1;'/>");
                    wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);
                    wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_PRINT",1);
                    wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_LEFT",200);
                    wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_TOP",200);
                }

            }else{
                wayBill_Lodop_obj.ADD_PRINT_TEXT(128,34,189,20,wayBillData.related_info1);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",30);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);

                wayBill_Lodop_obj.ADD_PRINT_BARCODE(235,39,180,58,"128A",wayBillData.wayBillCode);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"ShowBarText",0);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(294,44,165,25,wayBillData.wayBillCodeFormat);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
            }
            // if(wayBill_Lodop_obj.SET_PRINTER_INDEXA("EW")){
                //wayBill_Lodop_obj.PREVIEW();
                //wayBill_Lodop_obj.PRINT_DESIGN();
                wayBill_Lodop_obj.PREVIEW();

        })
    }


    vm.checkUniCode = function () {

        if($scope.uniCode == undefined || $scope.uniCode.length < 1){msgAlert.text('请输入串码');return false;}

        var info = {
            uniqueCodes:$scope.uniCode,
            packageTaskId:vm.id,
        }

        BillManage.checkUniCode(info).success(function (data) {
            msgAlert.text(data.msg)
        })
    }

    vm.confirmPackage = function () {
        if(vm.boxQty == undefined || vm.boxQty == ""){
            msgAlert.text("填写数量")
            return false;
        }

        if(vm.weight == undefined || vm.weight == ""){
            msgAlert.text("填写重量")
            return false;
        }

        var info = {
            boxQty:vm.boxQty,
            weight:vm.weight,
            packageTaskId:vm.id
        }

        BillManage.confirmPackage(info).success(function (data) {
            vm.getShipPage()
            msgAlert.text(data.msg)
        })

    }

    vm.overPackage = function () {
        BillManage.overPackage(vm.id).success(function (data) {
            msgAlert.text(data.msg)
        })

    }

})





