<?php

namespace IZal\Lshopify\Tests\Http\Controllers;

use IZal\Lshopify\Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    public function test_get_dashboard()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }
}
