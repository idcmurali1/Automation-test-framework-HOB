# Running network monitoring with R2 tests

* Start Network Monitoring script
```bash
$ python3 scripts/network_monitoring/capture-session.py --start
```

* Start R2 tests
```bash
$ java -jar r2-binary/r2.jar \                                              
  -a us/ \
  -d us/e2e-tests/dependencies/ios/ios-default.yaml \
  -t example-test \
  -p local \
```

* Stop Network scripts and upload logs to Splunk
    * Please update appVer number and flow test case name
```bash
$ python3 /network_monitoring/capture-session.py --stop-and-upload --appVer 22.1 --flow "add to cart"
```
