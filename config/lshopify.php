<?php

return [

    'enabled' => true,

    'controllers' => [
        'namespace' => 'Zal\\Lshopify\\Http\\Controllers',
    ],

    'storage' => [
        'disk' => 'public',
    ],

    'dashboard' => [
        'domain' => null,
        'prefix' => 'store',
        'alias' => 'lshopify.'
    ],

    'middleware' => [
        'web',
        \IZal\Lshopify\Http\Middleware\LshopifyAuthorizeMiddleware::class,
        \IZal\Lshopify\Http\Middleware\HandleInertiaRequests::class
    ],


];
