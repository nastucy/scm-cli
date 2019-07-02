## scm-cli
1. 安装：`im-scm`目录下执行以下命令(以下所有命令都是在该文件夹下执行)
```js
npm install scm-cli -g
```

2. 初始化

```js
scm-cli init
```
输入之后会提示一下信息，回车进行确认换行(上下键进行选择)
```js
? 请输入模块名称 
? 请输入节点名称 
? 请选择需要复制的模块文件夹
? 请选择需要复制的节点文件夹
```

- 请输入模块名称：输入你需要添加的节点所在的模块，如果是新模块，输入后会自动创建该模块的文件夹。**小写英文**

- 请输入节点名称：输入你需要添加的节点名称，如果名称较长，建议用 `-` 分割，短的直接输入即可。 **小写英文**

- 请选择需要复制的模块文件夹：从`src/pages`下选择

- 请选择需要复制的节点文件夹：从选择的文件夹下选择需要复制的节点


> 该工具只做简单的复制替换功能，尽量去复制命名规范的代码

> 如果报命令不存在，检查下node.js环境变量是否在默认目录下，即`C:\Program Files\nodejs\`，如果不是，建议更改安装目录，修改环境变量

