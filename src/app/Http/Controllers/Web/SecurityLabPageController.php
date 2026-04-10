<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\SecurityLab\SecurityLabService;
use App\Services\SecurityLab\StageCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecurityLabPageController extends Controller
{
    public function __construct(private readonly SecurityLabService $labService)
    {
    }

    public function top(Request $request): Response
    {
        return Inertia::render('Web/Top', $this->labService->topPageData($request->user()));
    }

    public function dashboard(): RedirectResponse
    {
        return redirect()->route('lab.stages.index');
    }

    public function stages(): Response
    {
        /** @var \App\Models\User $user */
        $user = request()->user();

        return Inertia::render('Web/SecurityLab/Stages', $this->labService->stagesIndexData($user));
    }

    public function stage(Request $request, string $stageCode): Response
    {
        abort_unless(StageCatalog::exists($stageCode), 404);

        /** @var \App\Models\User $user */
        $user = $request->user();

        return Inertia::render('Web/SecurityLab/Stage', $this->labService->stageDetailData($user, $stageCode, $request));
    }

    public function rankings(Request $request): Response
    {
        $stageCode = $request->query('stage', 'stage-1');
        $variant = $request->query('variant', 'fixed');

        abort_unless(StageCatalog::exists($stageCode), 404);
        abort_unless(in_array($variant, ['vuln', 'fixed'], true), 404);

        /** @var \App\Models\User $user */
        $user = $request->user();

        return Inertia::render('Web/SecurityLab/Rankings', $this->labService->rankingsPageData($user, $stageCode, $variant));
    }

    public function admin(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        return Inertia::render('Web/SecurityLab/Admin', $this->labService->adminPageData($user));
    }
}
