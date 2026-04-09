<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/dashboard';
    public const LOGIN = '/login';
    public const ADMIN_HOME = '/admin/dashboard';
    public const ADMIN_USERS = '/admin/admin_users';
    public const ADMIN_LOGIN = '/admin/login';
    public const USERS = '/admin/users';
    public const PROPERTIES = '/admin/properties';
    public const MA_PROPERTIES = '/admin/ma_properties';
    public const WEB_PROPERTIES = '/properties';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */

    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}
