angular.module('MetronicApp').controller('squareController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, BillManage,commonUtil,citySelect) {

    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });

    var vm = this;

    vm.charts = {
        options: {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                height:'270px'
            },
            legend: {//控制图例显示位置
                align: 'right',
                verticalAlign: 'middle'
            },
            title: {
                text: ''
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            credits: {
                enabled: false
            },
            series: [{
             type: 'pie',
             name: '仓库使用情况占比',
             data: []
             }]

        }
    }

   /* totalArea 总面积,
    usedArea 已用面积,
    retailArea 零仓面积,
    contractArea 包仓面积,
    ownerArea 自用面积,
    unusedArea 闲置面积*/

    vm.showTabs = function(wareHouseId,store_unit){

        if(store_unit == '01'){
            vm.store_unit = '平方米';
        }else if(store_unit == '02'){
            vm.store_unit = '立方米';
        }else if(store_unit == '03'){
            vm.store_unit = '吨';
        }else{
            vm.store_unit = '';
        }
        vm.wareHouseId = wareHouseId;
        vm.charts.options.series[0].data = [];
        BillManage.qryWarehousePlaneChart(vm).success(function(data) {
            if(data.status==00){
                vm.houseUsageData = data.houseUsage;
                vm.areaChartData = data.areaChart;
                for(var key in vm.houseUsageData){
                    switch (key)
                    {
                        case 'retailAcre':
                            var series = new Array();
                            series[0] = '零仓';
                            series[1] = vm.houseUsageData[key];
                            vm.charts.options.series[0].data.push(series)
                            break;
                        case 'contractAcre':
                            var series = new Array();
                            series[0] = '包仓';
                            series[1] = vm.houseUsageData[key];
                            vm.charts.options.series[0].data.push(series)
                            break;
                        case 'ownerAcre':
                            var series = new Array();
                            series[0] = '自用';
                            series[1] = vm.houseUsageData[key];
                            vm.charts.options.series[0].data.push(series)
                            break;
                        case 'unusedAcre':
                           /* var series = new Array();*/
                            var serie = {
                                name: '闲置',
                                    y: vm.houseUsageData[key],
                                sliced: true,
                                selected: true
                            }
                            /*series[0] = '闲置';
                            series[1] = vm.houseUsageData[key]/vm.houseUsageData['totalArea'];*/
                            vm.charts.options.series[0].data.push(serie)
                            break;
                    }
                }
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
            }
        });
    }

    BillManage.qryWarehouseByUser(vm).success(function(data) {
        if(data.status==00){
            vm.wareList = data.data;
            vm.showTabs(vm.wareList[0].ID,vm.wareList[0].store_unit);
        }else{
            msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
        }
    });

}])