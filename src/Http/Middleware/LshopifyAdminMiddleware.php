<?php

namespace IZal\Lshopify\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class LshopifyAdminMiddleware
{
    public function handle($request, Closure $next)
    {
        auth()->setDefaultDriver(app('LshopifyGuard'));
        if (!auth()->guest()) {
            $user = auth()->user();
            if ($user->admin) {
                return $next($request);
            }
        }
        return $next($request);

        return redirect()->route('login');
    }
}
