<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateRecommendations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-recommendations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $output = shell_exec('python3 recommend.py'); // gọi Python script
        $this->info("Recommendations updated!");
    }
}
