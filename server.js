/**
 * Serve SPA Application.
 */
import http from 'http';
import os from 'os';
import path from 'path';
import fs from 'fs';

const port = 3000;
const encode = "UTF-8";
const approot = 'src';
const resourceroot = 'resource';
const host = findHostAddress(os.networkInterfaces());

console.log('Served at http://' + host + ':' + port);
console.log('');

// Runs http server.
const plainHttpServer = http.createServer(function (req, res) {
    try {
        reqlog(req);
        req.setEncoding(encode);
        attachFile(res, getRelpath(req.url), true);
    } catch (err) {
        log(err, req);
        errorPage(res, err.$code || 500, err);
    }
}).listen(port);

plainHttpServer.addListener('error', err => {
    log(err);
});

/**
 * @param {string} url
 */
function getRelpath(url) {
    let endidx = url.indexOf('?');
    endidx = (endidx < 0) ? url.length : endidx;
    return url.substring(0, endidx);
}

/**
 * @param {any} res
 * @param {number} code
 * @param {Error} err
 */
function errorPage(res, code, err) {
    setHeader(res, code, 'text/html');
    res.end('');
}

/**
 * @param {string | Error} msg
 */
function log(msg) {
    var txt = new Date().toISOString()
        + ' ' + msg;
    console.log(txt);
    if (msg instanceof Error) {
        console.log(msg.stack);
    }
}

/**
 * @param {http.IncomingMessage} req
 */
function reqlog(req) {
    var reqtxt = new Date().toISOString()
        + ', ' + (req ? req.socket.remoteAddress : '(void)')
        + ' [' + (req ? req.method : '(void)')
        + '] ' + (req ? req.url : '(void)')
        // + ', headers=' + (req ? Object.keys(req.headers).map(headername => {
        //     return headername + ":" + req.headers[headername];
        // }).join(',') : 'void')
        ;
    console.log(reqtxt);
}

/**
 * @param {any} osNetwork
 */
function findHostAddress(osNetwork) {
    if (!osNetwork) return '';

    var keys = Object.keys(osNetwork);
    for (var i = 0; i < keys.length; i++) {
        var a = seekAddresses(osNetwork[keys[i]]);
        if (a) {
            // return a.address + '(' + a.netmask + ')';
            return a.address;
        }
    }

    function seekAddresses(addresses) {
        if (addresses) {
            for (var i = 0; i < addresses.length; i++) {
                var address = addresses[i];
                if (!address.internal) {
                    if (address.family === 'IPv4') {
                        return address;
                    }
                }
            }
        }
    }
}

/**
 * @param {http.ServerResponse} res
 * @param {number} code
 */
function setHeader(res, code, contentType, cookies) {
    if (!code) code = 200;
    const headers = {
        // 'Access-Control-Allow-Origin': config.cors.origin,
        // 'Access-Control-Allow-Headers': config.cors.headers,
        'Content-Type': contentType || 'application/json; charset=utf-8',
    };
    if (cookies) cookies.foeEach(cookie => headers['Set-Cookie'] = cookie.join('=') + '; Path=/; SameSite=Lax; HttpOnly;');
    res.writeHead(code, headers);
}

/**
 * @param {string} pathstr
 */
function sanitizePath(relpath, rootpath) {
    const newpath = path.join(
        rootpath,
        path.normalize(
            relpath.replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
        ).replace(/^(\.\.(\/|\\|$))+/, ''));
    if (!newpath.startsWith(rootpath)) throw new Error('Cannot access to ' + newpath);
    return newpath;
}

/**
 * @param {string} filepath
 * @return {string}
 */
function getContentType(filepath) {
    const idx = filepath.lastIndexOf('.');
    if (idx < 0) {
        return;
    } else {
        const fileext = filepath.substring(idx, filepath.length);
        const mimetypes = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'text/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.ico': 'image/x-icon',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
        };
        if (mimetypes[fileext]) {
            return mimetypes[fileext];
        } else {
            return 'text/plain';
        }
    }
}

/**
 * @param {http.ServerResponse} res
 * @param {string} relpath
 * @param {boolean} spa
 */
function attachFile(res, relpath, spa) {
    const filepath = (function (relpath) {
        const endidx = relpath.lastIndexOf('/');
        const filename = (endidx < 0) ? relpath : relpath.substring(endidx + 1);

        if (filename.indexOf('.') > 0) {
            const resourcepath = sanitizePath(relpath, resourceroot);
            if (fs.existsSync(resourcepath)) {
                return resourcepath;
            }
            const apppath = sanitizePath(relpath, approot);
            if (fs.existsSync(apppath)) {
                return apppath;
            }
            return null;
        } else if (spa) {
            const apppath = sanitizePath('index.html', approot);
            if (fs.existsSync(apppath)) {
                return apppath;
            }
            return null;
        } else {
            return null;
        }
    })(relpath);

    if (filepath) {
        setHeader(res, 200, getContentType(filepath));
        fs.createReadStream(filepath).pipe(res);
    } else {
        const err = new Error('Not found: ' + relpath);
        err.$code = 404;
        throw err;
    }
}
