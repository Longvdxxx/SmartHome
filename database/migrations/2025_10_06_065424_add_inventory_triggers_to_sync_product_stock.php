<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared('
            CREATE TRIGGER trg_store_inventories_after_insert
            AFTER INSERT ON store_inventories
            FOR EACH ROW
            BEGIN
                UPDATE products
                SET stock = stock + NEW.quantity
                WHERE id = NEW.product_id;
            END
        ');

        DB::unprepared('
            CREATE TRIGGER trg_store_inventories_after_update
            AFTER UPDATE ON store_inventories
            FOR EACH ROW
            BEGIN
                UPDATE products
                SET stock = stock + (NEW.quantity - OLD.quantity)
                WHERE id = NEW.product_id;
            END
        ');

        DB::unprepared('
            CREATE TRIGGER trg_store_inventories_after_delete
            AFTER DELETE ON store_inventories
            FOR EACH ROW
            BEGIN
                UPDATE products
                SET stock = stock - OLD.quantity
                WHERE id = OLD.product_id;
            END
        ');

        DB::unprepared('
            CREATE TRIGGER trg_store_inventories_sync_total
            AFTER INSERT ON store_inventories
            FOR EACH ROW
            BEGIN
                UPDATE products p
                SET p.stock = (
                    SELECT COALESCE(SUM(quantity), 0)
                    FROM store_inventories si
                    WHERE si.product_id = NEW.product_id
                )
                WHERE p.id = NEW.product_id;
            END
        ');

        DB::unprepared('
            UPDATE products p
            SET p.stock = (
                SELECT COALESCE(SUM(quantity), 0)
                FROM store_inventories si
                WHERE si.product_id = p.id
            )
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS trg_store_inventories_after_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_store_inventories_after_update');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_store_inventories_after_delete');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_store_inventories_sync_total');
    }
};
