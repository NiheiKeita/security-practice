<?php

namespace App\Services\SecurityLab;

use App\Models\AdminUser;
use App\Models\AuditLog;
use App\Models\GameSession;
use App\Models\HighScore;
use App\Models\StageProgress;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoDataService
{
    public const DEFAULT_PASSWORD = 'password';

    public function seedBaseline(bool $resetLabData = true): void
    {
        DB::transaction(function () use ($resetLabData): void {
            $users = collect($this->demoUsers())->map(function (array $item): User {
                /** @var User $user */
                $user = User::withTrashed()->updateOrCreate(
                    ['email' => $item['email']],
                    [
                        'name' => $item['name'],
                        'password' => Hash::make(self::DEFAULT_PASSWORD),
                        'role' => $item['role'],
                        'bio' => $item['bio'],
                        'internal_note' => $item['internal_note'],
                        'deleted_at' => null,
                    ]
                );

                return $user;
            })->keyBy('email');

            AdminUser::withTrashed()->updateOrCreate(
                ['email' => 'root@example.com'],
                [
                    'name' => 'Root Admin',
                    'password' => Hash::make('passsword'),
                    'deleted_at' => null,
                ]
            );

            if ($resetLabData) {
                AuditLog::query()->delete();
                StageProgress::query()->delete();
                GameSession::query()->delete();
                HighScore::query()->delete();
            }

            $this->seedHighScores($users->all());
            $this->seedProgresses($users->all());
            $this->seedAuditLogs($users->all());
        });
    }

    public function resetProgress(): int
    {
        return (int) StageProgress::query()->delete();
    }

    public function resetHighScores(?string $stageCode = null): int
    {
        $scoreQuery = HighScore::query();
        $sessionQuery = GameSession::query();

        if ($stageCode !== null) {
            $scoreQuery->where('stage_code', $stageCode);
            $sessionQuery->where('stage_code', $stageCode);
        }

        $deletedSessions = $sessionQuery->delete();
        $deletedScores = $scoreQuery->delete();

        return (int) ($deletedScores + $deletedSessions);
    }

    public function demoUsers(): array
    {
        return [
            [
                'name' => 'Aiko',
                'email' => 'aiko@example.local',
                'role' => 'player',
                'bio' => '毎日クリックゲームで遊ぶデモユーザー。',
                'internal_note' => 'support-tier:bronze',
            ],
            [
                'name' => 'Kenji',
                'email' => 'kenji@example.local',
                'role' => 'player',
                'bio' => 'ランキング上位を狙う検証用アカウント。',
                'internal_note' => 'watch:stage-2',
            ],
            [
                'name' => 'Rina',
                'email' => 'rina@example.local',
                'role' => 'player',
                'bio' => '表示系ステージを確認するサンプル。',
                'internal_note' => 'ui-checker',
            ],
            [
                'name' => 'Sora',
                'email' => 'sora@example.local',
                'role' => 'player',
                'bio' => 'API レスポンスの比較確認用アカウント。',
                'internal_note' => 'beta-opt-in',
            ],
            [
                'name' => 'Mentor Admin',
                'email' => 'mentor@example.local',
                'role' => 'admin',
                'bio' => '管理画面の比較確認用アカウント。',
                'internal_note' => 'admin-demo',
            ],
        ];
    }

    private function seedHighScores(array $usersByEmail): void
    {
        $baseTime = Carbon::now()->subDays(3);

        $scores = [
            'stage-1' => [
                ['email' => 'aiko@example.local', 'score' => 66, 'comment' => '安定して 60 点台。'],
                ['email' => 'kenji@example.local', 'score' => 88, 'comment' => '今日は調子が良い。'],
                ['email' => 'rina@example.local', 'score' => 54, 'comment' => '修正版でも通る範囲。'],
                ['email' => 'mentor@example.local', 'score' => 97, 'comment' => '管理者のサンプルスコア。'],
            ],
            'stage-2' => [
                ['email' => 'aiko@example.local', 'score' => 34, 'comment' => '本人のスコア。'],
                ['email' => 'kenji@example.local', 'score' => 73, 'comment' => '上書き対象になりやすい例。'],
                ['email' => 'sora@example.local', 'score' => 58, 'comment' => 'ID で狙われる側の例。'],
            ],
            'stage-3' => [
                ['email' => 'aiko@example.local', 'score' => 12, 'comment' => '管理操作とは別の通常データ。'],
                ['email' => 'mentor@example.local', 'score' => 91, 'comment' => '本来は管理者が確認するデータ。'],
            ],
            'stage-4' => [
                ['email' => 'rina@example.local', 'score' => 44, 'comment' => '普通のコメントです。'],
                ['email' => 'sora@example.local', 'score' => 61, 'comment' => '<strong>目立つ装飾つきコメント</strong>'],
                ['email' => 'kenji@example.local', 'score' => 39, 'comment' => '<span style="color:#dc2626;font-size:18px">色付きで見える教材用コメント</span>'],
            ],
            'stage-5' => [
                ['email' => 'aiko@example.local', 'score' => 42, 'comment' => 'プロフィール更新の前提データ。'],
                ['email' => 'mentor@example.local', 'score' => 57, 'comment' => '管理者側サンプル。'],
            ],
            'stage-6' => [
                ['email' => 'sora@example.local', 'score' => 84, 'comment' => 'API 比較向けの行。'],
                ['email' => 'rina@example.local', 'score' => 47, 'comment' => '画面に不要な情報は返さない。'],
                ['email' => 'mentor@example.local', 'score' => 95, 'comment' => '返しすぎレスポンスの比較用。'],
            ],
        ];

        foreach ($scores as $stageCode => $rows) {
            foreach ($rows as $index => $row) {
                /** @var User $user */
                $user = $usersByEmail[$row['email']];
                $createdAt = $baseTime->copy()->addHours(($index + 1) * 3 + strlen($stageCode));

                $score = HighScore::query()->create([
                    'user_id' => $user->id,
                    'stage_code' => $stageCode,
                    'score' => $row['score'],
                    'comment' => $row['comment'],
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                GameSession::query()->create([
                    'user_id' => $user->id,
                    'stage_code' => $stageCode,
                    'started_at' => $createdAt->copy()->subSeconds(12),
                    'finished_at' => $createdAt,
                    'client_score' => $row['score'],
                    'validated_score' => $row['score'],
                    'is_valid' => true,
                    'meta_json' => [
                        'seeded' => true,
                        'source' => 'baseline',
                    ],
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                AuditLog::query()->create([
                    'user_id' => $user->id,
                    'action' => 'seed.score.created',
                    'target_type' => 'high_score',
                    'target_id' => (string) $score->id,
                    'meta_json' => [
                        'stage_code' => $stageCode,
                        'score' => $row['score'],
                    ],
                    'created_at' => $createdAt,
                ]);
            }
        }
    }

    private function seedProgresses(array $usersByEmail): void
    {
        foreach ($usersByEmail as $email => $user) {
            if ($email === 'mentor@example.local') {
                continue;
            }

            foreach (StageCatalog::codes() as $index => $code) {
                StageProgress::query()->create([
                    'user_id' => $user->id,
                    'stage_code' => $code,
                    'vuln_viewed' => $index < 2,
                    'fixed_viewed' => $index === 0,
                    'completed' => $index === 0,
                    'created_at' => now()->subDays(2),
                    'updated_at' => now()->subDays(1),
                ]);
            }
        }
    }

    private function seedAuditLogs(array $usersByEmail): void
    {
        /** @var User $admin */
        $admin = $usersByEmail['mentor@example.local'];

        AuditLog::query()->create([
            'user_id' => $admin->id,
            'action' => 'seed.completed',
            'target_type' => 'system',
            'target_id' => 'security-lab',
            'meta_json' => [
                'users' => count($usersByEmail),
                'stages' => count(StageCatalog::codes()),
            ],
            'created_at' => now()->subHours(6),
        ]);
    }
}
