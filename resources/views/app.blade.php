<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link href="{{ asset('/vendor/lshopify/app.css') }}" rel="stylesheet" />
    <script src="{{ asset('/vendor/lshopify/app.js') }}" defer></script>
</head>
<body>
@routes
@inertia
</body>
</html>
