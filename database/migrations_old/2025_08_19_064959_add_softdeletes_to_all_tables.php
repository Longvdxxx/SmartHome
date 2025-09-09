<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Lấy danh sách tất cả các bảng trong database hiện tại
        $tables = DB::select('SHOW TABLES');

        // Lấy tên cột (ví dụ trong MySQL kết quả sẽ có key là 'Tables_in_ten_database')
        $dbName = DB::getDatabaseName();
        $key = "Tables_in_$dbName";

        foreach ($tables as $table) {
            $tableName = $table->$key;

            // Bỏ qua bảng migrations để tránh lỗi
            if ($tableName === 'migrations') {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                // Chỉ thêm nếu chưa tồn tại
                if (!Schema::hasColumn($tableName, 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        }
    }

    public function down(): void
    {
        $tables = DB::select('SHOW TABLES');
        $dbName = DB::getDatabaseName();
        $key = "Tables_in_$dbName";

        foreach ($tables as $table) {
            $tableName = $table->$key;

            if ($tableName === 'migrations') {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (Schema::hasColumn($tableName, 'deleted_at')) {
                    $table->dropSoftDeletes();
                }
            });
        }
    }
};
