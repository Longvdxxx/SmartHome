<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('user_logs', function (Blueprint $table) {
            $table->string('target_type')->nullable();   // Model bị tác động (Brand, Category…)
            $table->unsignedBigInteger('target_id')->nullable(); // ID bản ghi bị tác động
            $table->json('changes')->nullable(); // Lưu thay đổi (trước → sau)
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_logs', function (Blueprint $table) {
            //
        });
    }
};
