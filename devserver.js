/**
 * MIT License - Copyright (C) 2018 - Ádám Liszkai <adaliszk@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

const console = require('console');
const chalk = require('chalk');

const process = require('process');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;

const express = require('express');
const app = new express();

app.use('/@adaliszk', (request, response) => {
    const method = request.method.toUpperCase();
    console.log(chalk.blue(`${method} ${request.path}`));
    const fileName = `${ROOT}${request.path}`;
    const served = serveStatic(response, fileName);
    if (!served) {
        console.log(chalk.red(`    ${fileName.replace(ROOT,'')}`));
        response.status(404).send(null);
    }
});

app.use('/', (request, response) => {
    const method = request.method.toUpperCase();
    console.log(chalk.blue(`${method} ${request.path}`));
    const path = request.path === '/' ? '/index.html' : request.path;
    const fileName = `${ROOT}/demo${path}`;

    //response.setHeader('Link: </@adaliszk/skeleton.ts>; rel=preload; as=scrpit');
    //response.setHeader('Link: </@adaliszk/section.js>; rel=preload; as=scrpit');
    //response.setHeader('Link: </@adaliszk/widget.js>; rel=preload; as=scrpit');

    const served = serveStatic(response, fileName, {});
    if (!served) {
        console.log(chalk.red(`>>> 404`));
        response.status(404).send(null);
    }
});

app.listen(PORT, err => {
    if (!err) console.log(chalk.white(`HTTP Listening on :${PORT}`));
    else
    {
        console.error(err);
        process.exit(1);
    }
});

function serveStatic(response, fileName)
{
    if (fs.existsSync(fileName)) {
        console.log(chalk.green(`>>> ${fileName.replace(ROOT,'')}`));
        response.sendFile(fileName);
        return response;
    }
    else return false;
}
