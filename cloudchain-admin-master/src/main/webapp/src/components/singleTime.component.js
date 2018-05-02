/**
 * Created by shaobinhua on 2017/3/4.
 */
angular
    .module('MetronicApp')
    .directive("singleTimePicker", function () {
        return {
            restrict: 'ACE',
            scope: {
                callback: '&'
            },
            replace: true,
            link:function (scope,element,attr) {
                if(attr.time){
                    scope.singlebox= attr.time;
                }else{
                    scope.singlebox= moment().format('YYYY-MM-DD');
                }

                $(element).daterangepicker({

                        opens: (App.isRTL() ? 'left' : 'right'),
                        singleDate: moment(),
                        //minDate: '01/01/2012',
                        //maxDate: '12/31/2014',

                        singleDatePicker:true,
                        showDropdowns: true,
                        showWeekNumbers: false,
                        timePicker: true,
                        timePickerIncrement: 1,
                        timePicker12Hour: true,
                        buttonClasses: ['btn'],
                        applyClass: 'btn-small btn-primary blue',
                        cancelClass: 'btn-small',
                        format: 'YYYY-MM-DD HH:mm:ss',
                        separator: ' to ',
                        locale: {
                            applyLabel: '确定',
                            cancelLabel: '取消',
                            fromLabel: 'From',
                            toLabel: 'To',
                            customRangeLabel: '自由选择',
                            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                            monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                            firstDay: 1
                        }
                    },
                    function (start, end) {
                        scope.$apply(function(){
                            scope.singlebox =  start.format('YYYY-MM-DD');
                            scope.callback();
                        });
                    }
                );
            },
            templateUrl: '/dist/tpl/components/singleTime.view.html'
        };
    });
