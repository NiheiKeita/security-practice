<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StageProgress extends Model
{
    use HasFactory;

    protected $table = 'stage_progresses';

    protected $fillable = [
        'user_id',
        'stage_code',
        'vuln_viewed',
        'fixed_viewed',
        'completed',
    ];

    protected $casts = [
        'vuln_viewed' => 'boolean',
        'fixed_viewed' => 'boolean',
        'completed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
