<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $meta        = $page['props']['meta']   ?? [];
            $schema      = $page['props']['schema'] ?? null;
            $title       = $meta['title']       ?? config('app.name');
            $description = $meta['description'] ?? '';
            $ogImage     = $meta['og_image']    ?? asset('images/og-default.jpg');
            $canonical   = $meta['canonical']   ?? url()->current();
        @endphp

        <title>{{ $title }}</title>
        <meta name="description" content="{{ $description }}">
        <link rel="canonical" href="{{ $canonical }}">

        <meta property="og:title"        content="{{ $title }}">
        <meta property="og:description"  content="{{ $description }}">
        <meta property="og:url"          content="{{ $canonical }}">
        <meta property="og:type"         content="product">
        <meta property="og:image"        content="{{ $ogImage }}">
        <meta property="og:image:width"  content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:locale"       content="uk_UA">

        <meta name="twitter:card"        content="summary_large_image">
        <meta name="twitter:title"       content="{{ $title }}">
        <meta name="twitter:description" content="{{ $description }}">
        <meta name="twitter:image"       content="{{ $ogImage }}">

        @if($schema)
            <script type="application/ld+json">
                {!! json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
            </script>
        @endif

        <style>
            html { background-color: oklch(1 0 0); }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])

        <x-inertia::head />
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>