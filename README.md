# crrc-_frontend_module
crrc前端组件库

时序组件使用文档：

一、安装环境：
1.D3（5.16版本以上）
npm install d3
2.jquery（3.51版本以上）
npm install jquery

2、 引入TimeSequenceLine时序组件
1.将文件夹“timeFlowSequenceComponent”复制到调用时序组件js文件的同级目录下
2.在调用时序组件的js文件中导入“timeFlowSequenceComponent”文件中的相关组件、函数
import TimeSequenceLine, { requestInterval, cancelInterval } from "./timeFlowSequenceComponent/d3SequenceDataFlow";
3. 在需要显示时序图的地方插入<TimeSequenceLine />标签，在需要设置定时请求的地方使用requestInterval函数，在需要取消定时请求的地方使用cancelInterval函数。

页表组件使用文档：

一、安装环境：

2、 引入TablePageNav时序组件
1.将文件夹“table_page_nav”复制到调用页表组件js文件的同级目录下
2.在调用页表组件的js文件中导入“pageNav”文件中的相关组件
import TablePageNav from "./table_page_nav/pageNav";
3. 在需要显示时序图的地方插入<TablePageNav/>标签。
