$source = "c:\Users\Danie\OneDrive\Desktop\E-commerce\stitch_premium_e_commerce_platform"
$dest = "c:\Users\Danie\OneDrive\Desktop\E-commerce\ecommerce_frontend"
$null = New-Item -ItemType Directory -Force -Path $dest

$dirs = Get-ChildItem -Path $source -Directory
$links = @()

foreach ($dir in $dirs) {
    $codeFile = Join-Path -Path $dir.FullName -ChildPath "code.html"
    if (Test-Path $codeFile) {
        $newName = $dir.Name + ".html"
        $destFile = Join-Path -Path $dest -ChildPath $newName
        Copy-Item -Path $codeFile -Destination $destFile -Force
        $links += $newName
    }
}

$indexContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Stitch Premium E-Commerce Website</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet"/>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen text-gray-800">
    <div class="container mx-auto px-4 py-12 max-w-4xl">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Stitch E-Commerce Screens</h1>
        <p class="text-gray-500 mb-8">Select a screen below to view its HTML design.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
"@

foreach ($link in $links) {
    if ($link) {
        $humanName = (Get-Culture).TextInfo.ToTitleCase($link.Replace('.html', '').Replace('_', ' '))
        $indexContent += @"
            <a href="$link" class="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-500 transition-all group">
                <h2 class="font-semibold text-gray-800 group-hover:text-orange-500">$humanName</h2>
            </a>
"@
    }
}

$indexContent += @"
        </div>
    </div>
</body>
</html>
"@

Set-Content -Path (Join-Path -Path $dest -ChildPath "index.html") -Value $indexContent
Write-Host "Site built successfully at $dest"
