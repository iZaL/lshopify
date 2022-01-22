<?php

namespace IZal\Lshopify\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use IZal\Lshopify\Cart\CartServiceProvider;

class LshopifyServiceProvider extends ServiceProvider
{

    /**
     * Bootstrap any package services.
     *
     * @return void
     */

    public function boot()
    {

        if (! config('lshopify.enabled')) {
            return;
        }

        JsonResource::withoutWrapping();

        Inertia::setRootView('lshopify');

        Route::middlewareGroup('lshopify', config('lshopify.middleware', []));

        $this->registerCommands();

        $this->registerPublishing();

        $this->registerRoutes();

        $this->registerMigrations();

        $this->loadViewsFrom(
            __DIR__.'/../../resources/views', 'lshopify'
        );
    }

    /**
     * Register the package routes.
     *
     * @return void
     */
    private function registerRoutes()
    {
        Route::group($this->routeConfiguration(), function () {
            $this->loadRoutesFrom(__DIR__.'/../../routes/lshopify.php');
        });
    }

    /**
     * Get the Telescope route group configuration array.
     *
     * @return array
     */
    private function routeConfiguration()
    {
        return [
            'domain' => config('lshopify.dashboard.domain', null),
//            'namespace' => 'Laravel\Telescope\Http\Controllers',
            'middleware' => 'lshopify',
            'prefix' => config('lshopify.dashboard.prefix'),
            'as' => config('lshopify.dashboard.alias')
        ];
    }

    /**
     * Register the package's migrations.
     *
     * @return void
     */
    private function registerMigrations()
    {
        if ($this->app->runningInConsole() && $this->shouldMigrate()) {
            $this->loadMigrationsFrom(__DIR__.'/../../database/migrations');
        }
    }

    /**
     * Register the package's publishable resources.
     *
     * @return void
     */
    private function registerPublishing()
    {

        if ($this->app->runningInConsole()) {

            $this->publishes([
                __DIR__.'/../../resources/views/app.blade.php' => resource_path('views/lshopify.blade.php'),
            ],'lshopify-stubs');

            $this->publishes([
                __DIR__.'/../../public' => public_path(),
            ], ['lshopify-assets']);

            $this->publishes([
                __DIR__.'/../../config/lshopify.php' => config_path('lshopify.php'),
            ], 'lshopify-config');

            if(config('lshopify.enable_local_development')) {
                $this->publishes([
                    __DIR__.'/../../database/migrations' => database_path('migrations'),
                ], 'lshopify-migrations');
                $this->publishes([
                    __DIR__.'/../../stubs/webpack.mix.js' => base_path('webpack.mix.js'),
                ],'lshopify-stubs');
            }

        }
    }

    /**
     * Register the package's commands.
     *
     * @return void
     */
    protected function registerCommands()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
            ]);
        }
    }

    /**
     * Register any package services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->register(CartServiceProvider::class);

        $this->mergeConfigFrom(
            __DIR__.'/../../config/lshopify.php', 'lshopify'
        );

    }


    /**
     * Determine if we should register the migrations.
     *
     * @return bool
     */
    protected function shouldMigrate()
    {
        return true;
    }
}
