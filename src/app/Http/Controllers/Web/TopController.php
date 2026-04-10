<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\SecurityLab\SecurityLabService;
use Inertia\Inertia;
use Inertia\Response;

class TopController extends Controller
{
    public function __construct(private readonly SecurityLabService $labService)
    {
    }

    public function index(): Response
    {
        return Inertia::render('Web/Top', $this->labService->topPageData(request()->user()));
    }
}
