<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
// use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the registration view.
     */
    public function index(): Response
    {
        // dump(Auth::user()->email);
        return Inertia::render('Web/Dashboard');
    }
}
