$targetDir = "c:\Users\Danie\OneDrive\Desktop\E-commerce\ecommerce_frontend"
$files = Get-ChildItem -Path $targetDir -Filter *.html

foreach ($file in $files) {
    if ($file.Name -eq "setup_site.ps1") { continue }
    
    $content = Get-Content -Path $file.FullName -Raw
    
    # Avoid duplicating the script tag if the user runs this multiple times
    if (-not $content.Contains('<script src="core.js"></script>')) {
        $content = $content.Replace("</body>", "`n<script src=`"core.js`"></script>`n</body>")
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Injected into $($file.Name)"
    }
}
Write-Host "Injection Complete."
