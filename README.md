#### 安装
``` powershell
npm install -g platform-cli
```

#### 初始化项目
``` powershell
#pf为platform 简写， 可以使用platform 代替pf
#查看帮助
pf init -h
#列出可用的种子项目
pf init -l
#初始化项目(以vue为例)
pf init vue vue-platform 
```

#### 生成样板文件

``` powershell
#该命令只能在项目的 src 文件夹下执行
cd vue-platform/src 
#查看帮助
pf make -h
#列出可生成文件列表
pf make -l
#生成test组件
pf make ct test
#生成test页面
pf make pg test
```

#### 开启mock服务
``` powershell
#在本地4000端口开启， 进入 打开 localhost:4000/index 页面
pf mock -p 4000
```

#### 自定义配置文件
###### 在项目的根目录下有 `.platform` 配置文件， 该文件为必须。
``` powershell
{
	"type": "vue",              // 指定项目类型
	"template": "boilerplate"   // 指定样板文件的模板文件存放位置
}
```
###### 模板文件配置在`config.json` 中， 可以自定义生成类型,  `short` 字段用来配置命令简写
``` powershell
{
	"component": {
		"desc": "Create a new Vue Component in a `.vue` format",
		"file": "component.vue",
		"type": ".vue",
		"example": "vue make component(ct) components/CounterWidget"
	},
	"page": {
		"desc": "Create a new page in a `.vue` format",
		"file": "page.vue",
		"type": ".vue",
		"example": "vue make page pages/CounterPage"
	},
	"short": {
		"ct": "component",
		"pg": "page"
	}
}
```
#### mock服务使用
###### 改功能用来模拟后端数据，数据基于 [mock.js](http://mockjs.com/examples.html)生成， 在界面中填入接口及`request param` , `request body` , `response` 等，然后访问 `http://localhost:{port}/mock/{your interface}` 便可以根据你填的`response` 得到返回数据。例如：
``` powershell
输入：
	api: mymock,
	param: test,
	response: { // 填入的response为标准json
		"errno": 0,
		"data": {
			"mock|3": [{
				"name": "test"
			}]
		}
	}
访问： http://localhost:4000/mock/mymock?test=1
返回: {
	"errno": 0,
	"data": [
		{"name": "test"},
		{"name": "test"},
		{"name": "test"}
	]
}
```


