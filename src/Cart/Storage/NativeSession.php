<?php

namespace IZal\Lshopify\Cart\Storage;

use Illuminate\Cookie\CookieJar;
use Illuminate\Session\Store as SessionStore;
use Illuminate\Support\Arr;

class NativeSession extends IlluminateSession implements StorageInterface
{
    /**
     * Creates a new Native Session driver for Cart.
     *
     * @param \Illuminate\Session\Store $session
     * @param string                    $instance
     * @param string                    $key
     * @param array                     $config
     *
     * @return void
     */
    public function __construct(SessionStore $session, $instance = null, $key = null, $config = [])
    {
        parent::__construct($session, $instance, $key);

        // Cookie configuration
        $lifetime = Arr::get($config, 'lifetime', 120);
        $path = Arr::get($config, 'path', '/');
        $domain = Arr::get($config, 'domain', null);
        $secure = Arr::get($config, 'secure', false);
        $httpOnly = Arr::get($config, 'httpOnly', true);

        if ($cookieId = Arr::get($_COOKIE, $session->getName())) {
            $session->setId($cookieId);

            $session->setName($cookieId);
        }

        $cookie = with(new CookieJar())->make(
            $session->getName(),
            $session->getId(),
            $lifetime,
            $path,
            $domain,
            $secure,
            $httpOnly
        );

        setcookie(
            $cookie->getName(),
            $cookie->getValue(),
            $cookie->getExpiresTime(),
            $cookie->getPath(),
            $cookie->getDomain(),
            $cookie->isSecure(),
            $cookie->isHttpOnly()
        );

        $session->start();
    }

    /**
     * Called upon destruction of the native session handler.
     *
     * @return void
     */
    public function __destruct()
    {
        $this->session->save();
    }
}
