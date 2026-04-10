<?php

namespace App\Services\SecurityLab;

use App\Models\AuditLog;
use App\Models\GameSession;
use App\Models\HighScore;
use App\Models\StageProgress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

class SecurityLabService
{
    public function __construct(private readonly DemoDataService $demoDataService)
    {
    }

    public function topPageData(?User $user): array
    {
        return [
            'serviceName' => 'Security Practice Arcade',
            'stageCount' => count(StageCatalog::all()),
            'demoAccounts' => $this->demoAccountCards(),
            'currentUser' => $user ? $this->serializeUser($user) : null,
        ];
    }

    public function stagesIndexData(User $user): array
    {
        return [
            'currentUser' => $this->serializeUser($user),
            'stages' => array_map(function (array $stage) use ($user): array {
                $progress = $this->stageProgressSummary($user, $stage['code']);
                $best = HighScore::query()
                    ->where('user_id', $user->id)
                    ->where('stage_code', $stage['code'])
                    ->max('score');

                return [
                    ...$stage,
                    'progress' => $progress,
                    'bestScore' => $best,
                ];
            }, StageCatalog::all()),
        ];
    }

    public function stageDetailData(User $user, string $stageCode, Request $request): array
    {
        $stage = StageCatalog::find($stageCode);

        if (! $request->session()->has('security_lab.stage5_token')) {
            $request->session()->put('security_lab.stage5_token', Str::random(32));
        }

        return [
            'currentUser' => $this->serializeUser($user),
            'stage' => $stage,
            'stageOptions' => array_map(fn (array $item): array => [
                'code' => $item['code'],
                'label' => "Stage {$item['number']}",
                'title' => $item['title'],
            ], StageCatalog::all()),
            'initialMode' => $request->query('mode', 'vuln'),
            'progress' => $this->stageProgressSummary($user, $stageCode),
            'leaderboard' => $this->rankingEntries($stageCode, 'fixed'),
            'currentBest' => HighScore::query()
                ->where('user_id', $user->id)
                ->where('stage_code', $stageCode)
                ->max('score'),
            'users' => User::query()
                ->orderByRaw("CASE WHEN role = 'admin' THEN 0 ELSE 1 END")
                ->orderBy('name')
                ->get()
                ->map(fn (User $item): array => $this->serializeUser($item))
                ->all(),
            'profilePreview' => [
                'bio' => $user->bio,
                'stage5Token' => $request->session()->get('security_lab.stage5_token'),
            ],
            'adminPreview' => [
                'userCount' => User::query()->count(),
                'scoreCount' => HighScore::query()->count(),
                'logCount' => AuditLog::query()->count(),
            ],
            'apiExamples' => [
                'vulnerable' => $this->buildApiExample($user, 'vuln', 'profile'),
                'fixed' => $this->buildApiExample($user, 'fixed', 'profile'),
            ],
        ];
    }

    public function rankingsPageData(User $user, string $stageCode, string $variant): array
    {
        return [
            'currentUser' => $this->serializeUser($user),
            'selectedStage' => $stageCode,
            'selectedVariant' => $variant,
            'stageOptions' => array_map(fn (array $item): array => [
                'code' => $item['code'],
                'label' => "Stage {$item['number']}",
                'title' => $item['title'],
            ], StageCatalog::all()),
            'entries' => $this->rankingEntries($stageCode, $variant),
            'ownRank' => $this->ownRank($user, $stageCode),
            'responseExample' => $this->buildApiExample($user, $variant, 'ranking', $stageCode),
        ];
    }

    public function adminPageData(User $user): array
    {
        return [
            'currentUser' => $this->serializeUser($user),
            'isAdmin' => $user->role === 'admin',
            'users' => User::query()->orderBy('role', 'desc')->orderBy('name')->get()->map(
                fn (User $item): array => $this->serializeUser($item)
            )->all(),
            'scores' => HighScore::query()
                ->with('user')
                ->orderByDesc('updated_at')
                ->limit(24)
                ->get()
                ->map(fn (HighScore $score): array => [
                    'id' => $score->id,
                    'stageCode' => $score->stage_code,
                    'player' => $score->user?->name,
                    'score' => $score->score,
                    'comment' => $score->comment,
                    'updatedAt' => optional($score->updated_at)->toDateTimeString(),
                ])
                ->all(),
            'logs' => AuditLog::query()
                ->with('user')
                ->orderByDesc('created_at')
                ->limit(20)
                ->get()
                ->map(fn (AuditLog $log): array => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'actor' => $log->user?->name ?? 'system',
                    'targetType' => $log->target_type,
                    'targetId' => $log->target_id,
                    'meta' => $log->meta_json,
                    'createdAt' => optional($log->created_at)->toDateTimeString(),
                ])
                ->all(),
            'stageOptions' => array_map(fn (array $item): array => [
                'code' => $item['code'],
                'label' => "Stage {$item['number']}",
            ], StageCatalog::all()),
        ];
    }

    public function markView(User $user, string $stageCode, string $mode): array
    {
        $progress = StageProgress::query()->firstOrCreate(
            [
                'user_id' => $user->id,
                'stage_code' => $stageCode,
            ]
        );

        if ($mode === 'vuln') {
            $progress->vuln_viewed = true;
        }

        if ($mode === 'fixed') {
            $progress->fixed_viewed = true;
        }

        $progress->completed = $progress->vuln_viewed && $progress->fixed_viewed;
        $progress->save();

        return $this->stageProgressSummary($user, $stageCode);
    }

    public function runAction(User $user, string $stageCode, string $variant, string $action, array $payload, Request $request): array
    {
        if (! StageCatalog::exists($stageCode)) {
            throw new HttpException(404, 'Stage not found.');
        }

        return match ($stageCode) {
            'stage-1' => $this->handleStage1($user, $variant, $action, $payload),
            'stage-2' => $this->handleStage2($user, $variant, $action, $payload),
            'stage-3' => $this->handleStage3($user, $variant, $action, $payload),
            'stage-4' => $this->handleStage4($user, $variant, $action, $payload),
            'stage-5' => $this->handleStage5($user, $variant, $action, $payload, $request),
            'stage-6' => $this->handleStage6($user, $variant, $action, $payload),
            default => throw new HttpException(404, 'Unsupported stage.'),
        };
    }

    public function runCrossSiteDemo(User $user, string $variant, array $payload, Request $request): array
    {
        $bio = trim((string) ($payload['bio'] ?? ''));

        if ($variant === 'fixed') {
            $provided = (string) ($payload['stage5_token'] ?? '');
            $expected = (string) $request->session()->get('security_lab.stage5_token');
            $matched = $provided !== '' && hash_equals($expected, $provided);

            return [
                'success' => false,
                'message' => '修正版では状態変更時に追加トークンを確認します。',
                'request' => [
                    'source' => 'foreign-site-simulator',
                    'bio' => $bio,
                    'hasStageToken' => $provided !== '',
                ],
                'serverDecision' => [
                    'csrfProtection' => 'blocked',
                    'reason' => $matched ? 'unexpected-match' : 'missing-or-invalid-stage-token',
                ],
                'stored' => [
                    'bio' => $user->bio,
                ],
                'response' => [
                    'status' => 403,
                    'message' => '意図しない状態変更リクエストを拒否しました。',
                ],
            ];
        }

        $user->forceFill(['bio' => $bio])->save();
        $this->writeAuditLog($user, 'stage5.cross_site_profile_update', 'user', (string) $user->id, [
            'variant' => $variant,
            'bio' => $bio,
        ]);

        return [
            'success' => true,
            'message' => '脆弱版では Cookie ベースのログイン状態だけでプロフィールが更新されました。',
            'request' => [
                'source' => 'foreign-site-simulator',
                'bio' => $bio,
            ],
            'serverDecision' => [
                'csrfProtection' => 'not-configured',
                'accepted' => true,
            ],
            'stored' => [
                'bio' => $user->fresh()->bio,
            ],
            'response' => [
                'status' => 200,
                'message' => 'プロフィールを更新しました。',
            ],
        ];
    }

    private function handleStage1(User $user, string $variant, string $action, array $payload): array
    {
        if ($action === 'start_round') {
            $session = GameSession::query()->create([
                'user_id' => $user->id,
                'stage_code' => 'stage-1',
                'started_at' => now(),
                'meta_json' => [
                    'variant' => $variant,
                    'max_seconds' => 8,
                    'max_expected_score' => 160,
                ],
            ]);

            return [
                'success' => true,
                'message' => 'ゲームセッションを開始しました。',
                'request' => [
                    'action' => 'start_round',
                    'variant' => $variant,
                ],
                'serverDecision' => [
                    'sessionCreated' => true,
                    'sessionId' => $session->id,
                    'expectedMaxScore' => 160,
                ],
                'stored' => [
                    'gameSession' => [
                        'id' => $session->id,
                        'startedAt' => $session->started_at?->toDateTimeString(),
                    ],
                ],
                'response' => [
                    'sessionId' => $session->id,
                    'durationSeconds' => 8,
                    'maxExpectedScore' => 160,
                ],
            ];
        }

        if ($action !== 'submit_score') {
            throw new HttpException(422, 'Unsupported action for stage 1.');
        }

        $clientScore = (int) ($payload['client_score'] ?? 0);
        $sessionId = isset($payload['session_id']) ? (int) $payload['session_id'] : null;

        if ($variant === 'vuln') {
            $session = GameSession::query()->find($sessionId);
            if ($session instanceof GameSession) {
                $session->forceFill([
                    'finished_at' => now(),
                    'client_score' => $clientScore,
                    'validated_score' => $clientScore,
                    'is_valid' => true,
                ])->save();
            }

            $highScore = $this->upsertHighScore($user, 'stage-1', $clientScore, 'クライアント値をそのまま反映');

            return [
                'success' => true,
                'message' => '脆弱版では送信された score をほぼそのまま保存しました。',
                'request' => [
                    'session_id' => $sessionId,
                    'client_score' => $clientScore,
                ],
                'serverDecision' => [
                    'validation' => 'minimal',
                    'acceptedScore' => $clientScore,
                ],
                'stored' => [
                    'gameSession' => $session?->only(['id', 'client_score', 'validated_score', 'is_valid']),
                    'highScore' => $highScore,
                ],
                'response' => [
                    'saved' => true,
                    'leaderboard' => $this->rankingEntries('stage-1', 'fixed'),
                ],
            ];
        }

        $session = GameSession::query()
            ->where('id', $sessionId)
            ->where('user_id', $user->id)
            ->where('stage_code', 'stage-1')
            ->first();

        if (! $session instanceof GameSession) {
            throw new HttpException(422, 'ゲームセッションが見つかりません。');
        }

        $elapsedSeconds = max(1, $session->started_at?->diffInSeconds(now()) ?? 1);
        $maxAllowed = min(180, ($elapsedSeconds * 18) + 16);
        $isValid = $clientScore >= 0 && $clientScore <= $maxAllowed;

        $session->forceFill([
            'finished_at' => now(),
            'client_score' => $clientScore,
            'validated_score' => $isValid ? $clientScore : null,
            'is_valid' => $isValid,
            'meta_json' => [
                'elapsed_seconds' => $elapsedSeconds,
                'max_allowed' => $maxAllowed,
                'variant' => $variant,
            ],
        ])->save();

        if ($isValid) {
            $this->upsertHighScore($user, 'stage-1', $clientScore, 'サーバー検証済みスコア');
        }

        return [
            'success' => $isValid,
            'message' => $isValid
                ? '修正版ではセッション情報と上限チェックを通過したため保存しました。'
                : '修正版では不自然なスコアとして拒否しました。',
            'request' => [
                'session_id' => $sessionId,
                'client_score' => $clientScore,
            ],
            'serverDecision' => [
                'validation' => 'server-side',
                'elapsedSeconds' => $elapsedSeconds,
                'maxAllowed' => $maxAllowed,
                'accepted' => $isValid,
            ],
            'stored' => [
                'gameSession' => $session->only(['id', 'client_score', 'validated_score', 'is_valid']),
            ],
            'response' => [
                'saved' => $isValid,
                'leaderboard' => $this->rankingEntries('stage-1', 'fixed'),
            ],
        ];
    }

    private function handleStage2(User $user, string $variant, string $action, array $payload): array
    {
        if ($action !== 'update_score') {
            throw new HttpException(422, 'Unsupported action for stage 2.');
        }

        $requestedUserId = (int) ($payload['target_user_id'] ?? $user->id);
        $score = max(0, (int) ($payload['score'] ?? 0));
        $comment = trim((string) ($payload['comment'] ?? 'ステージ 2 の更新'));

        if ($variant === 'vuln') {
            /** @var User|null $target */
            $target = User::query()->find($requestedUserId);

            if (! $target instanceof User) {
                throw new HttpException(422, '更新対象ユーザーが見つかりません。');
            }

            $saved = $this->upsertHighScore($target, 'stage-2', $score, $comment);

            return [
                'success' => true,
                'message' => '脆弱版ではリクエストに含まれた user_id をそのまま更新対象にしました。',
                'request' => [
                    'logged_in_as' => $this->serializeUser($user),
                    'target_user_id' => $requestedUserId,
                    'score' => $score,
                ],
                'serverDecision' => [
                    'ownershipCheck' => 'missing',
                    'updatedUser' => $this->serializeUser($target),
                ],
                'stored' => [
                    'highScore' => $saved,
                ],
                'response' => [
                    'leaderboard' => $this->rankingEntries('stage-2', 'fixed'),
                ],
            ];
        }

        $saved = $this->upsertHighScore($user, 'stage-2', $score, $comment);

        return [
            'success' => true,
            'message' => '修正版では更新対象をログイン中ユーザーから確定しました。',
            'request' => [
                'logged_in_as' => $this->serializeUser($user),
                'target_user_id' => $requestedUserId,
                'score' => $score,
            ],
            'serverDecision' => [
                'ownershipCheck' => 'passed',
                'requestedUserIgnored' => $requestedUserId !== $user->id,
                'updatedUser' => $this->serializeUser($user),
            ],
            'stored' => [
                'highScore' => $saved,
            ],
            'response' => [
                'leaderboard' => $this->rankingEntries('stage-2', 'fixed'),
            ],
        ];
    }

    private function handleStage3(User $user, string $variant, string $action, array $payload): array
    {
        if ($action !== 'admin_operation') {
            throw new HttpException(422, 'Unsupported action for stage 3.');
        }

        $operation = (string) ($payload['operation'] ?? 'list_users');
        $stageCode = $payload['stage_code'] ?? null;

        if ($variant === 'fixed' && $user->role !== 'admin') {
            return [
                'success' => false,
                'message' => '修正版では管理者ロールがないため拒否しました。',
                'request' => [
                    'operation' => $operation,
                    'stage_code' => $stageCode,
                    'actor' => $this->serializeUser($user),
                ],
                'serverDecision' => [
                    'authorization' => 'denied',
                    'requiredRole' => 'admin',
                    'actualRole' => $user->role,
                ],
                'stored' => null,
                'response' => [
                    'status' => 403,
                    'message' => '管理者専用の操作です。',
                ],
            ];
        }

        $result = match ($operation) {
            'list_users' => [
                'users' => User::query()->orderBy('name')->get()->map(
                    fn (User $item): array => $this->serializeUser($item)
                )->all(),
            ],
            'reset_rankings' => [
                'deleted' => $this->demoDataService->resetHighScores(is_string($stageCode) ? $stageCode : null),
            ],
            'reseed_dummy_data' => tap(['reseeded' => true], fn () => $this->demoDataService->seedBaseline(true)),
            'reset_progress' => [
                'deleted' => $this->demoDataService->resetProgress(),
            ],
            default => throw new HttpException(422, 'Unknown admin operation.'),
        };

        $this->writeAuditLog($user, "stage3.{$operation}", 'admin', (string) ($stageCode ?? 'all'), [
            'variant' => $variant,
        ]);

        return [
            'success' => true,
            'message' => $variant === 'vuln'
                ? '脆弱版では導線非表示でもサーバー側が操作を許可しました。'
                : '修正版では管理者権限を確認したうえで操作を実行しました。',
            'request' => [
                'operation' => $operation,
                'stage_code' => $stageCode,
                'actor' => $this->serializeUser($user),
            ],
            'serverDecision' => [
                'authorization' => $variant === 'vuln' ? 'missing' : 'passed',
                'actorRole' => $user->role,
            ],
            'stored' => $result,
            'response' => [
                'adminSnapshot' => [
                    'userCount' => User::query()->count(),
                    'scoreCount' => HighScore::query()->count(),
                    'logCount' => AuditLog::query()->count(),
                ],
            ],
        ];
    }

    private function handleStage4(User $user, string $variant, string $action, array $payload): array
    {
        if ($action !== 'save_comment') {
            throw new HttpException(422, 'Unsupported action for stage 4.');
        }

        $score = max(0, (int) ($payload['score'] ?? 0));
        $comment = trim((string) ($payload['comment'] ?? ''));
        $saved = $this->upsertHighScore($user, 'stage-4', $score, $comment);

        return [
            'success' => true,
            'message' => $variant === 'vuln'
                ? '保存自体は同じでも、脆弱版では表示時に HTML として扱われます。'
                : '修正版では同じ文字列をテキストとして安全に描画します。',
            'request' => [
                'score' => $score,
                'comment' => $comment,
            ],
            'serverDecision' => [
                'storagePolicy' => 'store-as-input',
                'renderingMode' => $variant === 'vuln' ? 'raw-html' : 'escaped-text',
            ],
            'stored' => [
                'highScore' => $saved,
            ],
            'response' => [
                'leaderboard' => $this->rankingEntries('stage-4', $variant),
            ],
        ];
    }

    private function handleStage5(User $user, string $variant, string $action, array $payload, Request $request): array
    {
        if ($action !== 'update_profile') {
            throw new HttpException(422, 'Unsupported action for stage 5.');
        }

        $bio = trim((string) ($payload['bio'] ?? ''));
        $stageToken = (string) ($payload['stage5_token'] ?? '');

        if ($variant === 'fixed') {
            $expected = (string) $request->session()->get('security_lab.stage5_token');
            $tokenMatched = $stageToken !== '' && hash_equals($expected, $stageToken);

            if (! $tokenMatched) {
                return [
                    'success' => false,
                    'message' => '修正版では追加トークンが一致しないため拒否しました。',
                    'request' => [
                        'bio' => $bio,
                        'hasStageToken' => $stageToken !== '',
                    ],
                    'serverDecision' => [
                        'csrfProtection' => 'blocked',
                        'tokenMatched' => false,
                    ],
                    'stored' => [
                        'bio' => $user->bio,
                    ],
                    'response' => [
                        'status' => 403,
                        'message' => 'プロフィール更新を拒否しました。',
                    ],
                ];
            }
        }

        $user->forceFill(['bio' => $bio])->save();
        $this->writeAuditLog($user, 'stage5.profile_update', 'user', (string) $user->id, [
            'variant' => $variant,
            'bio' => $bio,
        ]);

        return [
            'success' => true,
            'message' => $variant === 'vuln'
                ? '脆弱版では追加保護なしでプロフィール更新が成立しました。'
                : '修正版ではトークン確認を通過したため更新しました。',
            'request' => [
                'bio' => $bio,
                'hasStageToken' => $stageToken !== '',
            ],
            'serverDecision' => [
                'csrfProtection' => $variant === 'vuln' ? 'not-configured' : 'passed',
            ],
            'stored' => [
                'bio' => $user->fresh()->bio,
            ],
            'response' => [
                'status' => 200,
                'message' => 'プロフィールを更新しました。',
            ],
        ];
    }

    private function handleStage6(User $user, string $variant, string $action, array $payload): array
    {
        if ($action !== 'inspect_api') {
            throw new HttpException(422, 'Unsupported action for stage 6.');
        }

        $kind = (string) ($payload['kind'] ?? 'profile');
        $stageCode = (string) ($payload['stage_code'] ?? 'stage-6');
        $response = $this->buildApiExample($user, $variant, $kind, $stageCode);

        return [
            'success' => true,
            'message' => $variant === 'vuln'
                ? '脆弱版では画面に不要な内部情報まで含めています。'
                : '修正版では必要最小限のレスポンスだけを返します。',
            'request' => [
                'kind' => $kind,
                'stage_code' => $stageCode,
            ],
            'serverDecision' => [
                'responsePolicy' => $variant === 'vuln' ? 'model-like' : 'view-model',
            ],
            'stored' => null,
            'response' => $response,
        ];
    }

    private function rankingEntries(string $stageCode, string $variant): array
    {
        return HighScore::query()
            ->with('user')
            ->where('stage_code', $stageCode)
            ->orderByDesc('score')
            ->orderBy('updated_at')
            ->limit(10)
            ->get()
            ->values()
            ->map(function (HighScore $score, int $index) use ($variant): array {
                return [
                    'rank' => $index + 1,
                    'id' => $score->id,
                    'playerId' => $score->user_id,
                    'playerName' => $score->user?->name ?? 'Unknown',
                    'score' => $score->score,
                    'comment' => $score->comment,
                    'updatedAt' => optional($score->updated_at)->toDateTimeString(),
                    'variant' => $variant,
                ];
            })
            ->all();
    }

    private function ownRank(User $user, string $stageCode): array
    {
        /** @var Collection<int, HighScore> $scores */
        $scores = HighScore::query()
            ->where('stage_code', $stageCode)
            ->orderByDesc('score')
            ->orderBy('updated_at')
            ->get();

        $index = $scores->search(fn (HighScore $score): bool => $score->user_id === $user->id);

        return [
            'rank' => $index === false ? null : $index + 1,
            'bestScore' => $scores->firstWhere('user_id', $user->id)?->score,
        ];
    }

    private function stageProgressSummary(User $user, string $stageCode): array
    {
        $progress = StageProgress::query()
            ->where('user_id', $user->id)
            ->where('stage_code', $stageCode)
            ->first();

        return [
            'vulnViewed' => (bool) $progress?->vuln_viewed,
            'fixedViewed' => (bool) $progress?->fixed_viewed,
            'completed' => (bool) $progress?->completed,
        ];
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'bio' => $user->bio,
            'createdAt' => optional($user->created_at)->toDateTimeString(),
        ];
    }

    private function upsertHighScore(User $user, string $stageCode, int $score, ?string $comment): array
    {
        /** @var HighScore $highScore */
        $highScore = HighScore::query()->firstOrNew([
            'user_id' => $user->id,
            'stage_code' => $stageCode,
        ]);

        $currentScore = $highScore->exists ? $highScore->score : null;
        $highScore->score = $score;
        $highScore->comment = $comment;
        $highScore->save();

        $this->writeAuditLog($user, 'high_score.saved', 'high_score', (string) $highScore->id, [
            'stage_code' => $stageCode,
            'previous_score' => $currentScore,
            'new_score' => $score,
        ]);

        return [
            'id' => $highScore->id,
            'userId' => $highScore->user_id,
            'stageCode' => $highScore->stage_code,
            'score' => $highScore->score,
            'comment' => $highScore->comment,
            'updatedAt' => optional($highScore->updated_at)->toDateTimeString(),
        ];
    }

    private function demoAccountCards(): array
    {
        return User::query()
            ->orderByRaw("CASE WHEN role = 'admin' THEN 0 ELSE 1 END")
            ->orderBy('name')
            ->get()
            ->map(fn (User $user): array => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'password' => DemoDataService::DEFAULT_PASSWORD,
            ])
            ->all();
    }

    private function buildApiExample(User $user, string $variant, string $kind, string $stageCode = 'stage-6'): array
    {
        if ($kind === 'profile') {
            if ($variant === 'vuln') {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'bio' => $user->bio,
                    'internal_note' => $user->internal_note,
                    'created_at' => optional($user->created_at)->toDateTimeString(),
                    'updated_at' => optional($user->updated_at)->toDateTimeString(),
                ];
            }

            return [
                'name' => $user->name,
                'bio' => $user->bio,
                'roleBadge' => $user->role === 'admin' ? 'Admin' : 'Player',
            ];
        }

        $query = HighScore::query()
            ->with('user')
            ->where('stage_code', $stageCode)
            ->orderByDesc('score')
            ->limit(5);

        if ($variant === 'vuln') {
            return $query->get()->map(fn (HighScore $score): array => [
                'id' => $score->id,
                'stage_code' => $score->stage_code,
                'score' => $score->score,
                'comment' => $score->comment,
                'created_at' => optional($score->created_at)->toDateTimeString(),
                'updated_at' => optional($score->updated_at)->toDateTimeString(),
                'user' => [
                    'id' => $score->user?->id,
                    'name' => $score->user?->name,
                    'email' => $score->user?->email,
                    'role' => $score->user?->role,
                    'internal_note' => $score->user?->internal_note,
                ],
            ])->all();
        }

        return $query->get()->values()->map(fn (HighScore $score, int $index): array => [
            'rank' => $index + 1,
            'playerName' => $score->user?->name,
            'score' => $score->score,
            'updatedAt' => optional($score->updated_at)->toDateTimeString(),
        ])->all();
    }

    private function writeAuditLog(User $user, string $action, ?string $targetType, ?string $targetId, array $meta): void
    {
        AuditLog::query()->create([
            'user_id' => $user->id,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'meta_json' => $meta,
            'created_at' => Carbon::now(),
        ]);
    }
}
