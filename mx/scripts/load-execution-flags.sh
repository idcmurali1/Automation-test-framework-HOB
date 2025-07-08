#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   load-execution-flags.sh
#
#   Creaetd By: Sergio Fernandez (vn0t1qt)
#   Created On: Apr/04/2023
#
#   Copyright © 2023 Walmart. All rights reserved.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

defaultExecutionFlagsFile="./mx/scripts/execution-flags/execution_flags.txt"

if ! [ -z $EXECUTION_FLAGS_FILE ]; then # If EXECUTION_FLAGS_FILE exists means it was provided by local execution...

  if [ -f "$EXECUTION_FLAGS_FILE" ]; then
    cprintMsg "${G}[√] ${RESET}EXECUTION_FLAGS_FILE=${EXECUTION_FLAGS_FILE}"
  else
    cprintMsg ""
    cprintMsg "[!] EXECUTION_FLAGS_FILE: File not found: $EXECUTION_FLAGS_FILE"
    cprintMsg "    Default file will be used: $defaultExecutionFlagsFile"
    export EXECUTION_FLAGS_FILE=$defaultExecutionFlagsFile
  fi

else # If EXECUTION_FLAGS_FILE does not exist means local execution does not provided it, so it might be Looper execution...

  if ! [ -z ${EXECUTION_FLAGS} ]; then
    mv EXECUTION_FLAGS ${EXECUTION_FLAGS}
    export EXECUTION_FLAGS_FILE="./${EXECUTION_FLAGS}"
    cprintMsg "${G}[√] ${RESET}EXECUTION_FLAGS_FILE=${EXECUTION_FLAGS_FILE}"
  else
    cprintMsg ""
    cprintMsg "[!] EXECUTION_FLAGS_FILE: Variable not found or is empty"
    cprintMsg "    Default File will be used: $defaultExecutionFlagsFile"
    export EXECUTION_FLAGS_FILE=$defaultExecutionFlagsFile
  fi
  
fi

if ! [ -f "$EXECUTION_FLAGS_FILE" ]; then
  cprintMsg ""
  cprintMsg "[!] EXECUTION_FLAGS_FILE: File not found: $EXECUTION_FLAGS_FILE"
  cprintMsg "    No Execution Flags will be loaded"
else

  data=$(cat $EXECUTION_FLAGS_FILE)
  data=$(echo "$data" | sed -E '/^#/d') # delete commented lines (starting with #)
  data=$(echo "$data" | sed '/^[[:space:]]*$/d') # delete empty lines

  echo ""
  echo "EXPORTING EXECUTION VARIABLES:"

  while read -r pair; do
    name=$(echo "$pair" | cut -d '=' -f 1)
    value=$(echo "$pair" | cut -d '=' -f 2)
    export "$name"="$value"
    echo "    Exported: $name=$value"
  done <<< "$data"

fi
