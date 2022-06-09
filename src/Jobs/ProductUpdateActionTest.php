<?php

namespace IZal\Lshopify\Jobs;

use IZal\Lshopify\Models\Product;
use Illuminate\Http\Request;

class ProductUpdateActionTest
{
    private $product;
    private $title;
    private $tags;

    public function __construct(Product $product, string $title, array $tags)
    {
        $this->product = $product;
        $this->title = $title;
        $this->tags = $tags;
    }

    public static function fromRequest(Product $product, Request $request): self
    {
        return new static($product, $request->title, $request->tags);
    }

    public function run()
    {
        return $this->product;
    }
}
