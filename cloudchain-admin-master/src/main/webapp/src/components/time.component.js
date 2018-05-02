angular
    .module('MetronicApp')
    .directive("timePicker", function () {
        return {
            restrict: 'ACE',
            scope: {},
            replace: true,
            link:function (scope,element,attr) {
              /*  scope.startbox = moment().subtract('days', 29).format('YYYY-MM-DD HH:mm:ss');
                scope.endbox = moment().format('YYYY-MM-DD HH:mm:ss');*/
                $(element).daterangepicker({

                        opens: (App.isRTL() ? 'left' : 'right'),
                        startDate: moment().subtract('days', 29),
                        endDate: moment(),
                        //minDate: '01/01/2012',
                        //maxDate: '12/31/2014',

                        dateLimit: {
                            days: 60
                        },
                        singleDatePicker:false,
                        showDropdowns: true,
                        showWeekNumbers: false,
                        timePicker: true,
                        timePickerIncrement: 1,
                        timePicker12Hour: true,
                       /* ranges: {
                            '今天': [moment(), moment()],
                            '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                            '上周': [moment().subtract('days', 6), moment()],
                            '上个月': [moment().subtract('days', 29), moment()],
                            '本月': [moment().startOf('month'), moment().endOf('month')],
                            '下个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                        },*/
                        buttonClasses: ['btn'],
                        applyClass: 'green',
                        cancelClass: 'default',
                        format: 'MM/DD/YYYY',
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
                            scope.startbox =  start.format('YYYY-MM-DD');
                            scope.endbox = end.format('YYYY-MM-DD');
                        });
                    }
                );
            },
            templateUrl: '/dist/tpl/components/time.view.html'
        };
    });
