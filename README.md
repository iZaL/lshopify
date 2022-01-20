## LShopify (Laravel Ecommerce Admin Panel)
laravel E-commerce admin package that mimics shopify admin panel. 
The package is currently under development and deliberately named Lshopify just to give users idea that the 
admin panel mimics shopify admin panel. The name is subject to change once the package is stable. 

The admin panel frontend is built with InertiaJS and ReactJS with Typescript. 

```angular2html
#install the package through composer

composer require izal/lshopify

#in the config/app.php file add the following line

\IZal\Lshopify\Providers\LshopifyServiceProvider::class

# next run the following command
php artisan vendor:publish --provider="\IZal\Lshopify\Providers\LshopifyServiceProvider" 


```
after the above command is run, the following files will be created
resources/views/lshopify.blade.php

now you can navigate to the following url
http://yousite.test/admin


