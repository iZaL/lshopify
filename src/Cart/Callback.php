<?php

namespace IZal\Lshopify\Cart;

use ArrayAccess;

class Callback
{
    /**
     * Holds the container instance.
     *
     * @var \ArrayAccess
     */
    protected static $container;

    /**
     * Holds the callback's class name.
     *
     * @var string
     */
    protected $class;

    /**
     * Holds the callback's method name.
     *
     * @var string
     */
    protected $method;

    /**
     * Holds the callback's payload.
     *
     * @var mixed
     */
    protected $payload;

    /**
     * Whether the callback method should be called statically.
     *
     * @var bool
     */
    protected $static = false;

    /**
     * Constructor.
     *
     * @param array|object|string $callback
     * @param mixed               $payload
     *
     * @return void
     */
    public function __construct($callback, $payload = [])
    {
        $this->setCallback($callback);

        $this->payload = $payload;
    }

    /**
     * Make a new Callback instance.
     *
     * @param array|object|string $callback
     * @param mixed               $payload
     *
     * @return static
     */
    public static function make($callback, $payload = []): self
    {
        return new static($callback, $payload);
    }

    /**
     * Returns the container instance.
     *
     * @return \ArrayAccess
     */
    public static function getContainer(): ArrayAccess
    {
        return static::$container;
    }

    /**
     * Sets the container instance.
     *
     * @param \ArrayAccess $container
     *
     * @return void
     */
    public static function setContainer(ArrayAccess $container): void
    {
        static::$container = $container;
    }

    /**
     * Fires the callback with the given parameters.
     *
     * @return mixed
     */
    public function __invoke()
    {
        $params = func_get_args();

        array_unshift($params, $this->payload);

        return call_user_func_array([$this->resolve(), $this->method], $params);
    }

    /**
     * Sets the callback class and method names.
     *
     * @param array|object|string $callback
     *
     * @return mixed
     */
    protected function setCallback($callback)
    {
        if (is_object($callback)) {
            return $this->setObjectCallback($callback);
        }

        if (is_array($callback)) {
            return $this->setArrayCallback($callback);
        }

        return $this->setStringCallback($callback);
    }

    /**
     * Sets the callback class and method names via an object.
     *
     * @param object $callback
     *
     * @return void
     */
    protected function setObjectCallback(object $callback): void
    {
        $this->class = get_class($callback);

        $this->method = 'fire';
    }

    /**
     * Sets the callback class and method names via an array.
     *
     * @param array $callback
     *
     * @return void
     */
    protected function setArrayCallback(array $callback): void
    {
        $this->static = is_string($callback[0]);

        $this->class = $this->static ? $callback[0] : get_class($callback[0]);

        $this->method = $callback[1] ?? 'fire';
    }

    /**
     * Sets the callback class and method names via a string.
     *
     * @param string $callback
     *
     * @return void
     */
    protected function setStringCallback(string $callback): void
    {
        $this->static = strpos($callback, '::') !== false;

        $fragments = preg_split('/@|::/', $callback);

        $this->class = $fragments[0];

        $this->method = $fragments[1] ?? 'fire';
    }

    /**
     * Returns the resolved callback instance or class name.
     *
     * @return object|string
     */
    protected function resolve()
    {
        if ($this->static) {
            return $this->class;
        }

        if (static::$container) {
            return static::$container[$this->class];
        }

        return new $this->class();
    }
}
