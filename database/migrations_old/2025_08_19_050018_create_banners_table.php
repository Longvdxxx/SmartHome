<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Tên banner
            $table->text('description')->nullable(); // Nội dung mô tả
            $table->string('image_url'); // Link ảnh
            $table->unsignedBigInteger('product_id')->nullable(); // ID sản phẩm liên kết
            $table->timestamps();
            $table->softDeletes(); // Thêm cột deleted_at
        });

        // Nếu muốn ràng buộc khóa ngoại
        Schema::table('banners', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
        });

        Schema::dropIfExists('banners');
    }
};
