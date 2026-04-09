<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use App\Services\SecurityLab\SecurityLabService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function __construct(private readonly SecurityLabService $labService)
    {
    }

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Web/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'demoAccounts' => $this->labService->topPageData(request()->user())['demoAccounts'],
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        // $user = User::where("id", Auth::user()->id)->first();
        // if (!$user->password_updated) {
        //     return redirect()->route("web.password.edit", ['token' => $user->password_token]);
        // }

        return redirect()->intended(RouteServiceProvider::WEB_PROPERTIES);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('lab.top');
    }
}
