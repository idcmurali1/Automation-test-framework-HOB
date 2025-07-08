echo "ℹ️ Getting JIRA Certificates..."

_HOST='jira.walmart.com'
_OUTPUT_FILE='walmart_jira_certs.pem'

echo "> openssl s_client -connect jira.walmart.com:443 -showcerts \n"
openssl s_client -connect $_HOST:443 -showcerts
echo "..."

openssl s_client -connect $_HOST:443 -showcerts </dev/null 2>/dev/null | awk '
/-----BEGIN CERTIFICATE-----/ {flag=1} 
/-----END CERTIFICATE-----/ {print; flag=0} 
flag {print}' > "$_OUTPUT_FILE"

if [ -s "$_OUTPUT_FILE" ]; then
    echo "✅ Certificates files successfully created: $_OUTPUT_FILE"
    exit 0
else
    echo "❌ Cannot get certificates from server. Check connection."
    exit 1
fi