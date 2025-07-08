#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   test-results-compressor.sh
#
#   Creaetd By: Sergio Fernandez (vn0t1qt)
#   Created On: Mar/21/2023
#
#   Copyright © 2023 Walmart. All rights reserved.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

FILENAME=TestExecutionReport-${EXECUTION_BUILD_ID}.zip
FOLDER_TO_COMPRESS=report

if [ -d "$FOLDER_TO_COMPRESS" ]; then
    cprintMsg "COMPRESSING TEST EXECUTION REPORT FOR PUBLISHING:"
    zip -r $FILENAME $FOLDER_TO_COMPRESS
    cprintMsg ""
    cprintMsg "${G}[√] ${RESET}Test Execution Report compressed: $FILENAME"
else
    cprintMsg "[!] Folder does not exist: $FOLDER_TO_COMPRESS"
    cprintMsg "    Compression will not be performed."
fi
