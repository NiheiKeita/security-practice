<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUserRequest;
use App\Models\AdminUser;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/AdminUserList', [
            'users' => AdminUser::get(),
        ]);
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/AdminRegister');
    }

    public function store(AdminUserRequest $request): RedirectResponse
    {
        AdminUser::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect(RouteServiceProvider::ADMIN_USERS)->with('message', '登録が完了しました');
    }
}
