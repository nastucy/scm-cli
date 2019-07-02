
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const symbols = require('log-symbols');
let stat = fs.stat;

// 递归创建目录 异步方法  
function mkdirs(src, dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            console.log(symbols.info, chalk.green(dirname + '文件夹已存在'));
            callback(src, dirname);
        } else {
            mkdirs(src, path.dirname(dirname), function () {
                fs.mkdir(dirname, () => {
                    callback(src, dirname);
                });
                console.log(symbols.success, chalk.green(dirname + '文件夹已创建'));
            });
        }
    });
}
//读取文件目录并返回
function copy(src, dst) {
    console.log(chalk.green('开始复制文件'))
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }
        console.log(paths)
        paths.forEach(function (path) {
            let _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;
            stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);

                    // 通过管道来传输流
                    readable.pipe(writable);
                    console.log(symbols.success, chalk.green(dst + '/' + path + '复制完成'))
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    mkdirs(_src, _dst, copy);
                }
            });
        });
    });
};
//修改路由文件
function routeCopy(module_name, node_name, template,node) {

    const _node_name = strUpper(node_name),//首字母大写
        _changeNodeName = changeNodeName(node_name);//去掉-

    const _template = strUpper(template),//首字母大写
        _changeTemplate = changeNodeName(template);//去掉-


    fs.exists(`./src/pages/${module_name}/router.js`, function (exists) {
        if (exists) {//存在的话去修改
            console.log(chalk.green('开始修改router.js'))
            let routerData = fs.readFileSync(`./src/pages/${module_name}/router.js`, 'utf8').split('\n');
            let old_routerData = fs.readFileSync(`./src/pages/${node}/router.js`, 'utf8').split('\n');
            let routeList = [];

            for (let i = 0; i < old_routerData.length; i++) {
                if (old_routerData[i].indexOf(template) != -1) {
                    let str = old_routerData[i].replace(new RegExp(template, "gm"), node_name).replace(new RegExp(_template, "gm"), _node_name).replace(new RegExp(_changeTemplate, "gm"), _changeNodeName);
                    routeList.push(str);
                }
            }
            let importNum = 0, routeNum = 0;
            for (let i = 0; i < routerData.length; i++) {
                if (routerData[i].indexOf("const") != -1) {
                    importNum = i;
                }
                if (routerData[i].trim().indexOf("</div>") != -1) {
                    routeNum = i + 1;
                    break;
                }
            }
            let flag = routerData.includes(routeList[0])
            if (!flag) {
                for (let i = 0; i < routeList.length; i++) {
                    if (i == 0) {
                        routerData.splice(importNum, 0, routeList[0])
                    } else {
                        routerData.splice(routeNum, 0, routeList[i])
                        routeNum++;
                    }
                }
                fs.writeFile(`./src/pages/${module_name}/router.js`, routerData.join('\n'), function (error) {
                    console.log(symbols.success, chalk.green('router.js文件已修改'))
                    if (error) {
                        console.log(symbols.error, chalk.red(error));
                        return false;
                    }
                })
            } else {
                console.log('路由文件内容已存在');
            }
        } else {//不存在去创建
            console.log(chalk.green('创建router.js'))
            fs.writeFile(`./src/pages/${module_name}/router.js`, route(), (error) => {
                if (error) {
                    console.log(symbols.error, chalk.red(error));
                    return false;
                }
                routeCopy(module_name, node_name, template,node)
            })
        }
    })
}
//router模板
function route() {

    const route =
`import React from "react";
import { Route } from "mirrorx";
    
const Routers = ({ match }) => (
    <div>
        <Route exact path={match.url} render={() => (
            <h3>请选择一个菜单</h3>
        )}/>
    </div>
);

export default Routers;`
    return route;
}

function replaceAll(src,module_name, node_name, template,node){


    const _node_name = strUpper(node_name),//首字母大写
    _changeNodeName = changeNodeName(node_name);//小写

    const _template = strUpper(template),//首字母大写
    _changeTemplate = changeNodeName(template);//小写

    console.log(chalk.green('开始修改文件'))
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function (path) {
            let _src = src + '/' + path;
            stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                    let data = fs.readFileSync(_src, 'utf8').split('\n');
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].indexOf(template) != -1) {
                            let str = data[i];
                            str = str.replace(new RegExp(template, "gm"), node_name);
                            data[i] = str;
                        }
                        if (data[i].indexOf(_template) != -1) {
                            let str = data[i];
                            str = str.replace(new RegExp(_template, "gm"), _node_name);
                            data[i] = str;
                        }
                        if (data[i].indexOf(_changeTemplate) != -1) {
                            let str = data[i];
                            str = str.replace(new RegExp(_changeTemplate, "gm"), _changeNodeName);
                            data[i] = str;
                        }
                        if (data[i].indexOf(node) != -1) {
                            let str = data[i];
                            str = str.replace(new RegExp(node, "gm"), module_name);
                            data[i] = str;
                        }
                        if (data[i].indexOf("EMS") != -1) {
                            let str = data[i];
                            str = str.replace(new RegExp("EMS", "gm"), 'SCM');
                            data[i] = str;
                        }
                    }
                    fs.writeFile(_src, data.join('\n'), function (error) {
                        console.log(symbols.success, chalk.green(_src +'文件已修改'))
                        if (error) {
                            console.log(symbols.error, chalk.red(error));
                            return false;
                        }
                    })
                }// 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    replaceAll(_src,module_name, node_name, template,node);
                }
            });
        });
    });
}

//去掉-
function changeNodeName(name) {
    if (!name) return;
    let _name = name.split('-').join('');
    return _name;
}
//去掉-并且首字母大写
function strUpper(name) {
    let _name = '';
    if (name.indexOf('-') != -1) {
        let nameArr = name.split('-');
        for (let i = 0; i < nameArr.length; i++) {
            let str = nameArr[i];
            str = str.replace(str[0], str[0].toUpperCase());
            nameArr[i] = str;
        }
        _name = nameArr.join('')
    } else {
        _name = name.replace(name[0], name[0].toUpperCase())
    }
    return _name;
}

module.exports = {
    mkdirs: mkdirs,
    copy: copy,
    routeCopy: routeCopy,
    replaceAll: replaceAll,
}