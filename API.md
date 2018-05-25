###在线帮助数据库
数据库名 onlinehelp

/**
 * 保存文件信息
 */
fileinfos
{
		username：用户名
		ID：
		id：
		title:
		secrecy_type: 保密类型
		secrecy_model:[]
		manufacturer: 厂商
		brand：品牌
		product：产品
		tag： 标签
		abstract：摘要
		link: 链接
		upload_file: 上传文件
		filepath：文件路径
		timestamp：时间戳

}

/**
 * 添加文件信息到自己收藏
 */

collections

{
		username: 用户名
		ID: 唯一ID
		id: 唯一id(服务器端使用)
		title：
		timestamp: 收藏时间
}


###文件记录操作

```sh
Note： 创建文件记录
url： http://nccloud.weihong.com.cn/onlinehelpapi/file
method： POST
query_string:
body {
		username：用户名
		ID：
		id：
		title:
		secrecy_type: 保密类型
		secrecy_model:[]
		manufacturer: 厂商
		brand：品牌
		product：产品
		tag： 标签
		abstract：摘要
		link: 链接
		upload_file: 上传文件
		filepath：文件路径
		timestamp：时间戳
}

```

```sh
Note： 修改文件记录
url： http://nccloud.weihong.com.cn/onlinehelpapi/file
method： PUT
query_string:
body {
		username：用户名
		ID：
		id：
		title:
		secrecy_type: 保密类型
		secrecy_model:[]
		manufacturer: 厂商
		brand：品牌
		product：产品
		tag： 标签
		abstract：摘要
		link: 链接
		upload_file: 上传文件
		filepath：文件路径
		timestamp：时间戳
}

```


```sh
Note： 删除文件记录
url： http://nccloud.weihong.com.cn/onlinehelpapi/file
method： DELETE
query_string:
body {
		username：用户名
		ID：
		id：
}

```

```sh
Note： 获得文件记录
url： http://nccloud.weihong.com.cn/onlinehelpapi/file
method： GET
query_string: username ID
body {}

```

```sh
Note： 获得唯一ID
url： http://nccloud.weihong.com.cn/onlinehelpapi/file/number
method： GET
query_string:
body {}

```






###收藏文件记录操作


```sh
Note： 创建收藏文件记录
url： http://nccloud.weihong.com.cn/onlinehelpapi/collection
method： POST
query_string:
body {
		username：用户名
		ID：
		id：
		title:
		timestamp：收藏时间
}

```

```sh
Note： 删除收藏文件记录
url： http://nccloud.weihong.com.cn/onlinehelpapi/collection
method： DELETE
query_string:
body {
		username：用户名
		ID：[]   数组，存放要删除的多个文件ID
}

```

```sh
Note： 查看收藏文件记录
url： http://nccloud.weihong.com.cn/onlinehelpapi/collection
method： GET
query_string:  username=xxxxxx
body {
}

```