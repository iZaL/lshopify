const mix = require('laravel-mix');
const path = require('path');

mix
  .ts('lshopify/resources/js/app.js', 'public/vendor/lshopify')
  .react()
  .postCss('lshopify/resources/css/app.css', 'public/vendor/lshopify', [
    require("tailwindcss"),
  ])
  .disableNotifications()
  .webpackConfig({
    resolve:{
      alias:{
        '@lshopify': path.resolve('resources/js'),
        ziggy: path.resolve('vendor/tightenco/ziggy/src/js/route.js'),
      }
    }
  })
;
