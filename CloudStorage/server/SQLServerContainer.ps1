Set-Variable EnvFileRelLoc -Option Constant -Value "./.env";

Get-Content $EnvFileRelLoc | foreach {
    $name, $value = $_.split('=',2)
    if (![string]::IsNullOrWhiteSpace($name) -and !$name.StartsWith('#') -and !$name.Contains('=')) {
        Write-Host "Setting environment variable: NAME=$name ; VALUE=$value"
        set-content env:$name $value
    }
}

echo "MSSQL_SA_PASSWORD : $env:MSSQL_SA_PASSWORD"

docker run -it `
    -e "ACCEPT_EULA=Y" `
    -e "SA_PASSWORD=$env:MSSQL_SA_PASSWORD" `
    -p 1433:1433 `
    --name sql-server-2022 `
    mcr.microsoft.com/mssql/server:2022-latest