<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Log>
 */
class LogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $commonUrls = [
            '/api/users', '/api/products', '/api/orders', '/api/auth/login', '/api/auth/logout',
            '/api/dashboard', '/api/reports', '/home', '/about', '/contact', '/products',
            '/cart', '/checkout', '/profile', '/search'
        ];
        
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/91.0.4472.124',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
        ];
        
        return [
            'ip' => fake()->ipv4(),
            'url' => fake()->randomElement($commonUrls),
            'method' => fake()->randomElement(['GET', 'POST', 'PUT', 'DELETE']),
            'status' => fake()->randomElement([200, 201, 400, 404, 500]),
            'user_agent' => fake()->randomElement($userAgents),
            'response_time' => fake()->randomFloat(2, 10, 2000),
            'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
