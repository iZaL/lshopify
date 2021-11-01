<?php

namespace IZal\Lshopify\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Events\Dispatcher;

use Inertia\Inertia;
use IZal\Lshopify\Cart\CartServiceProvider;
use IZal\Lshopify\Http\Middleware\HandleInertiaRequests;
use IZal\Lshopify\Http\Middleware\LshopifyAdminMiddleware;

class LshopifyServiceProvider extends ServiceProvider
{
    /**
     * Register the application services.
     */
    public function register()
    {
        $this->app->register(CartServiceProvider::class);

        $this->app->singleton('LshopifyGuard', function () {
            return config('auth.defaults.guard', 'web');
        });

        $this->registerConfigs();

    }

    public function boot(Router $router, Dispatcher $event)
    {

        JsonResource::withoutWrapping();

        Inertia::setRootView('lshopify');

        $router->aliasMiddleware('admin', LshopifyAdminMiddleware::class);

        $router->pushMiddlewareToGroup('web', HandleInertiaRequests::class);

        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'lshopify');

        $this->loadRoutesFrom(__DIR__.'/../../routes/lshopify.php');

        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');

        $this->registerPublishableResources();

    }


    /**
     * Register the publishable files.
     */
    private function registerPublishableResources()
    {

        $this->publishes([
          __DIR__.'/../../resources/views/app.blade.php' => resource_path('views/lshopify.blade.php'),
          __DIR__.'/../../webpack.mix.js' => base_path('webpack.mix.js'),
        ]);

        if ($this->app->runningInConsole()) {
            // Publish assets
            $this->publishes([
                 __DIR__.'/../../publishable/assets' => public_path('lshopify'),
                 __DIR__.'/../../publishable/config/lshopify.php' => config_path('lshopify.php'),
//                 __DIR__ . '/../../resources/js' => resource_path('js'),
             ],'assets');
        }

    }

    public function registerConfigs()
    {
    }
}
