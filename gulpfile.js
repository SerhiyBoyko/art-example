// runSequence = require('run-sequence')            https://github.com/OverZealous/run-sequence
//postcssSVG       = require('postcss-svg'),
//cssnext          = require('postcss-cssnext'),
//clearfix         = require('postcss-clearfix'),
//focus            = require('postcss-focus'),
//px2Rem           = require('postcss-pxtorem'),
//calc             = require("postcss-calc"),
//pixrem           = require("pixrem"),
//responsiveImages = require('postcss-responsive-images')
//varibles      =   require('postcss-advanced-variables'), в postcss

//require('events').EventEmitter.defaultMaxListeners = 0;

var gulp               = require('gulp'),
	gutil              = require('gulp-util'),
	plumber            = require('gulp-plumber'),
	clean              = require('gulp-clean'),
	uglify             = require('gulp-uglify'),
	concat             = require('gulp-concat'),
	rename             = require('gulp-rename'),
	rimraf             = require('rimraf'),
	gulp_rimraf        = require('gulp-rimraf'),
	cache              = require('gulp-cached'),
	// moderniz           = require('@thasmo/gulp-modernizr'),
	injectSvg = require('gulp-inject-svg'),
	injectSvgOptions = { base: '/src/' }
;
// devtooull            = require('gulp-devtools')
// sourcemaps 			= require('gulp-sourcemaps');
//  emailBuilder       = require('gulp-email-builder'),
//  replace            = require('gulp-replace')


var postcss         = require('gulp-postcss'),
	rucksack 		= require('rucksack-css'),
	// short           = require('postcss-short'),
	pixrem          = require("pixrem"),
	partial_import  = require('postcss-partial-import'),
	mixins          = require('postcss-sassy-mixins'),
	mediaMinMax     = require('postcss-media-minmax'),
	nested          = require('postcss-nested'),
	atRoot          = require('postcss-atroot'),
	extend          = require('postcss-extend'),
	assets          = require('postcss-assets'),
	scss            = require('postcss-scss'),
	math            = require('postcss-automath'),
	mqpacked        = require('css-mqpacker'),
	hexrgba         = require('postcss-hexrgba'),
	cssnano         = require('gulp-cssnano'),
	inlineCss       = require('gulp-inline-css'),
	postcssRandom   = require('postcss-random'),
	properties      = require('postcss-define-property'),
	postcss_click   = require('postcss-click')

;

var pug             = require('gulp-pug'),
	htmlHint        = require('gulp-htmlhint')
;

var imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	iconfont     = require('gulp-iconfont'),
	iconfontCss  = require('gulp-iconfont-css')
;




var watch       = require('gulp-watch'),
	browserSync = require('browser-sync').create(),
	reload      = browserSync.reload,
	del         = require('del'),
	batch       = require('gulp-batch')
;


//ERROR
function errorHandler(error){
	gutil.log([
		gutil.colors.red.bold(error.name + ' in ' + error.plugin),
		'',
		error.message,
		''
	].join('\n'));
	
	this.emit('end');
}

//Pug
gulp.task('pug', function(){
	var prettify = require('gulp-prettify');
	
	return gulp.src('src/pug/**/!(_)*.pug') //компілюєм всі файлм, за винятком якщо вони починаються з _ (так ми будем називати файли які підключаєм)
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(cache('html'))
		.pipe(pug())
		.pipe(prettify({
			'indent_inner_html': false,
			'indent_size': 1,
			'indent_char': "\t",
			'wrap_line_length': 78,
			'brace_style': 'expand',
			'unformatted': ['sub', 'sup', 'b', 'i', 'u', 'textarea'],
			'preserve_newlines': true,
			'max_preserve_newlines': 5,
			'indent_handlebars': false,
			'extra_liners': []
		}))
		.pipe(injectSvg(injectSvgOptions))
		.pipe(gulp.dest('dist/'))
		.on('end', reload);
});


//POST-CSS
gulp.task('css', function (done){
	
	var grid_variables = {},
		grid = 100;
	
	for(var i = 1; i<13; i++){
		grid_variables['grid_'+i] = grid*i; //робим значення для змінних типу $grid_1, $grid_2,
		
		grid_variables['grid_'+i] += "px"; //добавляєм до цифри слово "px"
	}
	
	//console.log(grid_variables);
	
	var variables = require('postcss-advanced-variables')({variables:grid_variables});
	
	var functions = require('postcss-functions')({
		functions: {
			'letter-spacing': function (value) {
				return (value / 1000) + 'em';
			},
			'un': function (value) {
				return (value / 900) * 100 + 'vh';
			},
			'adaptive': function (width, height) {
				return (height / width) * 100 + '%';
			},
			'vh': function (obj){
				return (obj/(768 * 0.01)) + 'vh';
			},
			'vw': function (obj){
				return (obj/(1024 * 0.01)) + 'vw';
			}
			
			/*
			'bg-img': function (url){
				
				for(var i = 1; i < 11; i++){
					return (url)
				}
			}*/
		}
	});
	
	var processors = [
		/*short,          // https://github.com/jonathantneal/postcss-short*/
		partial_import,
		properties({
			syntax: {
				atrule: true,
				parameter: '',
				property: '+',
				separator: ''
			}
		}),
		mixins,         // https://github.com/postcss/postcss-mixins
		assets,         //в txt     https://github.com/assetsjs/postcss-assets
		variables,      // https://github.com/jonathantneal/postcss-advanced-variables
		mediaMinMax,    // https://github.com/postcss/postcss-media-minmax
		nested,
		atRoot,         // https://github.com/OEvgeny/postcss-atroot
		extend,         // https://github.com/travco/postcss-extend
		functions,
		postcss_click({
			output: 'src/js/click.js',
			append: false
		}),
		hexrgba,
		mqpacked,
		postcssRandom,
		math,
		rucksack
	];
	
	return gulp.src('src/css/style.pcss')
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(postcss(processors, {parser:scss}))
		// .pipe(rucksack())
		.pipe(cssnano({
			autoprefixer: {
				add: true,
				remove: false,
				browsers: ['> 1%', 'ie >= 9', 'not ie <= 8', 'chrome > 1', 'Opera >= 11', 'firefox >= 3', 'safari > 4', 'last 3 version']
			},
			calc: false,
			normalizeUrl: false,
			mergeLonghand: false,
			convertValues: {
				length: false
			},
			normalizeCharset: {
				add: true
			},
			discardUnused: false,
			reduceIdents: false,
			mergeIdents: false,
			zindex: false,
			discardComments: {removeAll: true}
		}))
		.pipe(rename('style.css'))
		.pipe(gulp.dest('dist/css/'))
		.pipe(reload({stream:true}));
});


// // Modernizr
// gulp.task('modernizr', function (done) {
// 	return gulp.src(['404/*.js']) //fix for empty src
// 		.pipe(modernizr({
// 			//'classPrefix': 'has-',
// 			'feature-detects': [
// 				"test/css/backgroundcliptext"
// 			],
// 			'options': [
// 				'setClasses'
// 			]
// 		}))
// 		.pipe(rename('modernizr.js'))
// 		.pipe(gulp.dest('src/js/'))
// 		.on('end', function() {
// 			gulp.series('scripts', function(curr_done){done();curr_done();})();
// 		});
// });

// JavaScript
gulp.task('scripts', function () {
	return gulp.src([
		'src/js/jquery.js',
		'src/js/jquery.select.js',
		'src/js/jquery.google_map.js',
		'src/js/jquery.waypoints.js',
		'src/js/swiper.js',
		'src/js/include.js',
		'src/js/common.js',
	])
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(concat('script.min.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/js/'))
		.on('end', reload);
});

//svg to font
gulp.task('generate_icons_font', function(done){
	var fontName = 'icons';
	
	gulp.src(['src/images/icons/font/*.svg'])
		.pipe(iconfontCss({
			fontName: fontName,
			path: 'src/fonts/_font_icons.template.pcss',
			targetPath: '../css/_font_icons.pcss',
			fontPath: '../fonts/',
			cssClass:'icon'
		}))
		.pipe(iconfont({
			fontName: fontName, // required
			prependUnicode: true, // recommended option
			normalize: true,
			centerHorizontally: true,
			fontHeight: 100,
			formats: ['ttf', 'eot', 'woff', 'woff2', 'svg']
		}))
		.on('glyphs', function(glyphs, options) {
			//console.log(glyphs, options);
		})
		.pipe(gulp.dest('src/generated-fonts/'))
		.on('end', function() {
			gulp.series('copy_fonts', function(curr_done){done();curr_done();})();
		});
});

// Fonts
gulp.task('generate_fonts', function (done){
	var addsrc = require('gulp-add-src'),
		fontmin = require('gulp-fontmin'),
		otf2ttf = require('otf2ttf'),
		ttf2woff2 = require('gulp-ttf2woff2'),
		buffers = [];

	gulp.src('src/fonts/*.ttf')
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(fontmin({
			// text: text,
			hinting:false
		}))
		.pipe(gulp.dest('src/generated-fonts/'))
		.on('end', function(){
			gulp.src('src/generated-fonts/*.ttf')
				.pipe(ttf2woff2())
				.pipe(gulp.dest('src/generated-fonts/'))
				.on('end', function() {
					gulp.series('copy_fonts', function(curr_done){done();curr_done();})();
				});
		});
	return;
	
	gulp.src('src/fonts/glyphs.txt')
		.on('data', function(file) {
			buffers.push(file.contents);
		})
		.on('end', function() {
			var text = Buffer.concat(buffers).toString('utf-8');
			
			gulp.src('src/fonts/*.otf')
				.pipe(plumber({errorHandler: errorHandler}))
				.pipe(otf2ttf())
				.pipe(addsrc('src/fonts/*.ttf'))
				.pipe(fontmin({
					// text: text,
					hinting:false
				}))
				.pipe(gulp.dest('src/generated-fonts/'))
				.on('end', function(){
					gulp.src('src/generated-fonts/*.ttf')
						.pipe(ttf2woff2())
						.pipe(gulp.dest('src/generated-fonts/'))
						.on('end', function() {
							gulp.series('copy_fonts', function(curr_done){done();curr_done();})();
						});
				});
		});
});

// Copy generated fonts
gulp.task('copy_fonts', function(){
	return gulp.src('src/generated-fonts/*.{eot,ttf,woff,woff2,svg}')
		.pipe(gulp.dest('dist/fonts/'));
});


// IMG
gulp.task('img', function() {
	return gulp.src(['src/images/**/*','!src/images/**/*.svg'])
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			une: [pngquant()]
		}))
		.pipe(gulp.dest('dist/images'));
});

// COPY SVG
gulp.task('copy_svg', function() {
	return gulp.src(['src/images/**/*.svg', '!src/images/icons/font/*.svg'])
		.pipe(gulp.dest('dist/images'));
});


// COPY root files
gulp.task('copy_root_files', function() {
	return gulp.src(['src/root_files/**/*'])
		.pipe(gulp.dest('dist'));
});


// CLEAN Folders
gulp.task('clean', function (cb) {
	rimraf("dist", cb);
});

// CLEAN html CACHE
gulp.task('clear_html_cache', function(done){
	var cache = require('gulp-cached');
	
	delete cache.caches['html'];
	done();
});

// Build
gulp.task('build', gulp.parallel(
	'pug',
	'css',
	'img',
	'copy_svg',
	'copy_root_files',
	'scripts',
	'copy_fonts'
	)
);

gulp.task('rebuild', gulp.series('clean', 'clear_html_cache', 'build'));


//Server
gulp.task('server', function(done){
	browserSync.init({
		server: {
			baseDir: "dist"
		},
		open: false
	});
	
	done();
});

//watch
gulp.task('watch', function(done) {
	gulp.watch('src/pug/**/_*.pug', gulp.series('clear_html_cache','pug'));
	gulp.watch('src/pug/**/!(_)*.pug', gulp.series('pug'));
	gulp.watch('src/css/**/*', gulp.series('css'));
	gulp.watch('src/js/**/*', gulp.series('scripts'));
	gulp.watch(['src/images/**/*', '!src/images/**/*.svg'], gulp.series('img'));
	gulp.watch(['src/images/**/*.svg', '!src/images/icons/font/*.svg'], gulp.series('copy_svg'));
	gulp.watch('src/images/icons/font/*.svg', gulp.series('generate_icons_font'/*, 'css'*/));
	
	done();
});


//default
gulp.task('default', gulp.series('watch', 'server'));
// module.exports.gulp = gulp;
// module.exports = gulp;