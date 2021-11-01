<?php

namespace IZal\Lshopify\Rules;

use Illuminate\Contracts\Validation\Rule;

/**
 * This rule validates Markdown for non-HTTPS image links.
 */
final class ImageRule implements Rule
{
    public function passes($attribute, $value): bool
    {
        //        return
    }

    public function message(): string
    {
        return 'The :attribute field contains at least one image with an HTTP link.';
    }
}
