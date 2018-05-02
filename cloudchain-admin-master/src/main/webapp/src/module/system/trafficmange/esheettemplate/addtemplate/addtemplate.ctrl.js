angular.module('MetronicApp')
//新建运单打印模板
.controller('addTemplateController',  function ($rootScope, $scope, $http, $location, uiGridConstants, System, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;

    $scope.dtype = 11;

    vm.preview = function () {
        if($scope.dtype == 10){
            VIEW=getLodop();
            VIEW.PRINT_INIT("");
            VIEW.SET_SHOW_MODE("BKIMG_WIDTH",800)
            VIEW.SET_SHOW_MODE("BKIMG_HEIGHT",400)
            VIEW.ADD_PRINT_SETUP_BKIMG("C:\\Users\\sq\\Desktop\\顺丰速运.jpg");
            VIEW.SET_PRINT_STYLEA(0,"Stretch",1)
            for(var key in $scope.items){
                VIEW.ADD_PRINT_TEXT(25*(Number(key) + 1),14,100,20,$scope.items[key].printName);
            }
            VIEW.On_Return=function(TaskID,Value){console.log(Value)};
            VIEW.PRINT_DESIGN()
        }else{
            var wayBill_Lodop_obj = getLodop();
            wayBill_Lodop_obj.PRINT_INITA("2mm","-2mm","98mm","98mm","printWayBillTemplate");
            wayBill_Lodop_obj.SET_PRINT_PAGESIZE(1,"100mm","100mm","");
            wayBill_Lodop_obj.SET_PRINT_MODE("RESELECT_PRINTER",true);
            //判断是否蜂云物流
            if( $scope.list.related_info1 == null){
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
                wayBill_Lodop_obj.ADD_PRINT_BARCODE(14,24,217,64,"EAN128A","箱号");
                wayBill_Lodop_obj.ADD_PRINT_BARCODE(235,39,180,58,"128A","运单号");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"ShowBarText",0);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(294,44,165,25,"运单号格式化");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(115,13,29,112,"客户信息");
                wayBill_Lodop_obj.ADD_PRINT_TEXT(245,245,45,25,"重量");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(287,225,70,35,'实际重量KG');
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(282,297,78,36,"件数");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",16);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(245,312,47,26,"件数");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(322,26,79,25,"发件日期");
                wayBill_Lodop_obj.ADD_PRINT_TEXT(322,131,53,25,"始发地");

                wayBill_Lodop_obj.ADD_PRINT_TEXT(345,18,84,20,"寄件日期");
                wayBill_Lodop_obj.ADD_PRINT_TEXT(345,112,137,26,"发货平台");
                wayBill_Lodop_obj.ADD_PRINT_TEXT(346,266,110,24,"发货仓");
                if( $scope.list.billType =="AFTERSALE_SHIP"){
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(12,200,150,43,"目标站点");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(55,350,100,30,"目标站点序号");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Italic",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(48,222,145,73,"");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Alignment",3);
                    wayBill_Lodop_obj.ADD_PRINT_TABLE(84,240,100,92,"加急");
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(318,289,27,25,"H");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(180,230,138,54,"备注");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",9);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                }else{
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(10,222,150,38,"站点名称");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(44,200,150,43,"目标站点");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Alignment",2);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(55,350,100,30,"目标站点序号");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Italic",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(83,222,145,37,"目标站点序号");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",23);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Alignment",3);
                    wayBill_Lodop_obj.ADD_PRINT_LINE(150,220,150,370,0,1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(159,231,23,59,"客户签收");
                    // if(( $scope.list.unReceivePayAmount).indexOf("￥0.0元")<0){
                    //     wayBill_Lodop_obj.ADD_PRINT_LINE(118,222,117,369,0,1);
                    //     wayBill_Lodop_obj.ADD_PRINT_TEXT(124,258,100,30,"代收货款");
                    //     wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",15);
                    //     wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Italic",1);
                    // }
                    //wayBill_Lodop_obj.ADD_PRINT_TEXT(111,250,115,55,wayBillData.unReceivePayAmount);
                    //wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",15);
                    //wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(211,249,115,23,"     年   月   日");
                    wayBill_Lodop_obj.ADD_PRINT_LINE(200,250,200,370,0,1);
                    wayBill_Lodop_obj.ADD_PRINT_LINE(150,250,230,250,0,1);
                    wayBill_Lodop_obj.ADD_PRINT_TEXT(318,289,27,25,"C");
                    wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                }
                wayBill_Lodop_obj.ADD_PRINT_TEXT(83,35,191,46,"单位名称");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(128,34,189,20,"收件人姓名");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(148,35,188,21,"联系电话");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",12);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(169,34,188,62,"地址");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",10);

                //加急图标  by zangdongjin
                if( $scope.list.urgent==1){
                    wayBill_Lodop_obj. ADD_PRINT_SETUP_BKIMG("<img border='0' src='../resource/img/urgent.png' style='z-index: -1;'/>");
                    wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);
                    wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_PRINT",1);
                    wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_LEFT",200);
                    wayBill_Lodop_obj.SET_SHOW_MODE("BKIMG_TOP",200);
                }

            }else{
                wayBill_Lodop_obj.ADD_PRINT_TEXT(128,34,189,20,"");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",30);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);

                wayBill_Lodop_obj.ADD_PRINT_BARCODE(235,39,180,58,"128A","运单号");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"ShowBarText",0);
                wayBill_Lodop_obj.ADD_PRINT_TEXT(294,44,165,25,"运单号格式化");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontName","黑体");
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"FontSize",13);
                wayBill_Lodop_obj.SET_PRINT_STYLEA(0,"Bold",1);
            }
            // if(wayBill_Lodop_obj.SET_PRINTER_INDEXA("EW")){
                //wayBill_Lodop_obj.PREVIEW();
                //wayBill_Lodop_obj.PRINT_DESIGN();
                wayBill_Lodop_obj.On_Return=function(TaskID,Value){console.log(Value)};
                wayBill_Lodop_obj.PREVIEW();
            // }
        }
    }
    
    vm.changePrintType = function () {
        var data = {
            printType:1,
            billType:$scope.dtype
        }
        System.getPrintCol(data).success(function (data) {
            $scope.list = data.data
            for(var key in $scope.list){
                $scope.list[key].check = false;
            }
        })
    }
    vm.changePrintType()

    $scope.cItem = function (index) {
        var old = angular.copy($scope.list)
        $scope.list[index].check = !old[index].check
        $scope.items = [];
        for(var key in $scope.list){
            if($scope.list[key].check){
                $scope.items.push($scope.list[key])
            }
        }
    }

    vm.save = function () {
        var data = {
            templateName:$scope.templateName,
            printType:$scope.printType,
            billType:$scope.dtype,
            templateInfo:$scope.templateInfo,
            height:$scope.height,
            width:$scope.width,
            fontStyle:$scope.fontStyle,
            fontSize:$scope.fontSize,
            offsetUpdown:$scope.offsetUpdown,
            offsetLeftright:$scope.offsetLeftright,
        }
        System.tmpAdd(data).success(function (data) {
            msgAlert.info(data.msg);
        })
    }

});
