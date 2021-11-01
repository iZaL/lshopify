<?php

namespace IZal\Lshopify\Cart;

use IZal\Lshopify\Cart\Collections\CartCollection;
use IZal\Lshopify\Cart\Storage\StorageInterface;
use Illuminate\Contracts\Events\Dispatcher;

class Cart
{
    protected $storage;

    /**
     * The event dispatcher instance.
     *
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $dispatcher;

    protected $cart;

    /**
     * Flag for whether we should fire events or not.
     *
     * @var bool
     */
    protected $eventDispatcherStatus = true;

    /**
     * Constructor.
     *
     * @return void
     */
    public function __construct(StorageInterface $storage, Dispatcher $dispatcher)
    {
        $this->storage = $storage;

        $this->dispatcher = $dispatcher;
    }

    /**
     * Returns the Cart instance identifier.
     *
     * @return mixed
     */
    public function getInstance()
    {
        return $this->storage->getInstance();
    }

    /**
     * Sets the Cart instance identifier.
     *
     * @param mixed $instance
     *
     * @return void
     */
    public function setInstance($instance)
    {
        $this->storage->setInstance($instance);
    }

    /**
     * Returns the cart contents.
     *
     * @return \IZal\Lshopify\Cart\Collections\CartCollection
     */
    public function items()
    {
        if ($this->cart) {
            return $this->cart;
        }

        if ($this->storage->has()) {
            return $this->cart = $this->storage->get()->setCart($this);
        }

        return $this->cart = $this->newCartCollection();
    }

    /**
     * Empties the cart.
     *
     * @return void
     */
    public function clear()
    {
        $this->storage->put($this->cart = null);

        // Fire the 'cart.cleared' event
        $this->fire('cleared', $this);
    }

    /**
     * Synchronizes a collection of data with the cart.
     *
     * @return void
     */
    public function sync(Collection $items)
    {
        // Turn events off
        $this->setEventDispatcherStatus(false);

        foreach ($items->all() as $item) {
            $this->add($item);
        }

        // Turn events on
        $this->setEventDispatcherStatus(true);
    }

    /**
     * Returns the storage driver.
     *
     * @return mixed
     */
    public function getStorage()
    {
        return $this->storage;
    }

    /**
     * Sets the storage driver.
     *
     *
     * @return void
     */
    public function setStorage(StorageInterface $storage)
    {
        $this->storage = $storage;
    }

    /**
     * Returns the event dispatcher instance.
     *
     * @return \Illuminate\Contracts\Events\Dispatcher
     */
    public function getDispatcher()
    {
        return $this->dispatcher;
    }

    /**
     * Sets the event dispatcher instance.
     *
     * @param \Illuminate\Events\Dispatcher $dispatcher
     *
     * @return void
     */
    public function setDispatcher(Dispatcher $dispatcher)
    {
        $this->dispatcher = $dispatcher;
    }

    /**
     * Determines if the event dispatcher should be triggered.
     *
     * @return bool
     */
    public function getEventDispatcherStatus()
    {
        return $this->eventDispatcherStatus;
    }

    /**
     * Sets the event dispatcher status.
     *
     * @param bool $status
     *
     * @return void
     */
    public function setEventDispatcherStatus($status)
    {
        $this->eventDispatcherStatus = $status;
    }

    /**
     * Fires an event.
     *
     * @param string $event
     * @param mixed  $data
     *
     * @return void
     */
    public function fire($event, $data)
    {
        // Check if we should fire events
        if ($this->eventDispatcherStatus === true) {
            $this->dispatcher->dispatch("cart.{$event}", $data);
        }
    }

    /**
     * Handle dynamic calls into CartCollection.
     *
     * @param string $method
     * @param array  $parameters
     *
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        return call_user_func_array([$this->items(), $method], $parameters);
    }

    /**
     * Creates a new cart collection instance.
     */
    protected function newCartCollection()
    {
        $cart = (new CartCollection())->setCart($this);

        $this->storage->put($cart);

        // Fire the 'cart.created' event
        $this->fire('created', $cart);

        return $cart;
    }
}
