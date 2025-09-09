<?php
namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SelectRoleController extends Controller
{
    public function show()
    {
        return Inertia::render('Client/SelectRole');
    }
}
