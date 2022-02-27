<?php

namespace IZal\Lshopify\Cart;

use IZal\Lshopify\Cart\Storage\IlluminateSession;
use Illuminate\Support\ServiceProvider;

class CartServiceProvider extends ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->prepareResources();

        $this->registerSession();

        $this->registerCart();

        $this->registerCallbackContainer();
    }

    /**
     * {@inheritdoc}
     */
    public function provides()
    {
        return ['cart', 'cart.session'];
    }

    /**
     * Prepare the package resources.
     *
     * @return void
     */
    protected function prepareResources()
    {
        $config = realpath(__DIR__ . '/config.php');

        $this->mergeConfigFrom($config, 'cart');

        $this->publishes(
            [
                $config => config_path('cart.php'),
            ],
            'config'
        );
    }

    /**
     * Register the session driver used by the Cart.
     *
     * @return void
     */
    protected function registerSession()
    {
        $this->app->singleton('cart.session', function ($app) {
            $config = $app['config']->get('cart');

            return new IlluminateSession(
                $app['session.store'],
                $config['instance'],
                $config['session_key']
            );
        });
    }

    /**
     * Register the Cart.
     *
     * @return void
     */
    protected function registerCart()
    {
        $this->app->bind('cart', function ($app) {
            $cart = new Cart($app['cart.session'], $app['events']);

            $cart->setRequiredIndexes(
                $app['config']->get('cart.requiredIndexes', [])
            );

            return $cart;
        });

        $this->app->alias('cart', 'IZal\Lshopify\Cart\Cart');
    }

    /**
     * Register the container with the callback class.
     *
     * @return void
     */
    protected function registerCallbackContainer()
    {
        Callback::setContainer($this->app);
    }
}
