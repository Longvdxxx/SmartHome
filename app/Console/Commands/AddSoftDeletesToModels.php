<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class AddSoftDeletesToModels extends Command
{
    protected $signature = 'models:add-softdeletes';
    protected $description = 'Thêm SoftDeletes vào tất cả các model trong app/Models';

    public function handle()
    {
        $path = app_path('Models');
        $files = File::allFiles($path);

        foreach ($files as $file) {
            $content = File::get($file->getPathname());

            if (strpos($content, 'SoftDeletes') !== false) {
                $this->info($file->getFilename() . ' đã có SoftDeletes, bỏ qua');
                continue;
            }

            if (preg_match('/namespace\s+App\\\\Models;/', $content)) {
                $content = preg_replace(
                    '/(namespace\s+App\\\\Models;)/',
                    "$1\n\nuse Illuminate\\Database\\Eloquent\\SoftDeletes;",
                    $content,
                    1
                );
            }

            if (preg_match('/class\s+\w+\s+extends\s+Model\s*{/', $content)) {
                $content = preg_replace(
                    '/(class\s+\w+\s+extends\s+Model\s*{)/',
                    "$1\n    use SoftDeletes;\n",
                    $content,
                    1
                );
            }

            File::put($file->getPathname(), $content);
            $this->info($file->getFilename() . ' đã được thêm SoftDeletes');
        }

        $this->info('Hoàn thành thêm SoftDeletes cho tất cả models.');
    }
}
