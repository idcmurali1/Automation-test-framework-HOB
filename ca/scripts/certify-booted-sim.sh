#!/bin/sh

tmp_file_name="tmp.crt"
crt_url="http://pki.wal-mart.com/pki/CAs/Walmart/WalmartRootCA-SHA256.crt"

curl -o $tmp_file_name $crt_url
xcrun simctl keychain booted add-root-cert $tmp_file_name
rm -rf $tmp_file_name
