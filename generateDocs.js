/** This function creates documentaion for the pages out of the code for consumers
 * @author : Varun Rajasekar
 */

let rootPath = __dirname + '/wcp/test/pages';
const mappingRoot = __dirname + '/wcp/test/mapping';
const { readdirSync, writeFileSync } = require('fs');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readdir);
const yaml = require('js-yaml');
const { exec } = require('child_process');

let cssContent = `:root {
    /* Light */
    --light-color-background: #f2f4f8;
    --light-color-background-secondary: #eff0f1;
    --light-color-warning-text: #222;
    --light-color-background-warning: #e6e600;
    --light-color-icon-background: var(--light-color-background);
    --light-color-accent: #c5c7c9;
    --light-color-text: #222;
    --light-color-text-aside: #707070;
    --light-color-link: #4da6ff;
    --light-color-ts: #db1373;
    --light-color-ts-interface: #139d2c;
    --light-color-ts-enum: #9c891a;
    --light-color-ts-class: #2484e5;
    --light-color-ts-function: #572be7;
    --light-color-ts-namespace: #b111c9;
    --light-color-ts-private: #707070;
    --light-color-ts-variable: #4d68ff;
    --light-external-icon: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='10' height='10'><path fill-opacity='0' stroke='%23000' stroke-width='10' d='m43,35H5v60h60V57M45,5v10l10,10-30,30 20,20 30-30 10,10h10V5z'/></svg>");
    --light-color-scheme: light;

    /* Dark */
    --dark-color-background: #2b2e33;
    --dark-color-background-secondary: #1e2024;
    --dark-color-background-warning: #bebe00;
    --dark-color-warning-text: #222;
    --dark-color-icon-background: var(--dark-color-background-secondary);
    --dark-color-accent: #9096a2;
    --dark-color-text: #f5f5f5;
    --dark-color-text-aside: #dddddd;
    --dark-color-link: #00aff4;
    --dark-color-ts: #ff6492;
    --dark-color-ts-interface: #6cff87;
    --dark-color-ts-enum: #f4d93e;
    --dark-color-ts-class: #61b0ff;
    --dark-color-ts-function: #9772ff;
    --dark-color-ts-namespace: #e14dff;
    --dark-color-ts-private: #e2e2e2;
    --dark-color-ts-variable: #4d68ff;
    --dark-external-icon: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='10' height='10'><path fill-opacity='0' stroke='%23fff' stroke-width='10' d='m43,35H5v60h60V57M45,5v10l10,10-30,30 20,20 30-30 10,10h10V5z'/></svg>");
    --dark-color-scheme: dark;
}

@media (prefers-color-scheme: light) {
    :root {
        --color-background: var(--light-color-background);
        --color-background-secondary: var(--light-color-background-secondary);
        --color-background-warning: var(--light-color-background-warning);
        --color-warning-text: var(--light-color-warning-text);
        --color-icon-background: var(--light-color-icon-background);
        --color-accent: var(--light-color-accent);
        --color-text: var(--light-color-text);
        --color-text-aside: var(--light-color-text-aside);
        --color-link: var(--light-color-link);
        --color-ts: var(--light-color-ts);
        --color-ts-interface: var(--light-color-ts-interface);
        --color-ts-enum: var(--light-color-ts-enum);
        --color-ts-class: var(--light-color-ts-class);
        --color-ts-function: var(--light-color-ts-function);
        --color-ts-namespace: var(--light-color-ts-namespace);
        --color-ts-private: var(--light-color-ts-private);
        --color-ts-variable: var(--light-color-ts-variable);
        --external-icon: var(--light-external-icon);
        --color-scheme: var(--light-color-scheme);
    }
}

@media (prefers-color-scheme: dark) {
    :root {
        --color-background: var(--dark-color-background);
        --color-background-secondary: var(--dark-color-background-secondary);
        --color-background-warning: var(--dark-color-background-warning);
        --color-warning-text: var(--dark-color-warning-text);
        --color-icon-background: var(--dark-color-icon-background);
        --color-accent: var(--dark-color-accent);
        --color-text: var(--dark-color-text);
        --color-text-aside: var(--dark-color-text-aside);
        --color-link: var(--dark-color-link);
        --color-ts: var(--dark-color-ts);
        --color-ts-interface: var(--dark-color-ts-interface);
        --color-ts-enum: var(--dark-color-ts-enum);
        --color-ts-class: var(--dark-color-ts-class);
        --color-ts-function: var(--dark-color-ts-function);
        --color-ts-namespace: var(--dark-color-ts-namespace);
        --color-ts-private: var(--dark-color-ts-private);
        --color-ts-variable: var(--dark-color-ts-variable);
        --external-icon: var(--dark-external-icon);
        --color-scheme: var(--dark-color-scheme);
    }
}

html {
    color-scheme: var(--color-scheme);
}

body {
    margin: 0;
}

:root[data-theme="light"] {
    --color-background: var(--light-color-background);
    --color-background-secondary: var(--light-color-background-secondary);
    --color-background-warning: var(--light-color-background-warning);
    --color-warning-text: var(--light-color-warning-text);
    --color-icon-background: var(--light-color-icon-background);
    --color-accent: var(--light-color-accent);
    --color-text: var(--light-color-text);
    --color-text-aside: var(--light-color-text-aside);
    --color-link: var(--light-color-link);
    --color-ts: var(--light-color-ts);
    --color-ts-interface: var(--light-color-ts-interface);
    --color-ts-enum: var(--light-color-ts-enum);
    --color-ts-class: var(--light-color-ts-class);
    --color-ts-function: var(--light-color-ts-function);
    --color-ts-namespace: var(--light-color-ts-namespace);
    --color-ts-private: var(--light-color-ts-private);
    --color-ts-variable: var(--light-color-ts-variable);
    --external-icon: var(--light-external-icon);
    --color-scheme: var(--light-color-scheme);
}

:root[data-theme="dark"] {
    --color-background: var(--dark-color-background);
    --color-background-secondary: var(--dark-color-background-secondary);
    --color-background-warning: var(--dark-color-background-warning);
    --color-warning-text: var(--dark-color-warning-text);
    --color-icon-background: var(--dark-color-icon-background);
    --color-accent: var(--dark-color-accent);
    --color-text: var(--dark-color-text);
    --color-text-aside: var(--dark-color-text-aside);
    --color-link: var(--dark-color-link);
    --color-ts: var(--dark-color-ts);
    --color-ts-interface: var(--dark-color-ts-interface);
    --color-ts-enum: var(--dark-color-ts-enum);
    --color-ts-class: var(--dark-color-ts-class);
    --color-ts-function: var(--dark-color-ts-function);
    --color-ts-namespace: var(--dark-color-ts-namespace);
    --color-ts-private: var(--dark-color-ts-private);
    --color-ts-variable: var(--dark-color-ts-variable);
    --external-icon: var(--dark-external-icon);
    --color-scheme: var(--dark-color-scheme);
}

.always-visible,
.always-visible .tsd-signatures {
    display: inherit !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    line-height: 1.2;
}

h1 {
    font-size: 1.875rem;
    margin: 0.67rem 0;
}

h2 {
    font-size: 1.5rem;
    margin: 0.83rem 0;
}

h3 {
    font-size: 1.25rem;
    margin: 1rem 0;
}

h4 {
    font-size: 1.05rem;
    margin: 1.33rem 0;
}

h5 {
    font-size: 1rem;
    margin: 1.5rem 0;
}

h6 {
    font-size: 0.875rem;
    margin: 2.33rem 0;
}

.uppercase {
    text-transform: uppercase;
}

pre {
    white-space: pre;
    white-space: pre-wrap;
    word-wrap: break-word;
}

dl,
menu,
ol,
ul {
    margin: 1em 0;
}

dd {
    margin: 0 0 0 40px;
}

.container {
    max-width: 1600px;
    padding: 0 2rem;
}

@media (min-width: 640px) {
    .container {
        padding: 0 4rem;
    }
}
@media (min-width: 1200px) {
    .container {
        padding: 0 8rem;
    }
}
@media (min-width: 1600px) {
    .container {
        padding: 0 12rem;
    }
}

/* Footer */
.tsd-generator {
    border-top: 1px solid var(--color-accent);
    padding-top: 1rem;
    padding-bottom: 1rem;
    max-height: 3.5rem;
}

.tsd-generator > p {
    margin-top: 0;
    margin-bottom: 0;
    padding: 0 1rem;
}

.container-main {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin: 0 auto;
}

.col-4,
.col-8 {
    box-sizing: border-box;
    float: left;
    padding: 2rem 1rem;
}

.col-4 {
    flex: 0 0 25%;
}
.col-8 {
    flex: 1 0;
    flex-wrap: wrap;
    padding-left: 0;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
@keyframes fade-out {
    from {
        opacity: 1;
        visibility: visible;
    }
    to {
        opacity: 0;
    }
}
@keyframes fade-in-delayed {
    0% {
        opacity: 0;
    }
    33% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes fade-out-delayed {
    0% {
        opacity: 1;
        visibility: visible;
    }
    66% {
        opacity: 0;
    }
    100% {
        opacity: 0;
    }
}
@keyframes shift-to-left {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translate(-25%, 0);
    }
}
@keyframes unshift-to-left {
    from {
        transform: translate(-25%, 0);
    }
    to {
        transform: translate(0, 0);
    }
}
@keyframes pop-in-from-right {
    from {
        transform: translate(100%, 0);
    }
    to {
        transform: translate(0, 0);
    }
}
@keyframes pop-out-to-right {
    from {
        transform: translate(0, 0);
        visibility: visible;
    }
    to {
        transform: translate(100%, 0);
    }
}
body {
    background: var(--color-background);
    font-family: "Segoe UI", sans-serif;
    font-size: 16px;
    color: var(--color-text);
}

a {
    color: var(--color-link);
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
a.external[target="_blank"] {
    background-image: var(--external-icon);
    background-position: top 3px right;
    background-repeat: no-repeat;
    padding-right: 13px;
}

code,
pre {
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    padding: 0.2em;
    margin: 0;
    font-size: 0.875rem;
    border-radius: 0.8em;
}

pre {
    padding: 10px;
    border: 0.1em solid var(--color-accent);
}
pre code {
    padding: 0;
    font-size: 100%;
}

blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 4px solid gray;
}

.tsd-typography {
    line-height: 1.333em;
}
.tsd-typography ul {
    list-style: square;
    padding: 0 0 0 20px;
    margin: 0;
}
.tsd-typography h4,
.tsd-typography .tsd-index-panel h3,
.tsd-index-panel .tsd-typography h3,
.tsd-typography h5,
.tsd-typography h6 {
    font-size: 1em;
    margin: 0;
}
.tsd-typography h5,
.tsd-typography h6 {
    font-weight: normal;
}
.tsd-typography p,
.tsd-typography ul,
.tsd-typography ol {
    margin: 1em 0;
}

@media (max-width: 1024px) {
    html .col-content {
        float: none;
        max-width: 100%;
        width: 100%;
        padding-top: 3rem;
    }
    html .col-menu {
        position: fixed !important;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        z-index: 1024;
        top: 0 !important;
        bottom: 0 !important;
        left: auto !important;
        right: 0 !important;
        padding: 1.5rem 1.5rem 0 0;
        max-width: 25rem;
        visibility: hidden;
        background-color: var(--color-background);
        transform: translate(100%, 0);
    }
    html .col-menu > *:last-child {
        padding-bottom: 20px;
    }
    html .overlay {
        content: "";
        display: block;
        position: fixed;
        z-index: 1023;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.75);
        visibility: hidden;
    }

    .to-has-menu .overlay {
        animation: fade-in 0.4s;
    }

    .to-has-menu :is(header, footer, .col-content) {
        animation: shift-to-left 0.4s;
    }

    .to-has-menu .col-menu {
        animation: pop-in-from-right 0.4s;
    }

    .from-has-menu .overlay {
        animation: fade-out 0.4s;
    }

    .from-has-menu :is(header, footer, .col-content) {
        animation: unshift-to-left 0.4s;
    }

    .from-has-menu .col-menu {
        animation: pop-out-to-right 0.4s;
    }

    .has-menu body {
        overflow: hidden;
    }
    .has-menu .overlay {
        visibility: visible;
    }
    .has-menu :is(header, footer, .col-content) {
        transform: translate(-25%, 0);
    }
    .has-menu .col-menu {
        visibility: visible;
        transform: translate(0, 0);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-height: 100vh;
        padding: 1rem 2rem;
    }
    .has-menu .tsd-navigation {
        max-height: 100%;
    }
}

.tsd-breadcrumb {
    margin: 0;
    padding: 0;
    color: var(--color-text-aside);
}
.tsd-breadcrumb a {
    color: var(--color-text-aside);
    text-decoration: none;
}
.tsd-breadcrumb a:hover {
    text-decoration: underline;
}
.tsd-breadcrumb li {
    display: inline;
}
.tsd-breadcrumb li:after {
    content: " / ";
}

.tsd-comment-tags {
    display: flex;
    flex-direction: column;
}
dl.tsd-comment-tag-group {
    display: flex;
    align-items: center;
    overflow: hidden;
    margin: 0.5em 0;
}
dl.tsd-comment-tag-group dt {
    display: flex;
    margin-right: 0.5em;
    font-size: 0.875em;
    font-weight: normal;
}
dl.tsd-comment-tag-group dd {
    margin: 0;
}
code.tsd-tag {
    padding: 0.25em 0.4em;
    border: 0.1em solid var(--color-accent);
    margin-right: 0.25em;
    font-size: 70%;
}
h1 code.tsd-tag:first-of-type {
    margin-left: 0.25em;
}

dl.tsd-comment-tag-group dd:before,
dl.tsd-comment-tag-group dd:after {
    content: " ";
}
dl.tsd-comment-tag-group dd pre,
dl.tsd-comment-tag-group dd:after {
    clear: both;
}
dl.tsd-comment-tag-group p {
    margin: 0;
}

.tsd-panel.tsd-comment .lead {
    font-size: 1.1em;
    line-height: 1.333em;
    margin-bottom: 2em;
}
.tsd-panel.tsd-comment .lead:last-child {
    margin-bottom: 0;
}

.tsd-filter-visibility h4 {
    font-size: 1rem;
    padding-top: 0.75rem;
    padding-bottom: 0.5rem;
    margin: 0;
}
.tsd-filter-item:not(:last-child) {
    margin-bottom: 0.5rem;
}
.tsd-filter-input {
    display: flex;
    width: fit-content;
    width: -moz-fit-content;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    cursor: pointer;
}
.tsd-filter-input input[type="checkbox"] {
    cursor: pointer;
    position: absolute;
    width: 1.5em;
    height: 1.5em;
    opacity: 0;
}
.tsd-filter-input input[type="checkbox"]:disabled {
    pointer-events: none;
}
.tsd-filter-input svg {
    cursor: pointer;
    width: 1.5em;
    height: 1.5em;
    margin-right: 0.5em;
    border-radius: 0.33em;
    /* Leaving this at full opacity breaks event listeners on Firefox.
    Don't remove unless you know what you're doing. */
    opacity: 0.99;
}
.tsd-filter-input input[type="checkbox"]:focus + svg {
    transform: scale(0.95);
}
.tsd-filter-input input[type="checkbox"]:focus:not(:focus-visible) + svg {
    transform: scale(1);
}
.tsd-checkbox-background {
    fill: var(--color-accent);
}
input[type="checkbox"]:checked ~ svg .tsd-checkbox-checkmark {
    stroke: var(--color-text);
}
.tsd-filter-input input:disabled ~ svg > .tsd-checkbox-background {
    fill: var(--color-background);
    stroke: var(--color-accent);
    stroke-width: 0.25rem;
}
.tsd-filter-input input:disabled ~ svg > .tsd-checkbox-checkmark {
    stroke: var(--color-accent);
}

.tsd-theme-toggle {
    padding-top: 0.75rem;
}
.tsd-theme-toggle > h4 {
    display: inline;
    vertical-align: middle;
    margin-right: 0.75rem;
}

.tsd-hierarchy {
    list-style: square;
    margin: 0;
}
.tsd-hierarchy .target {
    font-weight: bold;
}

.tsd-panel-group.tsd-index-group {
    margin-bottom: 0;
}
.tsd-index-panel .tsd-index-list {
    list-style: none;
    line-height: 1.333em;
    margin: 0;
    padding: 0.25rem 0 0 0;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1rem;
    grid-template-rows: auto;
}
@media (max-width: 1024px) {
    .tsd-index-panel .tsd-index-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 768px) {
    .tsd-index-panel .tsd-index-list {
        grid-template-columns: repeat(1, 1fr);
    }
}
.tsd-index-panel .tsd-index-list li {
    -webkit-page-break-inside: avoid;
    -moz-page-break-inside: avoid;
    -ms-page-break-inside: avoid;
    -o-page-break-inside: avoid;
    page-break-inside: avoid;
}
.tsd-index-panel a,
.tsd-index-panel a.tsd-parent-kind-module {
    color: var(--color-ts);
}
.tsd-index-panel a.tsd-parent-kind-interface {
    color: var(--color-ts-interface);
}
.tsd-index-panel a.tsd-parent-kind-enum {
    color: var(--color-ts-enum);
}
.tsd-index-panel a.tsd-parent-kind-class {
    color: var(--color-ts-class);
}
.tsd-index-panel a.tsd-kind-module {
    color: var(--color-ts-namespace);
}
.tsd-index-panel a.tsd-kind-interface {
    color: var(--color-ts-interface);
}
.tsd-index-panel a.tsd-kind-enum {
    color: var(--color-ts-enum);
}
.tsd-index-panel a.tsd-kind-class {
    color: var(--color-ts-class);
}
.tsd-index-panel a.tsd-kind-function {
    color: var(--color-ts-function);
}
.tsd-index-panel a.tsd-kind-namespace {
    color: var(--color-ts-namespace);
}
.tsd-index-panel a.tsd-kind-variable {
    color: var(--color-ts-variable);
}
.tsd-index-panel a.tsd-is-private {
    color: var(--color-ts-private);
}

.tsd-flag {
    display: inline-block;
    padding: 0.25em 0.4em;
    border-radius: 4px;
    color: var(--color-comment-tag-text);
    background-color: var(--color-comment-tag);
    text-indent: 0;
    font-size: 75%;
    line-height: 1;
    font-weight: normal;
}

.tsd-anchor {
    position: absolute;
    top: -100px;
}

.tsd-member {
    position: relative;
}
.tsd-member .tsd-anchor + h3 {
    display: flex;
    align-items: center;
    margin-top: 0;
    margin-bottom: 0;
    border-bottom: none;
}
.tsd-member [data-tsd-kind] {
    color: var(--color-ts);
}
.tsd-member [data-tsd-kind="Interface"] {
    color: var(--color-ts-interface);
}
.tsd-member [data-tsd-kind="Enum"] {
    color: var(--color-ts-enum);
}
.tsd-member [data-tsd-kind="Class"] {
    color: var(--color-ts-class);
}
.tsd-member [data-tsd-kind="Private"] {
    color: var(--color-ts-private);
}

.tsd-navigation a {
    display: block;
    margin: 0.4rem 0;
    border-left: 2px solid transparent;
    color: var(--color-text);
    text-decoration: none;
    transition: border-left-color 0.1s;
}
.tsd-navigation a:hover {
    text-decoration: underline;
}
.tsd-navigation ul {
    margin: 0;
    padding: 0;
    list-style: none;
}
.tsd-navigation li {
    padding: 0;
}

.tsd-navigation.primary .tsd-accordion-details > ul {
    margin-top: 0.75rem;
}
.tsd-navigation.primary a {
    padding: 0.75rem 0.5rem;
    margin: 0;
}
.tsd-navigation.primary ul li a {
    margin-left: 0.5rem;
}
.tsd-navigation.primary ul li li a {
    margin-left: 1.5rem;
}
.tsd-navigation.primary ul li li li a {
    margin-left: 2.5rem;
}
.tsd-navigation.primary ul li li li li a {
    margin-left: 3.5rem;
}
.tsd-navigation.primary ul li li li li li a {
    margin-left: 4.5rem;
}
.tsd-navigation.primary ul li li li li li li a {
    margin-left: 5.5rem;
}
.tsd-navigation.primary li.current > a {
    border-left: 0.15rem var(--color-text) solid;
}
.tsd-navigation.primary li.selected > a {
    font-weight: bold;
    border-left: 0.2rem var(--color-text) solid;
}
.tsd-navigation.primary ul li a:hover {
    border-left: 0.2rem var(--color-text-aside) solid;
}
.tsd-navigation.primary li.globals + li > span,
.tsd-navigation.primary li.globals + li > a {
    padding-top: 20px;
}

.tsd-navigation.secondary.tsd-navigation--toolbar-hide {
    max-height: calc(100vh - 1rem);
    top: 0.5rem;
}
.tsd-navigation.secondary > ul {
    display: inline;
    padding-right: 0.5rem;
    transition: opacity 0.2s;
}
.tsd-navigation.secondary ul li a {
    padding-left: 0;
}
.tsd-navigation.secondary ul li li a {
    padding-left: 1.1rem;
}
.tsd-navigation.secondary ul li li li a {
    padding-left: 2.2rem;
}
.tsd-navigation.secondary ul li li li li a {
    padding-left: 3.3rem;
}
.tsd-navigation.secondary ul li li li li li a {
    padding-left: 4.4rem;
}
.tsd-navigation.secondary ul li li li li li li a {
    padding-left: 5.5rem;
}

#tsd-sidebar-links a {
    margin-top: 0;
    margin-bottom: 0.5rem;
    line-height: 1.25rem;
}
#tsd-sidebar-links a:last-of-type {
    margin-bottom: 0;
}

a.tsd-index-link {
    margin: 0.25rem 0;
    font-size: 1rem;
    line-height: 1.25rem;
    display: inline-flex;
    align-items: center;
}
.tsd-accordion-summary > h1,
.tsd-accordion-summary > h2,
.tsd-accordion-summary > h3,
.tsd-accordion-summary > h4,
.tsd-accordion-summary > h5 {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    margin-bottom: 0;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
.tsd-accordion-summary {
    display: block;
    cursor: pointer;
}
.tsd-accordion-summary > * {
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
}
.tsd-accordion-summary::-webkit-details-marker {
    display: none;
}
.tsd-index-accordion .tsd-accordion-summary svg {
    margin-right: 0.25rem;
}
.tsd-index-content > :not(:first-child) {
    margin-top: 0.75rem;
}
.tsd-index-heading {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.tsd-kind-icon {
    margin-right: 0.5rem;
    width: 1.25rem;
    height: 1.25rem;
    min-width: 1.25rem;
    min-height: 1.25rem;
}
.tsd-kind-icon path {
    transform-origin: center;
    transform: scale(1.1);
}
.tsd-signature > .tsd-kind-icon {
    margin-right: 0.8rem;
}

@media (min-width: 1025px) {
    .col-content {
        margin: 2rem auto;
    }

    .menu-sticky-wrap {
        position: sticky;
        height: calc(100vh - 2rem);
        top: 4rem;
        right: 0;
        padding: 0 1.5rem;
        padding-top: 1rem;
        margin-top: 3rem;
        transition: 0.3s ease-in-out;
        transition-property: top, padding-top, padding, height;
        overflow-y: auto;
    }
    .col-menu {
        border-left: 1px solid var(--color-accent);
    }
    .col-menu--hide {
        top: 1rem;
    }
    .col-menu .tsd-navigation:not(:last-child) {
        padding-bottom: 1.75rem;
    }
}

.tsd-panel {
    margin-bottom: 2.5rem;
}
.tsd-panel.tsd-member {
    margin-bottom: 4rem;
}
.tsd-panel:empty {
    display: none;
}
.tsd-panel > h1,
.tsd-panel > h2,
.tsd-panel > h3 {
    margin: 1.5rem -1.5rem 0.75rem -1.5rem;
    padding: 0 1.5rem 0.75rem 1.5rem;
}
.tsd-panel > h1.tsd-before-signature,
.tsd-panel > h2.tsd-before-signature,
.tsd-panel > h3.tsd-before-signature {
    margin-bottom: 0;
    border-bottom: none;
}

.tsd-panel-group {
    margin: 4rem 0;
}
.tsd-panel-group.tsd-index-group {
    margin: 2rem 0;
}
.tsd-panel-group.tsd-index-group details {
    margin: 2rem 0;
}

#tsd-search {
    transition: background-color 0.2s;
}
#tsd-search .title {
    position: relative;
    z-index: 2;
}
#tsd-search .field {
    position: absolute;
    left: 0;
    top: 0;
    right: 2.5rem;
    height: 100%;
}
#tsd-search .field input {
    box-sizing: border-box;
    position: relative;
    top: -50px;
    z-index: 1;
    width: 100%;
    padding: 0 10px;
    opacity: 0;
    outline: 0;
    border: 0;
    background: transparent;
    color: var(--color-text);
}
#tsd-search .field label {
    position: absolute;
    overflow: hidden;
    right: -40px;
}
#tsd-search .field input,
#tsd-search .title,
#tsd-toolbar-links a {
    transition: opacity 0.2s;
}
#tsd-search .results {
    position: absolute;
    visibility: hidden;
    top: 40px;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
}
#tsd-search .results li {
    padding: 0 10px;
    background-color: var(--color-background);
}
#tsd-search .results li:nth-child(even) {
    background-color: var(--color-background-secondary);
}
#tsd-search .results li.state {
    display: none;
}
#tsd-search .results li.current,
#tsd-search .results li:hover {
    background-color: var(--color-accent);
}
#tsd-search .results a {
    display: block;
}
#tsd-search .results a:before {
    top: 10px;
}
#tsd-search .results span.parent {
    color: var(--color-text-aside);
    font-weight: normal;
}
#tsd-search.has-focus {
    background-color: var(--color-accent);
}
#tsd-search.has-focus .field input {
    top: 0;
    opacity: 1;
}
#tsd-search.has-focus .title,
#tsd-search.has-focus #tsd-toolbar-links a {
    z-index: 0;
    opacity: 0;
}
#tsd-search.has-focus .results {
    visibility: visible;
}
#tsd-search.loading .results li.state.loading {
    display: block;
}
#tsd-search.failure .results li.state.failure {
    display: block;
}

#tsd-toolbar-links {
    position: absolute;
    top: 0;
    right: 2rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
#tsd-toolbar-links a {
    margin-left: 1.5rem;
}
#tsd-toolbar-links a:hover {
    text-decoration: underline;
}

.tsd-signature {
    margin: 0 0 1rem 0;
    padding: 1rem 0.5rem;
    border: 1px solid var(--color-accent);
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    font-size: 14px;
    overflow-x: auto;
}

.tsd-signature-symbol {
    color: var(--color-text-aside);
    font-weight: normal;
}

.tsd-signature-type {
    font-style: italic;
    font-weight: normal;
}

.tsd-signatures {
    padding: 0;
    margin: 0 0 1em 0;
    list-style-type: none;
}
.tsd-signatures .tsd-signature {
    margin: 0;
    border-color: var(--color-accent);
    border-width: 1px 0;
    transition: background-color 0.1s;
}
.tsd-description .tsd-signatures .tsd-signature {
    border-width: 1px;
}

ul.tsd-parameter-list,
ul.tsd-type-parameter-list {
    list-style: square;
    margin: 0;
    padding-left: 20px;
}
ul.tsd-parameter-list > li.tsd-parameter-signature,
ul.tsd-type-parameter-list > li.tsd-parameter-signature {
    list-style: none;
    margin-left: -20px;
}
ul.tsd-parameter-list h5,
ul.tsd-type-parameter-list h5 {
    font-size: 16px;
    margin: 1em 0 0.5em 0;
}
.tsd-sources {
    margin-top: 1rem;
    font-size: 0.875em;
}
.tsd-sources a {
    color: var(--color-text-aside);
    text-decoration: underline;
}
.tsd-sources ul {
    list-style: none;
    padding: 0;
}

.tsd-page-toolbar {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    color: var(--color-text);
    background: var(--color-background-secondary);
    border-bottom: 1px var(--color-accent) solid;
    transition: transform 0.3s ease-in-out;
}
.tsd-page-toolbar a {
    color: var(--color-text);
    text-decoration: none;
}
.tsd-page-toolbar a.title {
    font-weight: bold;
}
.tsd-page-toolbar a.title:hover {
    text-decoration: underline;
}
.tsd-page-toolbar .tsd-toolbar-contents {
    display: flex;
    justify-content: space-between;
    height: 2.5rem;
    margin: 0 auto;
}
.tsd-page-toolbar .table-cell {
    position: relative;
    white-space: nowrap;
    line-height: 40px;
}
.tsd-page-toolbar .table-cell:first-child {
    width: 100%;
}
.tsd-page-toolbar .tsd-toolbar-icon {
    box-sizing: border-box;
    line-height: 0;
    padding: 12px 0;
}

.tsd-page-toolbar--hide {
    transform: translateY(-100%);
}

.tsd-widget {
    display: inline-block;
    overflow: hidden;
    opacity: 0.8;
    height: 40px;
    transition: opacity 0.1s, background-color 0.2s;
    vertical-align: bottom;
    cursor: pointer;
}
.tsd-widget:hover {
    opacity: 0.9;
}
.tsd-widget.active {
    opacity: 1;
    background-color: var(--color-accent);
}
.tsd-widget.no-caption {
    width: 40px;
}
.tsd-widget.no-caption:before {
    margin: 0;
}

.tsd-widget.options,
.tsd-widget.menu {
    display: none;
}
@media (max-width: 1024px) {
    .tsd-widget.options,
    .tsd-widget.menu {
        display: inline-block;
    }
}
input[type="checkbox"] + .tsd-widget:before {
    background-position: -120px 0;
}
input[type="checkbox"]:checked + .tsd-widget:before {
    background-position: -160px 0;
}

img {
    max-width: 100%;
}

.tsd-anchor-icon {
    display: inline-flex;
    align-items: center;
    margin-left: 0.5rem;
    vertical-align: middle;
    color: var(--color-text);
}

.tsd-anchor-icon svg {
    width: 1em;
    height: 1em;
    visibility: hidden;
}

.tsd-anchor-link:hover > .tsd-anchor-icon svg {
    visibility: visible;
}

.deprecated {
    text-decoration: line-through;
}

.warning {
    padding: 1rem;
    color: var(--color-warning-text);
    background: var(--color-background-warning);
}

* {
    scrollbar-width: thin;
    scrollbar-color: var(--color-accent) var(--color-icon-background);
}

*::-webkit-scrollbar {
    width: 0.75rem;
}

*::-webkit-scrollbar-track {
    background: var(--color-icon-background);
}

*::-webkit-scrollbar-thumb {
    background-color: var(--color-accent);
    border-radius: 999rem;
    border: 0.25rem solid var(--color-icon-background);
}
`;
//Get Folders name
function getFolders() {
  const folders = readdirSync(rootPath);
  return folders;
}
function getFoldersAndFile(path) {
  const folders = readdirSync(path);
  return folders;
}
const createIndexHtml = () => {
  let getFolder = getFolders();
  let folderAndFiles = getFoldersAndFile(__dirname + '/wcp/test/mapping');
  let content = `
        <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
        <div class="container container-main">
        <div class="col-8 col-content">
        <div class="tsd-page-title">
        <h2>walmart-MobileApps</h2></div>
        <section class="tsd-panel-group tsd-index-group">
        <section class="tsd-panel tsd-index-panel">
        <h3 class="tsd-index-heading uppercase">Index</h3>
        <section class="tsd-index-section">
        <h3 class="tsd-index-heading">Classes</h3>
        <div class="tsd-index-list">`;
  getFolder.forEach((folderName) => {
    content += `<a href=${path.join(
      __dirname,
      `/docs/pages/${folderName}.html`
    )} class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>${folderName}</span></a>
    `;
  });
  content += `</div></section></section></section>`;
  content += `<section class="tsd-panel-group tsd-index-group">
  <section class="tsd-panel tsd-index-panel">
  <section class="tsd-index-section">
  <h3 class="tsd-index-heading">Mappings</h3>
  <div class="tsd-index-list">`;
  folderAndFiles.forEach((folderName) => {
    let reference = folderName.includes('.yaml')
      ? path.join(__dirname, `/docs/mappingDocs/sharedMappings/index.html`)
      : path.join(__dirname, `/docs/mappingDocs/${folderName}/index.html`);
    if (folderName.includes('.yaml')) {
      content += `<a href="${reference}" class="tsd-index-link tsd-kind-property tsd-parent-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="#FF984D" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12" id="icon-1024-path"></rect><path d="M9.354 16V7.24H12.174C12.99 7.24 13.638 7.476 14.118 7.948C14.606 8.412 14.85 9.036 14.85 9.82C14.85 10.604 14.606 11.232 14.118 11.704C13.638 12.168 12.99 12.4 12.174 12.4H10.434V16H9.354ZM10.434 11.428H12.174C12.646 11.428 13.022 11.284 13.302 10.996C13.59 10.7 13.734 10.308 13.734 9.82C13.734 9.324 13.59 8.932 13.302 8.644C13.022 8.356 12.646 8.212 12.174 8.212H10.434V11.428Z" fill="var(--color-text)" id="icon-1024-text"></path></svg><span>${
        folderName.split('.')[0]
      }</span></a>`;
    } else {
      content += `<a href=${reference} class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>${folderName}</span></a>
      `;
    }
  });

  content += `</div></section></section></section></div></div></body></html>`;
  return content;
};
async function createMarket() {
  try {
    let getFolder = getFoldersAndFile(__dirname + '/wcp/test/mapping');
    getFolder.forEach(async (folderName) => {
      if (!folderName.includes('.yaml')) {
        let subFolders = getFoldersAndFile(
          __dirname + '/wcp/test/mapping' + `/${folderName}`
        );
        createDirectory(
          path.join(__dirname, `/docs/mappingDocs/${folderName}`)
        );
        let localeContent = '';
        let pageContent = `
        <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
        <div class="container container-main">
        <div class="col-8 col-content">
        <div class="tsd-page-title">
        <ul class="tsd-breadcrumb">
        <li><a href="../../index.html">walmart-MobileApps</a></li>
        <section class="tsd-panel-group tsd-index-group">
        <section class="tsd-panel tsd-index-panel">
        <section class="tsd-index-section">
        <h3 class="tsd-index-heading">${
          folderName.toLowerCase().includes('shared') ? 'Pages' : 'Markets'
        }</h3>
        <div class="tsd-index-list">`;
        if (subFolders.length > 0) {
          subFolders.forEach((subfolderName) => {
            let reference = subfolderName.includes('.yaml')
              ? path.join(
                  __dirname,
                  `/docs/mappingDocs/${folderName}/${
                    subfolderName.split('.')[0]
                  }.html`
                )
              : folderName.toLowerCase().includes('shared')
              ? path.join(
                  __dirname,
                  `/docs/mappingDocs/${folderName}/${subfolderName}/shared.html`
                )
              : path.join(
                  __dirname,
                  `/docs/mappingDocs/${folderName}/${subfolderName}/${subfolderName}.html`
                );
            if (subfolderName.includes('.yaml')) {
              localeContent += `<a href="${reference}" class="tsd-index-link tsd-kind-property tsd-parent-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="#FF984D" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12" id="icon-1024-path"></rect><path d="M9.354 16V7.24H12.174C12.99 7.24 13.638 7.476 14.118 7.948C14.606 8.412 14.85 9.036 14.85 9.82C14.85 10.604 14.606 11.232 14.118 11.704C13.638 12.168 12.99 12.4 12.174 12.4H10.434V16H9.354ZM10.434 11.428H12.174C12.646 11.428 13.022 11.284 13.302 10.996C13.59 10.7 13.734 10.308 13.734 9.82C13.734 9.324 13.59 8.932 13.302 8.644C13.022 8.356 12.646 8.212 12.174 8.212H10.434V11.428Z" fill="var(--color-text)" id="icon-1024-text"></path></svg><span>${subfolderName}</span></a>`;
            } else {
              pageContent += `<a href=${reference} class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>${subfolderName}</span></a>
              `;
            }
          });
          pageContent += `</div></section></section></section>`;
          pageContent += `
          <section class="tsd-panel-group tsd-index-group">
          <section class="tsd-panel tsd-index-panel">
          <section class="tsd-index-section">
          <h3 class="tsd-index-heading">${
            localeContent !== '' ? 'Locale' : ''
          }</h3>
          <div class="tsd-index-list">
          ${localeContent}
          `;
        } else {
          pageContent += '<h1>The folder is empty</h1>';
        }

        pageContent += `</div></section></section></section></div></div></body></html>`;
        writeContentToFile(
          `docs/mappingDocs/${folderName}/index.html`,
          pageContent
        );
      } else {
        createDirectory(__dirname + '/docs/mappingDocs/sharedMappings');
        let content = `
        <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
        <div class="container container-main">
        <div class="col-8 col-content">
        <div class="tsd-page-title">
        <ul class="tsd-breadcrumb">
        <li><a href="../../../index.html">walmart-MobileApps</a></li>
        </ul>
        <section class="tsd-panel-group tsd-index-group">
        <section class="tsd-panel tsd-index-panel">
        <section class="tsd-index-section">
        <h3 class="tsd-index-heading">Platform</h3>
        <div class="tsd-index-list">`;
        content += `
        <a href="${__dirname +
          '/docs/mappingDocs/sharedMappings/ios/mapping.html'}" class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>ios</span></a>
        <a href="${__dirname +
          '/docs/mappingDocs/sharedMappings/android/mapping.html'}" class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>android</span></a>
        `;
        content += `</div></section></section></section></div></div></body></html>`;

        writeContentToFile(
          __dirname + '/docs/mappingDocs/sharedMappings/index.html',
          content
        );
        createDirectory(__dirname + '/docs/mappingDocs/sharedMappings/ios');
        createDirectory(__dirname + '/docs/mappingDocs/sharedMappings/android');
        let sharedOutput = getIosAndroidElements(
          mappingRoot + '/sharedMappings.yaml'
        );

        for (let pageMethod in sharedOutput) {
          let functionContent = `
            <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../../../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
            <div class="container container-main">
            <div class="col-8 col-content">
            <div class="tsd-page-title">
            <h2>walmart-MobileApps</h2></div>
            <div class="tsd-page-title">
            <ul class="tsd-breadcrumb">
            <li><a href="../../../index.html">walmart-MobileApps</a></li>
            <li><a href="../index.html">${pageMethod}</a></li>
            </ul>
            <section class="tsd-panel-group tsd-index-group">
            <section class="tsd-panel tsd-index-panel">
            <h3 class="tsd-index-heading uppercase">Index</h3>
            <section class="tsd-index-section">
            <h3 class="tsd-index-heading">Classes</h3>
            <div class="tsd-index-list">\n`;
          for (let each in sharedOutput[pageMethod]) {
            functionContent += `\n<a href="${__dirname +
              `/docs/mappingDocs/sharedMappings/${pageMethod}/${each}.html`}" class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>${each}</span></a>`;
            let sectionContent = '';
            let methodContent = `
            <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../../../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
            <div class="container container-main">
            <div class="col-8 col-content">
            <ul class="tsd-breadcrumb">
            <li><a href="../../../index.html">walmart-MobileApps</a></li>
            <li><a href="../index.html">${pageMethod}</a></li>
            <li><a href="mapping.html">methods</a></li>
            </ul>
            <section class="tsd-panel-group tsd-index-group">
            <section class="tsd-panel tsd-index-panel">
            <h3 class="tsd-index-heading uppercase">Index</h3>
            <section class="tsd-index-section">
            <h3 class="tsd-index-heading">Mappings</h3>
            <div class="tsd-index-list">\n`;
            sharedOutput[pageMethod][each].forEach((method) => {
              methodContent += `<a href="#${method.name}" class="tsd-index-link tsd-kind-method tsd-parent-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="#FF4DB8" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12" id="icon-2048-path"></rect><path d="M9.162 16V7.24H10.578L11.514 10.072C11.602 10.328 11.674 10.584 11.73 10.84C11.794 11.088 11.842 11.28 11.874 11.416C11.906 11.28 11.954 11.088 12.018 10.84C12.082 10.584 12.154 10.324 12.234 10.06L13.122 7.24H14.538V16H13.482V12.82C13.482 12.468 13.49 12.068 13.506 11.62C13.53 11.172 13.558 10.716 13.59 10.252C13.622 9.78 13.654 9.332 13.686 8.908C13.726 8.476 13.762 8.1 13.794 7.78L12.366 12.16H11.334L9.894 7.78C9.934 8.092 9.97 8.456 10.002 8.872C10.042 9.28 10.078 9.716 10.11 10.18C10.142 10.636 10.166 11.092 10.182 11.548C10.206 12.004 10.218 12.428 10.218 12.82V16H9.162Z" fill="var(--color-text)" id="icon-2048-text"></path></svg><span>${method.name}</span></a>\n`;
              sectionContent += `
                <section class="tsd-panel tsd-member tsd-kind-method tsd-parent-kind-class"><a id="${method.name}" class="tsd-anchor"></a>
                <h3 class="tsd-anchor-link"><span>${method.name}</span><a href="#${method.name}" aria-label="Permalink" class="tsd-anchor-icon"><svg class="icon icon-tabler icon-tabler-link" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-anchor-a"></use><use href="#icon-anchor-b"></use><use href="#icon-anchor-c"></use></svg></a></h3>
                <ul class="tsd-signatures tsd-kind-method tsd-parent-kind-class">
                <li class="tsd-description">
                <aside class="tsd-sources">
                <ul>
                <li>Identifier:${method.identifier}</li>
                <li>Defined in sharedMappings.yaml: ${method.lineNumber}</li></ul></aside></li></ul></section>
                `;
            });
            methodContent += `</div></section></section></section></div>
            </div>`;
            methodContent += ` <div class="container container-main">\n
          <section class="tsd-panel-group tsd-member-group">\n
          <section class="tsd-panel tsd-index-panel">\n
          <h2>Methods</h2>\n
          <section class="tsd-index-section">\n
          ${sectionContent}`;
            methodContent += `</section></section></section></div></body></html>`;
            writeContentToFile(
              __dirname +
                `/docs/mappingDocs/sharedMappings/${pageMethod}/${each}.html`,
              methodContent
            );
            methodContent = '';
            sectionContent = '';
          }

          functionContent += `</div></section></section></section></div></div></body></html>`;

          writeContentToFile(
            __dirname +
              `/docs/mappingDocs/sharedMappings/${pageMethod}/mapping.html`,
            functionContent
          );
          functionContent = '';
        }
      }
    });
  } catch (error) {
    console.log('Error while creating markets', error);
  }
}
function getIosAndroidElements(filePath) {
  try {
    const yamlContent = fs.readFileSync(filePath, 'utf8');
    const lines = yamlContent.split('\n');
    let final = {
      android: {},
      ios: {}
    };
    let iosStarted = false;
    for (let i = 0; i < lines.length; i++) {
      let set = {};
      if (lines[i].includes('ios:')) {
        iosStarted = true;
      }
      if (lines[i].includes('- name')) {
        let splitedString = lines[i].split(':')[1].split('.');
        if (!iosStarted) {
          if (!final['android'][splitedString[0]]) {
            final['android'][splitedString[0]] = [];
          }
          if (!final['android'][splitedString[0]].includes(splitedString[1])) {
            set['name'] = splitedString.slice(1).join('.');
            set['lineNumber'] = i + 1;
            set['identifier'] = lines[i + 1]
              .split(':')
              .slice(1)
              .join(':');
            final['android'][splitedString[0]].push(set);
          }
        } else {
          if (!final['ios'][splitedString[0]]) {
            final['ios'][splitedString[0]] = [];
          }
          if (!final['ios'][splitedString[0]].includes(splitedString[1])) {
            set['name'] = splitedString.slice(1).join('.');
            set['lineNumber'] = i + 1;
            set['identifier'] = lines[i + 1]
              .split(':')
              .slice(1)
              .join(':');
            final['ios'][splitedString[0]].push(set);
          }
        }
      }
    }
    return final;
  } catch (error) {
    console.log('Error in getIosAndroidElements', error);
  }
}
async function createMarketMappings() {
  try {
    let getFolder = getFoldersAndFile(mappingRoot);
    getFolder.forEach(async (folderName) => {
      if (!folderName.includes('.yaml')) {
        let subFolders = getFoldersAndFile(mappingRoot + `/${folderName}`);
        subFolders.forEach((subfolderName) => {
          if (!subfolderName.includes('.yaml')) {
            let pageConent = `
               <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../../../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
               <div class="container container-main">
               <div class="col-8 col-content">
               <div class="tsd-page-title">
               <ul class="tsd-breadcrumb">
               <li><a href="../../../index.html">walmart-MobileApps</a></li>
               <li><a href="../index.html">${subfolderName}</a></li>
               </ul></div>
               <section class="tsd-panel-group tsd-index-group">
               <section class="tsd-panel tsd-index-panel">
               <h3 class="tsd-index-heading uppercase">Index</h3>
               <section class="tsd-index-section">
               <h3 class="tsd-index-heading">Methods</h3>
               <div class="tsd-index-list">\n`;

            let childFiles = getFoldersAndFile(
              mappingRoot + `/${folderName}/${subfolderName}`
            );
            createDirectory(
              __dirname + `/docs/mappingDocs/${folderName}/${subfolderName}`
            );
            childFiles.forEach((file) => {
              pageConent += `<a href=${path.join(
                __dirname,
                `/docs/mappingDocs/${folderName}/${subfolderName}/${
                  file.split('.')[0]
                }.html`
              )} class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>${
                file.includes('.yaml') ? file.split('.')[0] : file
              }</span></a>`;
            });
            if (!childFiles.length) {
              pageConent += '<h1>No Methods found</h1>';
            }
            pageConent += `</div></section></section></section></div></div></body></html>`;
            writeContentToFile(
              __dirname +
                `/docs/mappingDocs/${folderName}/${subfolderName}/${subfolderName}.html`,
              pageConent
            );
            let readPath = mappingRoot + `/${folderName}/${subfolderName}/`;
            let sourceToWritePath =
              __dirname + `/docs/mappingDocs/${folderName}/${subfolderName}`;
            let cssFilePath = '../../';
            createYamlPageAndMethod(readPath, sourceToWritePath, cssFilePath);
          } else {
            let readPath = mappingRoot + `/${folderName}/${subfolderName}`;
            let historyTag1 = `<ul class="tsd-breadcrumb">
               <li><a href="../../index.html">walmart-MobileApps</a></li>
               <li><a href="index.html">Makrkets</a></li>
               </li></ul>`;
            let historyTag2 = `
               <ul class="tsd-breadcrumb">
               <li><a href="../../../index.html">walmart-MobileApps</a></li>
               <li><a href="../index.html">Makrkets</a></li>
               <li><a href="../${subfolderName.split('.')[0]}.html">${
              subfolderName.split('.')[0]
            }</a>
               </li></ul>`;
            let sourceToWritePath =
              __dirname + `/docs/mappingDocs/${folderName}/${subfolderName}`;
            let cssFilePath = '../../';
            createYamlPageAndMethod(
              readPath,
              sourceToWritePath,
              cssFilePath,
              historyTag1,
              historyTag2
            );
          }
        });
      }
    });
  } catch (error) {
    console.log('error in createMarketMappings:==> ', error);
  }
}
async function createYamlPageAndMethod(
  readPath,
  writePath,
  cssPath,
  history,
  subhistory
) {
  try {
    let pages = await findMethods(readPath);
    let fileName = readPath.split('/').pop();
    let pageConent = `
      <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="${cssPath}style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
      <div class="container container-main">
      <div class="col-8 col-content">
      <div class="tsd-page-title">
      ${history}
      <section class="tsd-panel-group tsd-index-group">
      <section class="tsd-panel tsd-index-panel">
      <h3 class="tsd-index-heading uppercase">Index</h3>
      <section class="tsd-index-section">
      <h3 class="tsd-index-heading">Element Definations</h3>
      <div class="tsd-index-list">`;
    if (Object.keys(pages).length > 0) {
      Object.keys(pages).forEach((page) => {
        if (pages[page].length) {
          pageConent += `<a href="${path.join(
            writePath.split('.')[0],
            `/${page}.html`
          )}" class="tsd-index-link tsd-kind-property tsd-parent-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="#FF984D" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12" id="icon-1024-path"></rect><path d="M9.354 16V7.24H12.174C12.99 7.24 13.638 7.476 14.118 7.948C14.606 8.412 14.85 9.036 14.85 9.82C14.85 10.604 14.606 11.232 14.118 11.704C13.638 12.168 12.99 12.4 12.174 12.4H10.434V16H9.354ZM10.434 11.428H12.174C12.646 11.428 13.022 11.284 13.302 10.996C13.59 10.7 13.734 10.308 13.734 9.82C13.734 9.324 13.59 8.932 13.302 8.644C13.022 8.356 12.646 8.212 12.174 8.212H10.434V11.428Z" fill="var(--color-text)" id="icon-1024-text"></path></svg><span>${page}</span></a>`;
        }
      });
    } else {
      pageConent += `<h1>No methods exists</h1>`;
    }
    pageConent += `</div></section></section></section></div></div></body></html>`;
    writeContentToFile(writePath.split('.')[0] + '.html', pageConent);
    generateMethods(writePath, pages, cssPath, subhistory, fileName);
  } catch (error) {
    console.log('Error while creating createYamlPageAndMethod', error);
  }
}

function generateMethods(writePath, pages, cssPath, history, fileName) {
  try {
    createDirectory(writePath.split('.')[0]);
    Object.keys(pages).forEach((page) => {
      if (pages[page].length > 0) {
        let sectionContent = ``;
        let methodContent = `
          <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="${cssPath}../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
          <div class="container container-main">
          <div class="col-8 col-content">
          ${history}
          <section class="tsd-panel-group tsd-index-group">
          <section class="tsd-panel tsd-index-panel">
          <h3 class="tsd-index-heading uppercase">Index</h3>
          <section class="tsd-index-section">
          <h3 class="tsd-index-heading">Mappings</h3>
          <div class="tsd-index-list">\n`;
        pages[page].forEach((method) => {
          methodContent += `<a href="#${method.name}" class="tsd-index-link tsd-kind-method tsd-parent-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="#FF4DB8" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12" id="icon-2048-path"></rect><path d="M9.162 16V7.24H10.578L11.514 10.072C11.602 10.328 11.674 10.584 11.73 10.84C11.794 11.088 11.842 11.28 11.874 11.416C11.906 11.28 11.954 11.088 12.018 10.84C12.082 10.584 12.154 10.324 12.234 10.06L13.122 7.24H14.538V16H13.482V12.82C13.482 12.468 13.49 12.068 13.506 11.62C13.53 11.172 13.558 10.716 13.59 10.252C13.622 9.78 13.654 9.332 13.686 8.908C13.726 8.476 13.762 8.1 13.794 7.78L12.366 12.16H11.334L9.894 7.78C9.934 8.092 9.97 8.456 10.002 8.872C10.042 9.28 10.078 9.716 10.11 10.18C10.142 10.636 10.166 11.092 10.182 11.548C10.206 12.004 10.218 12.428 10.218 12.82V16H9.162Z" fill="var(--color-text)" id="icon-2048-text"></path></svg><span>${method.name}</span></a>\n`;
          sectionContent += `
          <section class="tsd-panel tsd-member tsd-kind-method tsd-parent-kind-class"><a id="${method.name}" class="tsd-anchor"></a>
          <h3 class="tsd-anchor-link"><span>${method.name}</span><a href="#${method.name}" aria-label="Permalink" class="tsd-anchor-icon"><svg class="icon icon-tabler icon-tabler-link" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-anchor-a"></use><use href="#icon-anchor-b"></use><use href="#icon-anchor-c"></use></svg></a></h3>
          <ul class="tsd-signatures tsd-kind-method tsd-parent-kind-class">
          <li class="tsd-description">
          <aside class="tsd-sources">
          <ul>
          <li>Identifier:${method.identifier}</li>
          <li>Defined in ${fileName}: ${method.lineNumber}</li></ul></aside></li></ul></section>
          `;
        });
        methodContent += `</div></section></section></section></div>
          </div>`;
        methodContent += ` <div class="container container-main">\n
        <section class="tsd-panel-group tsd-member-group">\n
        <section class="tsd-panel tsd-index-panel">\n
        <h2>Methods</h2>\n
        <section class="tsd-index-section">\n
        ${sectionContent}`;
        methodContent += `</section></section></section></div></body></html>`;
        writeContentToFile(
          writePath.split('.')[0] + `/${page}.html`,
          methodContent
        );
      }
    });
  } catch (error) {
    console.log('Error while fetch mehtodss==>', error);
  }
}
async function findMethods(filePath) {
  try {
    return new Promise((resolve) => {
      if (filePath.includes('.yaml')) {
        const yamlContent = fs.readFileSync(filePath, 'utf8');
        const lines = yamlContent.split('\n');
        let final = {};
        for (let i = 0; i < lines.length; i++) {
          let set = {};
          if (lines[i].includes('- name')) {
            let splitedString = lines[i].split(':')[1].split('.');
            if (!final[splitedString[0]]) final[splitedString[0]] = [];
            if (!final[splitedString[0]].includes(splitedString[1])) {
              set['name'] = splitedString.slice(1).join('.');
              set['lineNumber'] = i + 1;
              set['identifier'] = lines[i + 1]
                .split(':')
                .slice(1)
                .join(':');

              final[splitedString[0]].push(set);
            }
          }
        }
        resolve(final);
      }
    });
  } catch (error) {
    console.log('Error while findMethods', error);
  }
}
async function createMarketPages() {
  let getFolder = getFoldersAndFile(mappingRoot);
  getFolder.forEach(async (folderName) => {
    if (!folderName.includes('.yaml')) {
      let subFolders = getFoldersAndFile(mappingRoot + `/${folderName}`);
      subFolders.forEach((subfolderName) => {
        if (!subfolderName.includes('.yaml')) {
          let childFiles = getFoldersAndFile(
            mappingRoot + `/${folderName}/${subfolderName}`
          );
          childFiles.forEach((file) => {
            let readPath =
              mappingRoot + `/${folderName}/${subfolderName}/${file}`;
            let ul1 = `<div class="tsd-page-title">
              <ul class="tsd-breadcrumb">
              <li><a href="../../../index.html">walmart-MobileApps</a></li>
              <li><a href="../index.html">${subfolderName}</a></li>
              <li><a href="${subfolderName}.html">${
              file.split('.')[0]
            }</a></li></ul></div>`;
            let ul2 = `<div class="tsd-page-title">
              <ul class="tsd-breadcrumb">
              <li><a href="../../../../index.html">walmart-MobileApps</a></li>
              <li><a href="../../index.html">${subfolderName}</a></li>
              <li><a href="../${subfolderName}.html">${
              file.split('.')[0]
            }</a></li>
              <li><a href="../${file.split('.')[0]}.html">Methods</a></li>
              </ul></div>`;
            if (file.includes('shared')) {
              // createDirectory(__dirname + '/docs/mappingDocs/sharedMappings');
              let content = `
              <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../../../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
              <div class="container container-main">
              <div class="col-8 col-content">
              <div class="tsd-page-title">
              <ul class="tsd-breadcrumb">
              <li><a href="../../../index.html">walmart-MobileApps</a></li>
              <li><a href="../index.html">${subfolderName}</a></li>
              </ul>
              <section class="tsd-panel-group tsd-index-group">
              <section class="tsd-panel tsd-index-panel">
              <section class="tsd-index-section">
              <h3 class="tsd-index-heading">Platform</h3>
              <div class="tsd-index-list">`;
              let pageName = subfolderName.toLowerCase().includes('utils')
                ? 'mapping'
                : subfolderName.toLowerCase().includes('page')
                ? ` ${subfolderName.toLowerCase().split('page')[0]}`
                : ` ${subfolderName.toLowerCase()}`;
              content += `
              <a href="${__dirname +
                `/docs/mappingDocs/${folderName}/${subfolderName}/ios/${pageName}.html`}" class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>ios</span></a>
              <a href="${__dirname +
                `/docs/mappingDocs/${folderName}/${subfolderName}/android/${pageName}.html`}" class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>android</span></a>
              `;
              content += `</div></section></section></section></div></div></body></html>`;

              writeContentToFile(
                __dirname +
                  `/docs/mappingDocs/${folderName}/${subfolderName}/${
                    file.split('.')[0]
                  }.html`,
                content
              );
              createDirectory(
                __dirname +
                  `/docs/mappingDocs/sharedMapping/${subfolderName}/ios`
              );
              createDirectory(
                __dirname +
                  `/docs/mappingDocs/sharedMapping/${subfolderName}/android`
              );
              let sharedOutput = getIosAndroidElements(
                mappingRoot + `/${folderName}/${subfolderName}/${file}`
              );

              for (let pageMethod in sharedOutput) {
                let functionContent = `
                  <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../../../../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
                  <div class="container container-main">
                  <div class="col-8 col-content">
                  <div class="tsd-page-title">
                  <ul class="tsd-breadcrumb">
                  <li><a href="../../../../index.html">walmart-MobileApps</a></li>
                  <li><a href="../../index.html">${subfolderName}</a></li>
                  <li><a href="../shared.html">${pageMethod}</a></li>
                  </ul>
                  <section class="tsd-panel-group tsd-index-group">
                  <section class="tsd-panel tsd-index-panel">
                  <section class="tsd-index-section">
                  <h3 class="tsd-index-heading">Methods</h3>
                  <div class="tsd-index-list">\n`;
                if (Object.keys(sharedOutput[pageMethod]).length > 0) {
                  for (let each in sharedOutput[pageMethod]) {
                    functionContent += `\n<a href="${__dirname +
                      `/docs/mappingDocs/sharedMapping/${subfolderName}/${pageMethod}/${each.toLowerCase()}.html`}" class="tsd-index-link tsd-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="var(--color-ts-class)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6" id="icon-128-path"></rect><path d="M11.898 16.1201C11.098 16.1201 10.466 15.8961 10.002 15.4481C9.53803 15.0001 9.30603 14.3841 9.30603 13.6001V9.64012C9.30603 8.85612 9.53803 8.24012 10.002 7.79212C10.466 7.34412 11.098 7.12012 11.898 7.12012C12.682 7.12012 13.306 7.34812 13.77 7.80412C14.234 8.25212 14.466 8.86412 14.466 9.64012H13.386C13.386 9.14412 13.254 8.76412 12.99 8.50012C12.734 8.22812 12.37 8.09212 11.898 8.09212C11.426 8.09212 11.054 8.22412 10.782 8.48812C10.518 8.75212 10.386 9.13212 10.386 9.62812V13.6001C10.386 14.0961 10.518 14.4801 10.782 14.7521C11.054 15.0161 11.426 15.1481 11.898 15.1481C12.37 15.1481 12.734 15.0161 12.99 14.7521C13.254 14.4801 13.386 14.0961 13.386 13.6001H14.466C14.466 14.3761 14.234 14.9921 13.77 15.4481C13.306 15.8961 12.682 16.1201 11.898 16.1201Z" fill="var(--color-text)" id="icon-128-text"></path></svg><span>${each}</span></a>`;
                    let sectionContent = '';
                    let methodContent = `
                  <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../../../../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
                  <div class="container container-main">
                  <div class="col-8 col-content">
                  <ul class="tsd-breadcrumb">
                  <li><a href="../../../../index.html">walmart-MobileApps</a></li>
                  <li><a href="../../index.html">${subfolderName}</a></li>
                  <li><a href="../${
                    file.split('.')[0]
                  }.html">${pageMethod}</a></li>
                  <li><a href="mapping.html">${each}</a></li>
                  </ul>
                  <section class="tsd-panel-group tsd-index-group">
                  <section class="tsd-panel tsd-index-panel">
                  <section class="tsd-index-section">
                  <h3 class="tsd-index-heading">Mappings</h3>
                  <div class="tsd-index-list">\n`;
                    sharedOutput[pageMethod][each].forEach((method) => {
                      methodContent += `<a href="#${method.name}" class="tsd-index-link tsd-kind-method tsd-parent-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="#FF4DB8" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12" id="icon-2048-path"></rect><path d="M9.162 16V7.24H10.578L11.514 10.072C11.602 10.328 11.674 10.584 11.73 10.84C11.794 11.088 11.842 11.28 11.874 11.416C11.906 11.28 11.954 11.088 12.018 10.84C12.082 10.584 12.154 10.324 12.234 10.06L13.122 7.24H14.538V16H13.482V12.82C13.482 12.468 13.49 12.068 13.506 11.62C13.53 11.172 13.558 10.716 13.59 10.252C13.622 9.78 13.654 9.332 13.686 8.908C13.726 8.476 13.762 8.1 13.794 7.78L12.366 12.16H11.334L9.894 7.78C9.934 8.092 9.97 8.456 10.002 8.872C10.042 9.28 10.078 9.716 10.11 10.18C10.142 10.636 10.166 11.092 10.182 11.548C10.206 12.004 10.218 12.428 10.218 12.82V16H9.162Z" fill="var(--color-text)" id="icon-2048-text"></path></svg><span>${method.name}</span></a>\n`;
                      sectionContent += `
                      <section class="tsd-panel tsd-member tsd-kind-method tsd-parent-kind-class"><a id="${method.name}" class="tsd-anchor"></a>
                      <h3 class="tsd-anchor-link"><span>${method.name}</span><a href="#${method.name}" aria-label="Permalink" class="tsd-anchor-icon"><svg class="icon icon-tabler icon-tabler-link" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-anchor-a"></use><use href="#icon-anchor-b"></use><use href="#icon-anchor-c"></use></svg></a></h3>
                      <ul class="tsd-signatures tsd-kind-method tsd-parent-kind-class">
                      <li class="tsd-description">
                      <aside class="tsd-sources">
                      <ul>
                      <li>Identifier:${method.identifier}</li>
                      <li>Defined in ${file}: ${method.lineNumber}</li></ul></aside></li></ul></section>
                      `;
                    });
                    methodContent += `</div></section></section></section></div>
                  </div>`;
                    methodContent += ` <div class="container container-main">\n
                <section class="tsd-panel-group tsd-member-group">\n
                <section class="tsd-panel tsd-index-panel">\n
                <h2>Methods</h2>\n
                <section class="tsd-index-section">\n
                ${sectionContent}`;
                    methodContent += `</section></section></section></div></body></html>`;
                    let pageNameForCreation = each
                      .toLowerCase()
                      .includes('page')
                      ? each.toLowerCase().split('page')[0]
                      : each.toLowerCase();

                    writeContentToFile(
                      __dirname +
                        `/docs/mappingDocs/sharedMapping/${subfolderName}/${pageMethod}/${pageNameForCreation}.html`,
                      methodContent
                    );
                    methodContent = '';
                    sectionContent = '';
                  }
                } else {
                  functionContent += `<h1> No Methods Exists</h1>`;
                  let noContent = `
                  <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../../../../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
                  <div class="container container-main">
                  <div class="col-8 col-content">
                  <div class="tsd-page-title">
                  <ul class="tsd-breadcrumb">
                  <li><a href="../../../../index.html">walmart-MobileApps</a></li>
                  <li><a href="../../index.html">${subfolderName}</a></li>
                  <li><a href="../${
                    file.split('.')[0]
                  }.html">${pageMethod}</a></li>
                  </ul>
                  <section class="tsd-panel-group tsd-index-group">
                  <section class="tsd-panel tsd-index-panel">
                  <section class="tsd-index-section">
                  <div class="tsd-index-list">\n
                  <h1>No Methods Exists</h1>`;
                  noContent += `</section></section></section></div></body></html>`;
                  let pageName = subfolderName.toLowerCase().includes('page')
                    ? ` ${subfolderName.toLowerCase().split('page')[0]}`
                    : ` ${subfolderName.toLowerCase()}`;
                  writeContentToFile(
                    __dirname +
                      `/docs/mappingDocs/sharedMapping/${subfolderName}/${pageMethod}/${pageName}.html`,
                    noContent
                  );
                }
                functionContent += `</div></section></section></section></div></div></body></html>`;
                writeContentToFile(
                  __dirname +
                    `/docs/mappingDocs/sharedMapping/${subfolderName}/${pageMethod}/mapping.html`,
                  functionContent
                );
                functionContent = '';
              }
            } else {
              createYamlPageAndMethod(
                readPath,
                __dirname +
                  `/docs/mappingDocs/${folderName}/${subfolderName}/${file}`,
                '../../../',
                ul1,
                ul2
              );
            }
          });
        } else {
          let readPath = mappingRoot + `/${folderName}/${subfolderName}`;
          let sourceToWritePath =
            __dirname + `/docs/mappingDocs/${folderName}/${subfolderName}`;
          let historyTag1 = `<ul class="tsd-breadcrumb">
            <li><a href="../../index.html">walmart-MobileApps</a></li>
            <li><a href="index.html">${subfolderName.split('.')[0]}</a></li>
            </ul>`;
          let historyTag2 = `
            <ul class="tsd-breadcrumb">
            <li><a href="../../../index.html">walmart-MobileApps</a></li>
            <li><a href="../index.html">${subfolderName.split('.')[0]}</a></li>
            <li><a href="../${
              subfolderName.split('.')[0]
            }.html">Methods</a></li>
            </ul>
            `;
          let cssFilePath = '../../';
          createYamlPageAndMethod(
            readPath,
            sourceToWritePath,
            cssFilePath,
            historyTag1,
            historyTag2
          );
        }
      });
    }
  });
}

async function getFileInfo(folders) {
  const arrayWithFilesContent = await Promise.all(
    folders.map((name) => readFile(path.join(rootPath, name)))
  );
  return arrayWithFilesContent;
}

async function createPages() {
  let getFolder = getFolders();
  createDirectory(path.join(__dirname, '/docs/pages'));
  getFolder.forEach(async (folderName) => {
    let pageConent = `
                <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
            <div class="container container-main">
            <div class="col-8 col-content">
            <div class="tsd-page-title">
            <ul class="tsd-breadcrumb">
            <li><a href="../index.html">walmart-MobileApps</a></li>
            <li><a href="${folderName}.html">${folderName}</a></li></ul></div>
            <section class="tsd-panel-group tsd-index-group">
            <section class="tsd-panel tsd-index-panel">
            <h3 class="tsd-index-heading uppercase">Index</h3>
            <section class="tsd-index-section">
            <h3 class="tsd-index-heading">Pages</h3>
            <div class="tsd-index-list">`;

    let files = await getFileInfo([folderName]);
    if (files[0].length > 0) {
      files[0].forEach((file) => {
        pageConent += `<a href=${__dirname}/docs/methods/${folderName}${file}.html class="tsd-index-link tsd-kind-property tsd-parent-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="#FF984D" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12" id="icon-1024-path"></rect><path d="M9.354 16V7.24H12.174C12.99 7.24 13.638 7.476 14.118 7.948C14.606 8.412 14.85 9.036 14.85 9.82C14.85 10.604 14.606 11.232 14.118 11.704C13.638 12.168 12.99 12.4 12.174 12.4H10.434V16H9.354ZM10.434 11.428H12.174C12.646 11.428 13.022 11.284 13.302 10.996C13.59 10.7 13.734 10.308 13.734 9.82C13.734 9.324 13.59 8.932 13.302 8.644C13.022 8.356 12.646 8.212 12.174 8.212H10.434V11.428Z" fill="var(--color-text)" id="icon-1024-text"></path></svg><span>${file.split(
          '.'
        )[0] + 'Functions'}</span></a>`;
      });
    } else {
      pageConent += '<h1> No pages </h1>';
    }
    pageConent += `</div></section></section></section></div></div></body></html>`;
    writeContentToFile(`docs/pages/${folderName}.html`, pageConent);
  });
}

function createMethods() {
  let getFolder = getFolders();
  let sectionInfo = [];
  createDirectory(path.join(__dirname, '/docs/methods'));
  getFolder.forEach(async (folderName) => {
    let files = await getFileInfo([folderName]);
    files[0].forEach((file) => {
      let methodContent = `
            <!DOCTYPE html><html class="default" lang="en"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>walmart-web</title><meta name="description" content="Documentation for walmart-web"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="../style.css"/><link rel="stylesheet" href="highlight.css"/></head><body><script>document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"</script>
            <div class="container container-main">
            <div class="col-8 col-content">
            <div class="tsd-page-title">
            <ul class="tsd-breadcrumb">
            <li><a href="../index.html">walmart-MobileApps</a></li>
            <li><a href="../pages/${folderName}.html">${folderName}</a></li>
            <li><a href="${folderName}${file}.html">${file.split('.')[0] +
        'Functions'}</a></li></ul></div>
            <section class="tsd-panel-group tsd-index-group">
            <section class="tsd-panel tsd-index-panel">
            <h3 class="tsd-index-heading uppercase">Index</h3>
            <section class="tsd-index-section">
            <h3 class="tsd-index-heading">Methods</h3>
            <div class="tsd-index-list">\n`;
      try {
        const config = yaml.load(
          fs.readFileSync(path.join(rootPath, `${folderName}/${file}`), 'utf8')
        );
        if (config) {
          const indentedJson = JSON.parse(JSON.stringify(config, null, 4));

          indentedJson.functions.forEach((method) => {
            let params = 'No Params';
            // eslint-disable-next-line no-prototype-builtins
            if (method.flow[0].hasOwnProperty('enterText')) {
              params = method.flow[0].enterText.string
                .split('{')[1]
                .split('}')[0];
            }
            let methodName = method.name.split('.');
            methodName = methodName[methodName.length - 1];
            let lineNumber = findFunctionLineNumberAndDescription(
              path.join(rootPath, `${folderName}/${file}`),
              method.name
            );
            let { notes, description } = getDescription(
              path.join(rootPath, `${folderName}/${file}`),
              method.name
            );
            let platform = file.toString().includes('android')
              ? 'Android'
              : file.includes('iOS')
              ? 'iOS'
              : 'Android & iOS';
            methodContent += `<a href="${folderName}${file}.html#${methodName}" class="tsd-index-link tsd-kind-method tsd-parent-kind-class"><svg class="tsd-kind-icon" width="24" height="24" viewBox="0 0 24 24"><rect fill="var(--color-icon-background)" stroke="#FF4DB8" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12" id="icon-2048-path"></rect><path d="M9.162 16V7.24H10.578L11.514 10.072C11.602 10.328 11.674 10.584 11.73 10.84C11.794 11.088 11.842 11.28 11.874 11.416C11.906 11.28 11.954 11.088 12.018 10.84C12.082 10.584 12.154 10.324 12.234 10.06L13.122 7.24H14.538V16H13.482V12.82C13.482 12.468 13.49 12.068 13.506 11.62C13.53 11.172 13.558 10.716 13.59 10.252C13.622 9.78 13.654 9.332 13.686 8.908C13.726 8.476 13.762 8.1 13.794 7.78L12.366 12.16H11.334L9.894 7.78C9.934 8.092 9.97 8.456 10.002 8.872C10.042 9.28 10.078 9.716 10.11 10.18C10.142 10.636 10.166 11.092 10.182 11.548C10.206 12.004 10.218 12.428 10.218 12.82V16H9.162Z" fill="var(--color-text)" id="icon-2048-text"></path></svg><span>${methodName}</span></a>\n`;
            sectionInfo.push({
              folderName,
              file,
              name: methodName,
              params,
              platform,
              lineNumber,
              description: description,
              notes: notes
            });
          });
          methodContent += `</div></section></section></section></div>
        </div>\n
        <div class="container container-main">\n
        <section class="tsd-panel-group tsd-member-group">\n
        <section class="tsd-panel tsd-index-panel">\n
        <h2>Methods</h2>\n
        <section class="tsd-index-section">\n`;
          sectionInfo.forEach((section) => {
            methodContent += `
            <section class="tsd-panel tsd-member tsd-kind-method tsd-parent-kind-class"><a id="${
              section.name
            }" class="tsd-anchor"></a>
            <h3 class="tsd-anchor-link"><span>${section.name}</span><a href="#${
              section.name
            }" aria-label="Permalink" class="tsd-anchor-icon"><svg class="icon icon-tabler icon-tabler-link" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-anchor-a"></use><use href="#icon-anchor-b"></use><use href="#icon-anchor-c"></use></svg></a></h3>
            <ul class="tsd-signatures tsd-kind-method tsd-parent-kind-class">
            <li class="tsd-description">
            <aside class="tsd-sources">
            <ul>
            <li>Description: ${
              section.description != ''
                ? section.description
                : 'No Description provided in the methods'
            }</li>
            <li>Params: ${section.params}</li>
            <li>Platform: ${section.platform}</li>
            ${section.notes != '' ? `<li>Notes: ${section.notes}</li>` : ''}
            <li>Defined in ${section.file}: ${
              section.lineNumber
            }</li></ul></aside></li></ul></section>
            `;
          });
          methodContent += `</section></section></section></div></body></html>`;

          writeContentToFile(
            `docs/methods/${folderName}${file}.html`,
            methodContent
          );
          sectionInfo = [];
          methodContent = '';
        } else {
          methodContent +=
            '<h1>You have to create functions to have reference here :) </h1>';
          methodContent += `</section></section></section></div></body></html>`;
          writeContentToFile(
            `docs/methods/${folderName}${file}.html`,
            methodContent
          );
        }
      } catch (e) {
        console.log('Error while making an method content=>', e);
        throw new Error(e.message || 'Error while making an method content');
      }
    });
  });
}
// Creates Doc and Builds Pages and Methods
function createDocument() {
  createDirectory(path.join(__dirname, `/docs`));
  createDirectory(path.join(__dirname, `/docs/mappingDocs`));

  let indexContent = createIndexHtml();
  writeContentToFile(path.join(__dirname, '/docs/index.html'), indexContent);
  writeContentToFile(path.join(__dirname, '/docs/style.css'), cssContent);
  createPages();
  createMethods();

  //Mapping Docs generation starts
  createMarket();
  createMarketMappings();
  createMarketPages();
  openHTMLFileInBrowser(__dirname + '/docs/index.html');
}

function findFunctionLineNumberAndDescription(filePath, functionName) {
  const yamlContent = fs.readFileSync(filePath, 'utf8');
  const lines = yamlContent.split('\n');
  let lineNumber;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(functionName)) {
      lineNumber = i + 1;
      return lineNumber;
    }
  }
  return null;
}

function getDescription(filePath, functionName) {
  const yamlContent = fs.readFileSync(filePath, 'utf8');
  let notes = '';
  let description = '';
  for (const eachArray of yamlContent.split('flow')) {
    if (eachArray.includes(functionName)) {
      for (const k of eachArray.split('\n')) {
        let lowerCaseValue = k.toLowerCase();
        if (lowerCaseValue.includes('description')) {
          description = k.split(':')[1];
        }
        if (lowerCaseValue.includes('notes')) {
          notes = k.split(':')[1];
        }
      }
    }
  }

  return {
    notes,
    description
  };
}
function createDirectory(dicrectoryPath) {
  try {
    if (!fs.existsSync(dicrectoryPath)) {
      fs.mkdirSync(dicrectoryPath);
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error while making an directory', error);
    throw new Error('Error while making an directory');
  }
}

function writeContentToFile(filePath, fileContent) {
  try {
    // if (fs.existsSync(filePath)) {
    writeFileSync(filePath, fileContent);
    // }
    return;
  } catch (error) {
    console.log('Error while writing content to a file', error, fileContent);
    throw new Error('Error while writing content to a file');
  }
}

function openHTMLFileInBrowser(path) {
  exec(`open  ${path}`, (error) => {
    if (error) {
      console.log('Error while opening a HTML file', error);
      return;
    }
    console.log('index.html file opened in the default browser');
  });
}
// Starts Controller
createDocument();
