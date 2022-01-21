<?php

namespace IZal\Lshopify\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class LshopifyAuthorizeMiddleware
{
    public function handle($request, Closure $next)
    {
        auth()->setDefaultDriver('web');
        if (!auth()->guest()) {
            return $next($request);
        }
        return redirect()->route('login');
    }
}

