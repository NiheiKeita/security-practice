<?php

namespace Database\Seeders;

use App\Services\SecurityLab\DemoDataService;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        app(DemoDataService::class)->seedBaseline(true);
    }
}
