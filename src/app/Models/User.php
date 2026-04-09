<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use Notifiable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'bio',
        'internal_note',
        'tel',
        'password_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function gameSessions(): HasMany
    {
        return $this->hasMany(GameSession::class);
    }

    public function highScores(): HasMany
    {
        return $this->hasMany(HighScore::class);
    }

    public function stageProgresses(): HasMany
    {
        return $this->hasMany(StageProgress::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::updated(function ($user) {
            // プランが変更されたかどうかを確認する
            if ($user->isDirty('plan_id')) {
                // プランが変更された場合、ログを保存する
                DB::table('user_plan_logs')->insert([
                    'user_id' => $user->id,
                    'plan_id' => $user->plan_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });
    }
}
