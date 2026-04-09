<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BasicAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (config('app.is_basicauth')) {
            $username = $request->getUser();
            $password = $request->getPassword();

            if ($username == config('app.basicauth_user') && $password == config('app.basicauth_password')) {
                return $next($request);
            }
            header('WWW-Authenticate: Basic realm="Sample Private Page"');
            header('Content-Type: text/plain; charset=utf-8');
            abort(401, "Enter username and password.");
        } else {
            return $next($request);
        }
    }
}
