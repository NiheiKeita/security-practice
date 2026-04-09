<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\SecurityLab\SecurityLabService;
use App\Services\SecurityLab\StageCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SecurityLabActionController extends Controller
{
    public function __construct(private readonly SecurityLabService $labService)
    {
    }

    public function markView(Request $request, string $stageCode): JsonResponse
    {
        abort_unless(StageCatalog::exists($stageCode), 404);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $mode = $request->validate([
            'mode' => ['required', 'in:vuln,fixed'],
        ])['mode'];

        return response()->json([
            'progress' => $this->labService->markView($user, $stageCode, $mode),
        ]);
    }

    public function run(Request $request, string $stageCode, string $variant): JsonResponse
    {
        abort_unless(StageCatalog::exists($stageCode), 404);
        abort_unless(in_array($variant, ['vuln', 'fixed'], true), 404);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $validated = $request->validate([
            'action' => ['required', 'string'],
            'payload' => ['nullable', 'array'],
        ]);

        $result = $this->labService->runAction(
            $user,
            $stageCode,
            $variant,
            $validated['action'],
            $validated['payload'] ?? [],
            $request
        );

        return response()->json($result, $result['success'] === false ? 422 : 200);
    }

    public function crossSiteDemo(Request $request, string $variant): JsonResponse
    {
        abort_unless(in_array($variant, ['vuln', 'fixed'], true), 404);

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        abort_unless($user !== null, 401);

        $validated = $request->validate([
            'bio' => ['nullable', 'string', 'max:500'],
            'stage5_token' => ['nullable', 'string'],
        ]);

        $result = $this->labService->runCrossSiteDemo($user, $variant, $validated, $request);

        return response()->json($result, $result['success'] === false ? 403 : 200);
    }
}
