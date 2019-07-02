//入口文件，判断用户输入
const { mkdirs,
    copy,
    routeCopy,
    replaceAll } = require('./common');

module.exports = {
    create: function (data) {
        let { module_name, node_name, node,template} = data;
        //创建模块并复制文件
        mkdirs(`./src/pages/${node}/${template}`, `./src/pages/${module_name}/${node_name}`, copy);
        //创建或者修改路由文件
        setTimeout(() => {
            routeCopy(module_name, node_name, template,node);
            replaceAll(`./src/pages/${module_name}/${node_name}`, module_name, node_name, template,node);
        }, 200)
    },
};