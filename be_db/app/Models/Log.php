<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Log extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip',
        'url',
        'method',
        'status',
        'user_agent',
        'response_time',
        'created_at'
    ];

    protected $casts = [
        'response_time' => 'float',
        'status' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Scopes for common analytics queries
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByDateRange($query, $startDate, $endDate = null)
    {
        $endDate = $endDate ?? Carbon::now();
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    public function scopeByIp($query, $ip)
    {
        return $query->where('ip', $ip);
    }

    public function scopeByMethod($query, $method)
    {
        return $query->where('method', $method);
    }

    public function scopeSlowRequests($query, $threshold = 1000)
    {
        return $query->where('response_time', '>', $threshold);
    }
}
