//安装nodejs ,配置到idea重启,
//确保package.json的存在,执行npm install(只需要第一次执行)
//右键gulpfile.js 选择show gulp tasks 配置完成后 执行default


//开发区域src  运行区域dist
//在src创建自己对应的负责模块
//例如：用户管理模块,文件夹结构/module/User/
//用户管理模块User包含  **/*.html   **/*.ctrl.js /   user.service.js  user.router.js

//dist包含了src合并后的js和tpl目录
// 除了引入sass和assets等公共文件，home.html, src的js -> src="",templateUrl=""总是引用dist的路径


//打包命令操作(gulp 或者 gulp default 执行所有, 单个执行gulp + task的'任务名')
//例如：gulp  miniCtrl


var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),//压缩css
    concat = require('gulp-concat'),//



    uglify = require('gulp-uglify'),//压缩
    rename = require('gulp-rename'),//重命名
    del = require('del'),//删除
    flatten = require('gulp-flatten');//文件夹层级管理


gulp.task('miniCtrl', function() {  //合并压缩 控制器
    return gulp.src('src/module/**/*.ctrl.js')
        .pipe(concat('controllers.js'))//合并所有ctrl.js到controllers.js
        .pipe(gulp.dest('dist/js'))    //输出到dist/js文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/js'));  //输出
});
gulp.task('miniService', function() { //合并压缩 服务
    return gulp.src('src/module/**/*.service.js')
        .pipe(concat('services.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/js'))//输出
});
gulp.task('miniRouter', function() { //合并压缩 路由
    return gulp.src('src/module/**/*.router.js')
        .pipe(concat('router.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/js'))//输出
});
gulp.task('miniComponents', function() { //合并压缩 组件
    return gulp.src('src/components/**/*.component.js')
        .pipe(concat('components.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/js'))
});
gulp.task('miniJs',function () {   //转移压缩 主要js
    return  gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/js'))
})
gulp.task('createJs',['miniCtrl','miniService','miniRouter','miniComponents','miniJs'])


/*gulp.task('commonhtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/!**!/!**!/!*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl'))
})*/

gulp.task('commonhtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/common/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/common'))
})

gulp.task('dashhtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/dashboard/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/dashboard'))
})

gulp.task('goodshtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/goods/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/goods'))
})

gulp.task('orghtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/org/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/org'))
})

gulp.task('systemhtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/system/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/system'))
})

gulp.task('traceabilityhtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/traceability/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/traceability'))
})


gulp.task('transportHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/transport/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/transport'))
})

gulp.task('userHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/user/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/user'))
})

gulp.task('wmsHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/wms/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/wms'))
})
gulp.task('orderHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/order/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/order'))
})
gulp.task('d2pHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/d2p/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/d2p'))
})

gulp.task('d2dHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/d2d/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/d2d'))
})

gulp.task('d2wHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/d2w/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/d2w'))
})

gulp.task('supplierHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/supplier/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/supplier'))
})

gulp.task('lmsHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/lms/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/lms'))
})

gulp.task('fmsHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/fms/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/fms'))
})

gulp.task('wholesaleHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/wholesale/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/wholesale'))
})

gulp.task('homepageHtml',function () {  //从src转移html到dist
    return  gulp.src('src/module/homepage/**/*.html')
        .pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest('dist/tpl/homepage'))
})


// gulp.task('mvCommon',['mvHtml'],function () {//执行完'mvHtml'转移html后提出common文件夹
//     return  gulp.src([
//                 'dist/tpl/footer.html',
//                 'dist/tpl/header.html',
//                 'dist/tpl/sidebar.html',
//                 'dist/tpl/theme-panel.html',
//             ])
//         .pipe(gulp.dest('dist/tpl/common'))
// })
gulp.task('mvComp',function () {  //转移 组件html
    return  gulp.src('src/components/**/*.html')
        .pipe(flatten())
        .pipe(gulp.dest('dist/tpl/components'))
})
gulp.task('createHtml',['commonhtml','dashhtml','goodshtml','orghtml','systemhtml','traceabilityhtml','transportHtml','userHtml','wmsHtml','orderHtml','d2pHtml','d2dHtml','d2wHtml','lmsHtml','fmsHtml','supplierHtml','wholesaleHtml','homepageHtml','mvComp'])

gulp.task('watch',function(){  //自动监听
    gulp.watch('src/js/*.js',['miniJs']);
    gulp.watch('src/components/**/*.component.js',['miniComponents']);
    gulp.watch('src/module/**/*.router.js',['miniRouter']);
    gulp.watch('src/module/**/*.service.js',['miniService']);
    gulp.watch('src/module/**/*.ctrl.js',['miniCtrl']);

    gulp.watch('src/module/common/**/*.html',['commonhtml']);
    gulp.watch('src/module/dashboard/**/*.html',['dashhtml']);
    gulp.watch('src/module/goods/**/*.html',['goodshtml']);
    gulp.watch('src/module/org/**/*.html',['orghtml']);
    gulp.watch('src/module/system/**/*.html',['systemhtml']);
    gulp.watch('src/module/traceability/**/*.html',['traceabilityhtml']);
    gulp.watch('src/module/transport/**/*.html',['transportHtml']);
    gulp.watch('src/module/user/**/*.html',['userHtml']);
    gulp.watch('src/module/wms/**/*.html',['wmsHtml']);

    gulp.watch('src/module/order/**/*.html',['orderHtml']);
    gulp.watch('src/module/d2p/**/*.html',['d2pHtml']);
    gulp.watch('src/module/d2d/**/*.html',['d2dHtml']);
    gulp.watch('src/module/d2w/**/*.html',['d2wHtml']);
    gulp.watch('src/module/lms/**/*.html',['lmsHtml']);
    gulp.watch('src/module/fms/**/*.html',['fmsHtml']);
    gulp.watch('src/module/wholesale/**/*.html',['wholesaleHtml']);
    gulp.watch('src/module/supplier/**/*.html',['supplierHtml']);
    gulp.watch('src/module/homepage/**/*.html',['homepageHtml']);
    gulp.watch('src/components/**/*.html',['mvComp']);
});

gulp.task('default',['watch'],function () {
    gulp.start('createHtml','createJs')
})


