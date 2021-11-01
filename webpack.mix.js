const mix = require('laravel-mix');
const path = require('path');

mix
  .ts('resources/js/app.js', 'public/lshopify/js')
  .react()
  .postCss('resources/css/app.css', 'public/lshopify/css', [
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
