/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope', '$state',
    function($rootScope, $state) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setAngularJsSidebarMenuActiveLink('match', null, $state); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
MetronicApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});


MetronicApp.directive("page", function () {

     return {
         restrict: 'AEC',
         replace: false,
         transclude: true,
         /*controller: 'TmsController',*/
         scope: {
             'pageSize': '=pageSize',
             'pageCount': '=pageCount',
             'pageNum':'=pageNum'
         },
         template:'当前{{pageCount>0?pageSize*pageNum-pageSize+1:0}}-{{pageSize*pageNum>pageCount?pageCount:pageSize*pageNum}} 共计{{pageCount}}条',

     };
 });

MetronicApp.directive('repeatFinish',function(){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                $(".select2me").select2();
                $("[data-toggle='tooltip']").tooltip();
                $(".select2").css('width','auto');
            }
        }
    }
})

MetronicApp.directive('selectInit',function(){
    return {
        link: function(scope,element,attr){
                $(".select2me").select2();
                $(".select2").css('width','auto');
        }
    }
})

MetronicApp.directive('counterInit',function(){
    return {
        link: function(scope,element,attr){
            $('.counter').counterUp();
        }
    }
})


MetronicApp.directive('finishRepeat',function(){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                scope.$eval(attr.finishRepeat)
            }
        }
    }
})

MetronicApp.directive('imgRepeat',function(){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                $(".slider-container").ikSlider({
                    speed: 500
                });
                $(".slider-container").on('changeSlide.ikSlider', function (evt) { console.log(evt.currentSlide); });

                var $preview = $('.preview a');

                function changeActivePreview(i) {
                    $('.active').removeClass('active');
                    $preview.eq(i).addClass('active');
                }

                $preview.on('click', function(e) {
                    e.preventDefault();
                    var index = $(this).index();
                    $('.slider-container').ikSlider(index);
                });

                $('.slider-container').on('changeSlide.ikSlider', function(e) {
                    changeActivePreview(e.currentSlide);
                });

                changeActivePreview(0)
            }
        }
    }
})

MetronicApp.directive('highchart', function () {
        var seriesId = 0;
        var ensureIds = function (series) {
            series.forEach(function (s) {
                if (!angular.isDefined(s.id)) {
                    s.id = "series-" + seriesId++;
                }
            });
        }

        var getMergedOptions = function (element, options, series) {
            var defaultOptions = {
                chart: {
                    renderTo: element[0]
                },
                title: {},
                series: []
            }
            var mergedOptions = {}
            if (options) {
                mergedOptions = $.extend(true, {}, defaultOptions, options);
            } else {
                mergedOptions = defaultOptions;
            }
            if(series) {
                mergedOptions.series = series
            }
            return mergedOptions
        }

        return {
            restrict: 'EC',
            replace: false,
            scope: {
                series: '=',
                options: '=',
                title: '='
            },
            link: function (scope, element, attrs) {

                var mergedOptions = getMergedOptions(element, scope.options, scope.series);
                var chart = new Highcharts.Chart(mergedOptions);

                scope.$watch("series", function (newSeries, oldSeries) {
                    //do nothing when called on registration
                    if (newSeries === oldSeries) return;
                    if (newSeries) {
                        ensureIds(newSeries);
                        var ids = []

                        //Find series to add or update
                        newSeries.forEach(function (s) {
                            ids.push(s.id)
                            var chartSeries = chart.get(s.id);
                            if (chartSeries) {
                                chartSeries.update(angular.copy(s), false);
                            } else {
                                chart.addSeries(angular.copy(s), false)
                            }
                        });
                        //Now remove any missing series
                        chart.series.forEach(function (s) {
                            if (ids.indexOf(s.options.id) < 0) {
                                s.remove(false);
                            }
                        });
                        chart.redraw();
                    }


                }, true);
                scope.$watch("title", function (newTitle) {
                    chart.setTitle(newTitle, true);
                }, true);
                scope.$watch("options", function (newOptions, oldOptions, scope) {
                    //do nothing when called on registration
                    if (newOptions === oldOptions) return;
                    chart.destroy()
                    var mergedOptions = getMergedOptions(element, newOptions);
                    chart = new Highcharts.Chart(mergedOptions);
                    chart.setTitle(scope.title, true);
                    ensureIds(scope.series);
                    scope.series.forEach(function (s) {
                        chart.addSeries(angular.copy(s), false)
                    });
                    chart.redraw()

                }, true);
            }
        }
    });

