<?php

return [
    'enabled' => true,

    'enable_local_development' => false,

    'storage' => [
        'disk' => 'public',
    ],

    'dashboard' => [
        'domain' => null,
        'prefix' => 'store',
        'alias' => 'lshopify.',
    ],

    'middleware' => ['web', \IZal\Lshopify\Http\Middleware\HandleInertiaRequests::class],
];
