#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   colorful-print.sh
#
#   Creaetd By: Sergio Fernandez (vn0t1qt)
#   Created On: Jan/04/2022
#
#   Copyright © 2021 Walmart. All rights reserved.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

RESET='\e[0m'

GR='\e[30m' # gray
R='\e[31m'  # red
G='\e[32m'  # green
Y='\e[33m'  # yellow
B='\e[34m'  # blue
M='\e[35m'  # magenta
C='\e[36m'  # cyan
W='\e[37m'  # white

LGR='\e[1;30m' # light gray
LR='\e[1;31m'  # light red
LG='\e[1;32m'  # light green
LY='\e[1;33m'  # light yellow
LB='\e[1;34m'  # light blue
LM='\e[1;35m'  # light magenta
LC='\e[1;36m'  # light cyan
LW='\e[1;37m'  # light white

DGR='\e[2;30m' # dark gray
DR='\e[2;31m'  # dark red
DG='\e[2;32m'  # dark green
DY='\e[2;33m'  # dark yellow
DB='\e[2;34m'  # dark blue
DM='\e[2;35m'  # dark magenta
DC='\e[2;36m'  # dark cyan
DW='\e[2;37m'  # dark white

paramColor=''

#   Gets the corresponding color constant based on the given color name in the 'paramColor' var. If the given name
#   does not match any, then 'paramColor' will be assigned empty...
#      Usage: getParamColor [<color_name_string>]
#
function getParamColor() {
    paramColor=''
    case "$1" in
        reset | RESET) paramColor=$RESET ;;
        gr | GR) paramColor=$GR ;;
        r | R) paramColor=$R ;;
        g | G) paramColor=$G ;;
        y | Y) paramColor=$Y ;;
        b | B) paramColor=$B ;;
        m | M) paramColor=$M ;;
        c | C) paramColor=$C ;;
        w | W) paramColor=$W ;;
        lgr | LGR) paramColor=$LGR ;;
        lr | LR) paramColor=$LR ;;
        lg | LG) paramColor=$LG ;;
        ly | LY) paramColor=$LY ;;
        lb | LB) paramColor=$LB ;;
        lm | LM) paramColor=$LM ;;
        lc | LC) paramColor=$LC ;;
        lw | LW) paramColor=$LW ;;
        dgr | DGR) paramColor=$DGR ;;
        dr | DR) paramColor=$DR ;;
        dg | DG) paramColor=$DG ;;
        dy | DY) paramColor=$DY ;;
        db | DB) paramColor=$DB ;;
        dm | DM) paramColor=$DM ;;
        dc | DC) paramColor=$DC ;;
        dw | DW) paramColor=$DW ;;
        *) paramColor=''
    esac
}

#   Prints a text with the default color or given color in the same string...
#      Usage: cprint [<text_string>]
#
function cprint() {
    printf "${RESET}$1${RESET}"
}

#   Prints text with regular formatting...
#      Usage: cprintMsg [<text_string>]
#
function cprintMsg() {
    cprint "$1\n"
}

#   Prints a title with an specific format...
#      Usage: cprintTitle [<color_string>] [<title_string>]
#
function cprintTitle() {
    local color=""
    local title=""

    getParamColor "$1"
    if [ "$paramColor" == "" ]; then
        color=$RESET
        title=$1
    else
        color=$paramColor
        title=$2
    fi

    local spacesCount=$(expr 100 - 4)
    spacesCount=$(expr $spacesCount - ${#title})
    
    local blankSpaces=""
    for ((  i=1; i<=$spacesCount; i++ )); do
        blankSpaces="${blankSpaces} "
    done

    # printf "${color}\n"
    # printf "╔══════════════════════════════════════════════════════════════════════════════════════════════════╗\n"
    # printf "║  ${title}${blankSpaces}║\n"
    # printf "╚══════════════════════════════════════════════════════════════════════════════════════════════════╝\n"
    # printf "${RESET}\n"

    printf "\n"
    printf "${color}[[[     ${title}     ]]]\n"
    printf "${RESET}\n"
}

#   Prints text with error formatting...
#      Usage: cprintError [<text_string>]
#
function cprintError() {
    cprintMsg "${R}$1"
}

#   Prints text in white with a red error mark at the beginning...
#      Usage: cprintErrorMark [<text_string>]
#
function cprintErrorMark() {
    cprintMsg "${R}[X] ${RESET}$1"
}

#   Prints text with success formatting...
#      Usage: cprintSuccess [<text_string>]
#
function cprintSuccess() {
    cprintMsg "${G}$1"
}

#   Prints text in white with a green success mark at the beginning...
#      Usage: cprintSuccessMark [<text_string>]
#
function cprintSuccessMark() {
    cprintMsg "${G}[√] ${RESET}$1"
}

#   Prints text with warning formatting...
#      Usage: cprintWarning [<text_string>]
#
function cprintWarning() {
    cprintMsg "${Y}$1"
}

#   Prints text in white with a yellow warning mark at the beginning...
#      Usage: cprintWarningMark [<text_string>]
#
function cprintWarningMark() {
    cprintMsg "${Y}[!] ${RESET}$1"
}
