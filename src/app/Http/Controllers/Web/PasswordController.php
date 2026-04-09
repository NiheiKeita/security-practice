<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordUpdateRequest;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    public function edit(string $token): Response
    {
        $user = User::where("id", Auth::user()->id)->first();
        // if ($token !== $user->password_token) {
        //     return abort(404);
        // }

        return Inertia::render('Web/PasswordEdit', [
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function update(PasswordUpdateRequest $request): RedirectResponse
    {
        $user = User::where("id", Auth::user()->id)->first();
        // if ($request->token !== $user->password_token) {
        //     return abort(404);
        // }

        $user->update([
            'password' => Hash::make($request->password),
            'password_token' => null,
            'password_updated' => true,
        ]);
        // dd($user);
        return redirect()->intended(RouteServiceProvider::WEB_PROPERTIES);
    }
}
