<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ip' => $this->ip,
            'url' => $this->url,
            'method' => $this->method,
            'status' => $this->status,
            'user_agent' => $this->user_agent,
            'response_time' => $this->response_time,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
