<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'LaraReact') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        {{-- <link id="theme-css" href={{asset(path: '/themes/tailwind-light/theme.css')}} rel="stylesheet"></link> --}}

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite([
            'resources/css/app.css',    // Load Tailwind
            'resources/js/app.jsx',
            "resources/js/Pages/{$page['component']}.jsx"
        ])

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
