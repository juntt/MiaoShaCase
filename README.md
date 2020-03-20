# 聚焦Java性能优化 打造亿级流量秒杀系统

| 服务名称  | ip             | 端口 |
| --------- | -------------- | ---- |
| 数据库1   | 106.14.105.113 | 3306 |
| 数据库2   | 106.14.105.113 | 4406 |
| 秒杀服务1 | 106.14.105.113 | 9090 |
| 秒杀服务2 | 106.14.105.113 | 9091 |



# 第1章 课程导学

 本章对这门课程进行说明，包括：电商秒杀场景的介绍、秒杀系统涉及模块的介绍，秒杀核心的性能优化知识点的介绍，课程的学习规划等。 

##  1-1 课程介绍 

```
秒杀系统能力

​	核心处理能力

​	承载容量极限
```

```
课程目标
​	基于免费课程的秒杀项目做性能质的提升
​	互联网架构核心技术的拓展化应用
​	动手实践,理论应用相结合
```

![1583595577724](picture/1583595577724.png)

```
学习环境介绍
	IntelliJ IDEA 2018.1.3
	阿里云ECS或本 Linux地虚拟机,操作系统 centos7.4
 	MySQL5.6数据库, Redis4.0.1缓存,消息队列
 	rocketmq4.5, phantomjs无头浏览器

```

# 第2章 秒杀项目框架回顾

 本章会介绍前期秒杀免费课程当中所涉及的基础框架搭建知识，项目分层，源码导读等，帮助大家更快的理解秒杀的基础项目，为后续更深一步的课程学习打基础。 

##  2-1 分层设计 

![1583657412280](picture/1583657412280.png)

![1583657522766](picture/1583657522766.png)

![1583657872461](picture/1583657872461.png)

```
为什么要把用户数据表和用户密码表分开？
	因为用户密码可能存储在加密数据库中甚至其他系统当中。除了登录操作，修改密码操作等等跟密码相关的操作之外，其余相关的用户信息操作是不需要密码的。在接口调用的时候，可以减少一次数据库的查询并且节省数据空间。数据库表结构更多地是用来关注于存储层面以及查询效率。
```

##  2-2 包结构讲解 

![1583670151718](picture/1583670151718.png)

##   2-6 问题答疑 

全局异常处理器404，405问题

![1583684277946](picture/1583684277946.png)

![1583684303848](picture/1583684303848.png)

![1583684340319](picture/1583684340319.png)

---

# 第3章 云端部署，性能压测

 本章结合前面的秒杀项目介绍了在云端的部署秒杀项目的方案及云端部署的意义，引入了jmeter压测工具完成了性能的摸底测试，发现容器等基础配置的性能瓶颈并进行性能优化。 

##  3-1 云端部署---系统构建 

```
本章目标
	项目云端部署
	jmeter性能压测
	如何发现系统瓶颈问题

```

```
云端部署
	操作系统及运行环境
	数据库
	应用程序
```

```
私有部署
	操作系统及运行环境
	数据库
	应用程序
```

```
操作系统及运行环境
	阿里云 centos虚机
```

![1583734124024](picture/1583734124024.png)

##  3-2 云端部署---Java环境安装 

检测系统是否存在Java环境

```
java -version
```

![1583735442051](picture/1583735442051.png)

[下载JDK](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html)

赋予安装包可执行权限

```
chmod 777 jdk-8u65-linux-x64.rpm
```

安装

```
rpm -ivh jdk-8u65-linux-x64.rpm
```

会默认安装在usr目录下

```
cd //usr/
cd java/
ll
```

![1583736192189](picture/1583736192189.png)

再次检测系统是否存在Java环境

```
java -version
```

![1583736240014](picture/1583736240014.png)

---
指定环境变量
```
vim ~/.bash_profile
```

```
JAVA_HOME=//usr/java/jdk1.8.0_65
PATH=$PATH:$JAVA_HOME/bin
```

![1583736586807](picture/1583736586807.png)

```
source  ~/.bash_profile
```

##  3-3 云端部署---数据库环境安装 

[下载]()

安装MySQL所有相关依赖

```
yum install mysql*
```

```
yum install mariadb-server
```

启动

```
systemctl start mariadb.service
```

---
查看启动情况

```
ps -ef|grep mysql
```

![1583745247361](picture/1583745247361.png)

```
netstat -anp |grep 3306
```

![1583745330800](picture/1583745330800.png)

修改数据库密码

```
mysqladmin -u root password root
```

连接数据库

```
mysql -uroot -proot
```

![1583745602516](picture/1583745602516.png)

##  3-4 云端部署---数据库部署 

```
数据库
◆备份
◆上传
◆恢复
```

导入数据

```
mysql -uroot -proot < /root/data/miaosha.sql
```

![1583746174693](picture/1583746174693.png)

---

##  3-5 云端部署---打包上传 

springboot该如何打包？

```
应用程序
	maven打包
	上传
```

```
mvn clean package
```

这样打出来的包是不能用的

--修改pom文件

添加依赖

```xml
<plugin>
          <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
```

重新打包

```
mvn clean package
```

上传jar包至服务器

![1583748316312](picture/1583748316312.png)

运行

```
cd //var/
mkdir www/
cd www/
mkdir miaosha
cd miaosha/
mv ~/app/miaosha-1.0-SNAPSHOT.jar ./miaosha.jar
```

```
chmod -R 777 *
java -jar miaosha.jar
```

打开云服务器的8090端口

![1583748932617](picture/1583748932617.png)

![1583749023756](picture/1583749023756.png)

![1583749058214](picture/1583749058214.png)

![1583749185688](picture/1583749185688.png)

---

![1583749271985](picture/1583749271985.png)

##  3-6 云端部署---编写deploy脚本启动 

外挂配置文件

```
先读取工程内部的配置文件，再去读取外挂的配置文件，会以外挂的配置文件为主
```

新建配置文件

```
vim application.properties
```

```properties
server.port=80
```

![1583749836471](picture/1583749836471.png)

使用外挂配置文件

```
java -jar miaosha.jar --spring.config.addition-location=//var/www/miaosha/application.properties
```

![1583750083697](picture/1583750083697.png)

外挂配置文件生效

---

编写 deploy脚本启动

```
vim deploy.sh
```

```sh
nohup java -Xms400m -Xmx400m -XX:NewSize=200m -XX:MaxNewSize=200m -jar miaosha.jar --spring.config.addition-location=//var/www/miaosha/application.properties 
```

java:java命令启动,设置jvm初始和最大内存为2048m,2个g大小,设置jvm中初始新生代和最大新生代大小为1024m,设置成一样的目的是为了减少扩展jvm内存池过程中向操作系统索要内存分配的消耗,

-Xms400m：最大堆栈的参数，默认是256，这里我们设置为400m

-Xmx400m：最小堆栈的参数

-XX:NewSize=200m：指定新生代jvm的大小

-XX:MaxNewSize=200m：指定最大新生代jvm的大小

![1583751339283](picture/1583751339283.png)

赋予可执行权限

```
chmod -R 777 *
```

启动

```
./deploy.sh &
```

##  3-7 性能压测---jmeter工具简介（上） 

[下载网址]( https://jmeter.apache.org/ )

```
jmeter性能压测
	线程组
	Http请求
	查看结果树
	聚合报告
```

在Windows上启动jmeter

![1583755940423](picture/1583755940423.png)

![1583755961389](picture/1583755961389.png)

![1583756187479](picture/1583756187479.png)

线程组

![1583756249570](picture/1583756249570.png)

![1583756437606](picture/1583756437606.png)

http请求

![1583756483291](picture/1583756483291.png)

![1583756546003](picture/1583756546003.png)

查看结果树

![1583756587454](picture/1583756587454.png)

![1583756631160](picture/1583756631160.png)

聚合报告

![1583756676467](picture/1583756676467.png)

![1583756692752](picture/1583756692752.png)

---

##  3-8 性能压测---jmeter工具简介（下） 

查看java进程

```
ps -ef|grep java
```

![1583756923377](picture/1583756923377.png)

```
netstat -anp|grep 19284
```

![1583757016135](picture/1583757016135.png)

---

在hosts文件做映射

![1583757325859](picture/1583757325859.png)

测试

![1583757359865](picture/1583757359865.png)

---

进行压测

![1583757434663](picture/1583757434663.png)

1. HTTP请求设置
   ![1583757574137](picture/1583757574137.png)

   ![1583757630403](picture/1583757630403.png)

2. 线程组

   ![1583757735845](picture/1583757735845.png)
   ---

   ![1583758811696](picture/1583758811696.png)

   ---

   3.查看结果树

   ![1583759340345](picture/1583759340345.png)
   4.聚合报告

   ![1583759373109](picture/1583759373109.png)

   ```
   单台机器单个接口在一个线程的环境下
   	Average:平均耗时49毫秒
   	Throughput:每秒钟支持20.4TPS的流量
   ```

再次测试

![1583759805941](picture/1583759805941.png)

![1583759882452](picture/1583759882452.png)

```
Average:平均的响应时间
Median:对应中位数的响应时间
90%Line:90%的返回是落在35毫秒之内的
Min:最小的返回是21毫秒完成的
最大值：最大的要48秒才返回
```

##  3-9 性能压测---发现并发容量问题（上）

```
能够承受越来越多的高并发，并发数支持的越高，并且能够越来越快地返回，那么它的TPS就自然地高了，性能自然就高了。
比如说，200个并发数过来后，系统对应的并发数量上不去了，说明我的系统最多能承受200个并发。 
```

---

```
发现容量问题
 	server端并发线程数上不去
```

查看进程编号

```
ps -ef|grep java
```

![1583760746347](picture/1583760746347.png)

查看进程上有多少个线程数量

```
pstree -p 19284
```

![1583760844278](picture/1583760844278.png)

```
pstree -p 19284|wc -l
```

![1583760858223](picture/1583760858223.png)

```
有28个线程，也就是说我们的tomcat服务器在没有丝毫压力的情况下，内部自动维护了有28个线程的线程池
```

---

```
top -H
```

![1583761168223](picture/1583761168223.png)

```
load average：我们的服务器是两核的，load average就应该控制在2以内。超过2，就说服务器处在非常忙的状态
```

![1583761576108](picture/1583761576108.png)

![1583761625299](picture/1583761625299.png)

![1583761713138](picture/1583761713138.png)

增大线程数

![1583761839416](picture/1583761839416.png)

果然出现了问题

![1583762118117](picture/1583762118117.png)

![1583761930230](picture/1583761930230.png)

```
我们发现server端最多只能开40个线程
```

##  3-10 性能压测---发现并发容量问题（下） 

![1583762185299](picture/1583762185299.png)

![1583762313648](picture/1583762313648.png)

调优措施：

修改内置tomcat服务器的默认配置

```
vim application.properties
```

```properties
server.port=9090
server.tomcat.accept-count=1000
server.tomcat.max-threads=800
server.tomcat.min-spare-threads=100
```

![1583762935506](picture/1583762935506.png)

重启应用

```
./deploy.sh &
```

查看效果

```
pstree -p 19721|wc -l
```

![1583763126408](picture/1583763126408.png)

无压力的情况下，就维护了115线程

----

##   3-11 性能压测之定制化内嵌tomcat开发 

![1583763322340](picture/1583763322340.png)

```
设置这两个参数是为了保护我们的系统不受对应连接的客户端的拖累，在满足用户业务需求的情况下，又能合理地利用我们服务端的资源。
```

新建config包，该包下新建文件`WebServerConfiguration`

```java
package com.imooc.miaoshaproject.config;

import org.apache.catalina.connector.Connector;
import org.apache.coyote.http11.Http11NioProtocol;
import org.springframework.boot.web.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

/**
 * Created by hzllb on 2019/2/6.
 */
//当Spring容器内没有TomcatEmbeddedServletContainerFactory这个bean时，会吧此bean加载进spring容器中
@Component
public class WebServerConfiguration implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {
    @Override
    public void customize(ConfigurableWebServerFactory configurableWebServerFactory) {
        //使用对应工厂类提供给我们的接口定制化我们的tomcat connector
        ((TomcatServletWebServerFactory)configurableWebServerFactory).addConnectorCustomizers(new TomcatConnectorCustomizer() {
            @Override
            public void customize(Connector connector) {
                Http11NioProtocol protocol = (Http11NioProtocol) connector.getProtocolHandler();

                //定制化keepalivetimeout,设置30秒内没有请求则服务端自动断开keepalive链接
                protocol.setKeepAliveTimeout(30000);
                //当客户端发送超过10000个请求则自动断开keepalive链接
                protocol.setMaxKeepAliveRequests(10000);
            }
        });
    }
}

```

---

##  3-12 性能压测---容量问题优化方向 

![1583763983926](picture/1583763983926.png)

![1583764020729](picture/1583764020729.png)

![1583764095813](picture/1583764095813.png)

![1583764257209](picture/1583764257209.png)

```
总结
	云端部署
	压力测试
	发现容量问题
	优化方向
```

---

# 第4章 分布式扩展

 本章介绍了单机容量瓶劲的天花板，在其基础上进行反向代理负载均衡的优化，深入讲解了nginx高性能的原因，并使用nginx做了动静分离的服务器部署，同时在项目中引入了分布式会话管理的机制解决登录态一致性的问题。 

##   4-1 单机容量问题，水平扩展方案引入 

```
本章目标
	nginx反向代理负载均衡
	分布式会话管理
	使用 redis实现分布式会话存储
```

```
nginx反向代理负载均衡
	单机容量问题,水平扩展
 	nginx反向代理
	负载均衡配置
```

现在的架构：

![1583836436239](picture/1583836436239.png)

![1583836483257](picture/1583836483257.png)

解决方法：

![1583836664818](picture/1583836664818.png)

改进的架构

![1583836762499](picture/1583836762499.png)

##  4-2 数据库远程开放端口连接 

### 1.docker安装Mysql

首先安装docker compose

(国内镜像，安装贼快)

```sh
curl -L https://get.daocloud.io/docker/compose/releases/download/1.25.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

```

----

docker-compose.yml

```yaml
version: '3.1'
services:
  mysql:
    restart: always
    image: mysql:5.7.22
    container_name: mysql
    ports:
      - 4406:3306
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: root
    command:
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
      --max_allowed_packet=128M
      --sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO"
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

---

### 2.部署秒杀项目到容器

Dockerfile

```dockkerfile
FROM openjdk:8-jre
RUN mkdir /app
WORKDIR /app
RUN mkdir tomcat
RUN chmod -R 777 tomcat/
COPY miaosha.jar /app/
COPY application.properties /app/
COPY deploy.sh /app/
RUN chmod 777 /app/*
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
CMD ["sh", "deploy.sh","&"]
EXPOSE 9091
```

docker-compose.yml

```yaml
version: '3.1'
services:
  miaosha1:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    image: junglegodlion/miaosha1
    container_name: jungle-miaosha1
    ports:
      - 9091:9091
```

```
docker-compose up -d --build
```

查看日志

```
docker-compose logs -f
```

测试

浏览器访问 http://106.14.105.113:9091/item/get?id=6 

![1583942442571](picture/1583942442571.png)

---

##  4-3 修改前端资源用于部署nginx 

```
nginx
	使用 nginx作为web服务器
	使用 nginx作为动静分离服务器
	使用 nginx作为反向代理服务器
```

架构设计

![1584071496783](picture/1584071496783.png)

![1584071599781](picture/1584071599781.png)

---

打开静态资源文件

新建gethost.js文件

--定义一个全局变量

```javascript
var g_host = "106.14.105.113:9091";
```

在其它html文件中引入这个js文件

```javascript
<script src="./gethost.js" type="text/javascript"></script>
```

---

##  4-4 部署Nginx OpenResty 

 OpenResty® 是一款基于 NGINX 和 LuaJIT 的 Web 平台。 

[官网](http://openresty.org/cn/)

![1584073469178](picture/1584073469178.png)

```
chmod -R 777 openresty-1.13.6.2.tar.gz
tar -xvzf openresty-1.13.6.2.tar.gz -C ~/app/
```

编译

```
cd openresty-1.13.6.2/
./configure
gmake
gmake install
```

![1584074169707](picture/1584074169707.png)

![1584074268183](picture/1584074268183.png)

```
cd /usr/local/openresty/
```

![1584074350198](picture/1584074350198.png)

启动nginx

```
cd nginx/
sbin/nginx -c conf/nginx.conf
```

默认起在80端口

```
netstat -an|grep 80
```

![1584074775141](picture/1584074775141.png)

![1584074765877](picture/1584074765877.png)

##  4-5 前端资源部署 

前端资源文件要放在html目录下

![1584075159156](picture/1584075159156.png)

测试： http://106.14.105.113/getotp.html 

![1584075418434](picture/1584075418434.png)

##  4-6 前端资源路由 

![1584075756324](picture/1584075756324.png)

在服务器端进行ip映射

```
vim //etc/hosts
```

![1584079764933](picture/1584079764933.png)

---

修改nginx配置文件

```
vim conf/nginx.conf
```

```conf
location /resources/ {
            alias /usr/local/openresty/nginx/html/resources/;
            index  index.html index.htm;
        }

```

alias是替换的作用

![1584080262430](picture/1584080262430.png)

到达html目录下

```
mkdir resources
mv *.html resources/
mv gethost.js resources/
cp -r static resources/
```

修改配置后直接`sbin/nginx -s reload`无缝重启

```
sbin/nginx -s reload
```

![1584081059983](picture/1584081059983.png)

![1584081080430](picture/1584081080430.png)

##  4-7 配置nginx反向代理 

![1584084864888](picture/1584084864888.png)

![1584084889928](picture/1584084889928.png)

1.设置 upstream server

2.设置动态请求 location为proxy pass路径

注意：ip尽量使用局域网ip，端口如果是80，就不用写

​			weight表示权重

（理论上这里的ip是不同的，因为是不同的服务器）

```
vim conf/nginx.conf
```

```
upstream backend_server{
        server 172.19.253.55:9090 weight=1;
        server 172.19.253.55:9091 weight=1;
    }


location / {
            proxy_pass http://backend_server;
            proxy_set_header Host $http_host:$proxy_port;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }


```

![1584086497827](picture/1584086497827.png)

重启nginx

```
sbin/nginx -s reload
```

查看日志是否有报错

```
cd logs/
tail -f error.log
```

![1584087218834](picture/1584087218834.png)

---

检查静态资源是否有问题

![1584087384997](picture/1584087384997.png)

检查动态请求是否有问题

![1584087464537](picture/1584087464537.png)

3.开启 tomcat access log验证

进入miaosha项目

```
cd //var/www/miaosha
```

```
mkdir tomcat
chmod -R 777 tomcat/
```

```
vim application.properties 
```

```properties
server.tomcat.accesslog.enabled=true
server.tomcat.accesslog.directory=/var/www/miaosha/tomcat
server.tomcat.accesslog.pattern=%h %l %u %t "%r" %s %b %D
```

参数解释：

​	%h：remote hostname,也就是远端请求的ip地址

​	%u：远端主机的user

​	%t：处理时长

​	%r：会打印出请求方法，请求的url

​	%s：http的返回状态码

​	%b：response的大小

​	%D：处理请求的时长

---

重启tomcat后，会发现tomcat已生成日志文件

```
tail -f access_log.2020-03-13.log
```

----

![1584120731543](picture/1584120731543.png)

修改gethost.js文件，将ip变为域名

```
vim gethost.js
```

```
var g_host = "miaoshaserver";
```

![1584154945410](picture/1584154945410.png)

![1584154531105](picture/1584154531105.png)

---

##  4-8 分布式扩展后的性能压测 

nginx服务器和客户端保持的是长连接，但是跟后端java程序是短链接，默认是没有keep-alive

---

将nginx服务器与应用服务器的连接改为长连接

```
cd /usr/local/openresty/nginx/
vim conf/nginx.conf
```

![1584165452762](picture/1584165452762.png)

```
keepalive 30;
```

![1584172981875](picture/1584172981875.png)

```
proxy_http_version 1.1;
proxy_set_header Connection "";
```

----

重启nginx

```
sbin/nginx -s reload
```

##  4-9 Nginx高性能原因---epoll多路复用 

![1584173422036](picture/1584173422036.png)

```
1.解决了io阻塞的回调通知的问题
2.平滑的过度，平滑地重启，并且基于worker的单线程模型并且依靠多路复用完成高效的操作
3.将每个用户的请求对应到线程中的每一个协程中，然后在协程中使用多路复用的机制，来完成同步调用的开发，完成高性能的操作
```

![1584173473778](picture/1584173473778.png)

bio模型

![1584173968871](picture/1584173968871.png)

select模型

![1584173995206](picture/1584173995206.png)

epoll模型

![1584174045493](picture/1584174045493.png)

##  4-10 Nginx高性能原因---master-worker进程模型 

![1584174140787](picture/1584174140787.png)

```
master是worker的父进程，master进程可以管理worker进程的内存空间，也就是说master进程可以拥有worker进程的内存空间的内存变量，函数堆栈。甚至socket的文件距离。
worker进程用于与客户端连接的进程

来了http请求，master不处理，交由worker处理。master，work共享内存，所有三个进程去抢占内存锁
```



```
ps -ef|grep nginx
```

![1584174500869](picture/1584174500869.png)

##  4-11 Nginx高性能原因---协程机制 

![1584175461474](picture/1584175461474.png)

```
协程切换的开销非常地小，不像线程一样有cpu的开销，只需要内存的切换开销，协程的运行其实就是线程的运行
```

----



##  4-12 分布式会话课题引入 

![1584175640142](picture/1584175640142.png)

![1584176107455](picture/1584176107455.png)

##   4-13 分布式会话实现（上） 

引入依赖

```xml
<dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.session</groupId>
      <artifactId>spring-session-data-redis</artifactId>
      <version>2.0.5.RELEASE</version>
    </dependency>
```

在config目录下新建文件`RedisConfig`

```java
package com.imooc.miaoshaproject.config;

import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.stereotype.Component;

/**
 * Created by hzllb on 2019/2/10.
 */
@Component
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 3600)
public class RedisConfig {
}

```

安装redis

```
chmod -R 777 redis-4.0.1.tar.gz
tar -xvzf redis-4.0.1.tar.gz -C ~/app/
```

```
cd redis-4.0.1/
make
make install
```

启动

```
cd src/
./redis-server &
```

客户端连接

```
./redis-cli
```

![1584177604112](picture/1584177604112.png)

---

##  4-14 分布式会话实现（中） 

在`application.properties`增加配置

```properties
#配置springboot对redis的依赖
spring.redis.host=127.0.0.1
spring.redis.port=6379
# 默认有16个数据库，这里选用第10个数据库
spring.redis.database=10
#spring.redis.password=

#设置jedis连接池
spring.redis.jedis.pool.max-active=50
spring.redis.jedis.pool.min-idle=20
```

---

在本机启动秒杀项目

![1584179918164](picture/1584179918164.png)

测试

![1584179932156](picture/1584179932156.png)

报错：序列化问题

```
Caused by: org.springframework.core.serializer.support.SerializationFailedException: Failed to serialize object using DefaultSerializer; nested exception is java.lang.IllegalArgumentException: DefaultSerializer requires a Serializable payload but received an object of type [com.imooc.miaoshaproject.service.model.UserModel]
```

解决

![1584180024036](picture/1584180024036.png)

---

![1584180070415](picture/1584180070415.png)

查看redis变化

redis第10个数据库存在键值

----

##   4-15 分布式会话实现（下）

修改redis配置文件

```
vim redis.conf
```

![1584183120946](picture/1584183120946.png)  

启动redis

```
src/redis-server ./redis.conf &
```

将秒杀项目打包上传

修改外挂文件``application.properties``

```properties
# 添加
spring.redis.host=106.14.105.113
```

---

##  4-16 基于token的分布式会话实现（上） 

![1584187861894](picture/1584187861894.png)

修改`UserController`

```java
 @Autowired
private RedisTemplate redisTemplate;




//修改成若用户登录验证成功后将对应的登录信息和登录凭证一起存入redis中

        //生成登录凭证token，UUID
        String uuidToken = UUID.randomUUID().toString();
        uuidToken = uuidToken.replace("-","");
        //建议token和用户登陆态之间的联系
        redisTemplate.opsForValue().set(uuidToken,userModel);
        // 设置超时时间
        redisTemplate.expire(uuidToken,1, TimeUnit.HOURS);

//        this.httpServletRequest.getSession().setAttribute("IS_LOGIN",true);
//        this.httpServletRequest.getSession().setAttribute("LOGIN_USER",userModel);

        //下发了token
        return CommonReturnType.create(uuidToken);
```

![1584188049180](picture/1584188049180.png)

----

##  4-17 基于token的分布式会话实现（下） 

修改前端代码

--修改login.html

![1584188442324](picture/1584188442324.png)

--修改getitem.html

![1584188570433](picture/1584188570433.png)

---

修改OrderController

```java
@Autowired
private RedisTemplate redisTemplate;



//Boolean isLogin = (Boolean) httpServletRequest.getSession().getAttribute("IS_LOGIN");
        String token = httpServletRequest.getParameterMap().get("token")[0];
        if(StringUtils.isEmpty(token)){
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN,"用户还未登陆，不能下单");
        }
        //获取用户的登陆信息
        UserModel userModel = (UserModel) redisTemplate.opsForValue().get(token);
        if(userModel == null){
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN,"用户还未登陆，不能下单");
        }

```

![1584188724310](picture/1584188724310.png)

----

# 第5章 查询性能优化技术之多级缓存【接触高性能缓存方案】

 本章的核心目标是优化商品详情页对应的动态请求的性能。通过多级缓存：redis、guava cache、nginx lua缓存实现了一套削峰的多级缓存方案，优雅的依靠不同的热点分类使用不同类型的多级缓存并设置不同的失效策略，解决动态请求的性能问题。... 

##  5-1 学习目标 

```
本章目标
	掌握多级缓存的定义
	掌握 redis缓存,本地缓存
	掌握热点 nginx lua缓存
```

##  5-2 缓存设计原则概览 

```
缓存设计
	用快速存取设备,用内存
	将缓存推到离用户最近的地方
	脏缓存清理
```

```
多级缓存
	redis缓存
	热点内存本地缓存
	nginx proxy cache缓存
	nginx lua缓存
```

##  5-3 Redis集中式缓存介绍 

架构

![1584248112017](picture/1584248112017.png)

```
redis缓存
	单机版
	sentinal哨兵模式
	集群 cluster模式
```

--sentinal哨兵模式

![1584248390551](picture/1584248390551.png)

![1584248365210](picture/1584248365210.png)

--集群 cluster模式

![1584248632294](picture/1584248632294.png)

![1584248594377](picture/1584248594377.png)

##  5-4 Redis集中式缓存商品详情页接入（上） 

在`ItemController`中添加缓存

```java
@Autowired
private RedisTemplate redisTemplate;


//根据商品的id到redis内获取
            itemModel = (ItemModel) redisTemplate.opsForValue().get("item_"+id);

            //若redis内不存在对应的itemModel,则访问下游service
            if(itemModel == null){
                itemModel = itemService.getItemById(id);
                //设置itemModel到redis内
                redisTemplate.opsForValue().set("item_"+id,itemModel);
                redisTemplate.expire("item_"+id,10, TimeUnit.MINUTES);
```

----

##   5-5 Redis集中式缓存商品详情页接入（下） 

改造`RedisTemplate`

--RedisConfig

```java
package com.imooc.miaoshaproject.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.imooc.miaoshaproject.serializer.JodaDateTimeJsonDeserializer;
import com.imooc.miaoshaproject.serializer.JodaDateTimeJsonSerializer;
import org.joda.time.DateTime;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.stereotype.Component;

/**
 * Created by hzllb on 2019/2/10.
 */
@Component
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 3600)
public class RedisConfig {
    @Bean
    public RedisTemplate redisTemplate(RedisConnectionFactory redisConnectionFactory){
        RedisTemplate redisTemplate = new RedisTemplate();
        redisTemplate.setConnectionFactory(redisConnectionFactory);

        //首先解决key的序列化方式
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        redisTemplate.setKeySerializer(stringRedisSerializer);

        //解决value的序列化方式
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);

        ObjectMapper objectMapper =  new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(DateTime.class,new JodaDateTimeJsonSerializer());
        simpleModule.addDeserializer(DateTime.class,new JodaDateTimeJsonDeserializer());

        objectMapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);

        objectMapper.registerModule(simpleModule);

        jackson2JsonRedisSerializer.setObjectMapper(objectMapper);

        redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);

        return redisTemplate;
    }
}

```

自定义DateTime序列化方式

新建serializer包

--JodaDateTimeJsonSerializer

```java
package com.imooc.miaoshaproject.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.joda.time.DateTime;

import java.io.IOException;

/**
 * Created by hzllb on 2019/2/14.
 */
public class JodaDateTimeJsonSerializer extends JsonSerializer<DateTime> {
    @Override
    public void serialize(DateTime dateTime, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeString(dateTime.toString("yyyy-MM-dd HH:mm:ss"));
    }
}

```

--JodaDateTimeJsonDeserializer

```java
package com.imooc.miaoshaproject.serializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.io.IOException;

/**
 * Created by hzllb on 2019/2/14.
 */
public class JodaDateTimeJsonDeserializer extends JsonDeserializer<DateTime> {
    @Override
    public DateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
        String dateString =jsonParser.readValueAs(String.class);
        DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");

        return DateTime.parse(dateString,formatter);
    }
}

```

---

测试：

浏览器访问 http://localhost:8090/item/get?id=6 

![1584251966482](picture/1584251966482.png)

![1584251932013](picture/1584251932013.png)

----

##  5-6 Redis集中式缓存压测效果验证 

![1584252950351](picture/1584252950351.png)

##  5-7 本地数据热点缓存（上） 

本地缓存就是Java虚拟机的缓存，即jvm的缓存

```
本地热点缓存
	热点数据
	脏读不敏感
	内存可控
```

```
Guava cache
	可控制的大小和超时时间
	可配置的lru策略
	线程安全
```

##  5-8 本地数据热点缓存（下） 

引入依赖

```xml
<dependency>
      <groupId>com.google.guava</groupId>
      <artifactId>guava</artifactId>
      <version>18.0</version>
    </dependency>
```

实现

1.CacheService

```java
package com.imooc.miaoshaproject.service;

/**
 * Created by hzllb on 2019/2/16.
 */
//封装本地缓存操作类
public interface CacheService {
    //存方法
    void setCommonCache(String key,Object value);

    //取方法
    Object getFromCommonCache(String key);
}

```

2.CacheServiceImpl

```java
package com.imooc.miaoshaproject.service.impl;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.imooc.miaoshaproject.service.CacheService;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.concurrent.TimeUnit;

/**
 * Created by hzllb on 2019/2/16.
 */
@Service
public class CacheServiceImpl implements CacheService {

    private Cache<String,Object> commonCache = null;

    @PostConstruct
    public void init(){
        commonCache = CacheBuilder.newBuilder()
                //设置缓存容器的初始容量为10
                .initialCapacity(10)
                //设置缓存中最大可以存储100个KEY,超过100个之后会按照LRU的策略移除缓存项
                .maximumSize(100)
                //设置写缓存后多少秒过期
                .expireAfterWrite(60, TimeUnit.SECONDS).build();
    }

    @Override
    public void setCommonCache(String key, Object value) {
            commonCache.put(key,value);
    }

    @Override
    public Object getFromCommonCache(String key) {
        return commonCache.getIfPresent(key);
    }
}

```

3.修改`ItemController`

```java
@Autowired
private CacheService cacheService;



//先取本地缓存
        itemModel = (ItemModel) cacheService.getFromCommonCache("item_"+id);

        if(itemModel == null){
            //根据商品的id到redis内获取
            itemModel = (ItemModel) redisTemplate.opsForValue().get("item_"+id);

            //若redis内不存在对应的itemModel,则访问下游service
            if(itemModel == null){
                itemModel = itemService.getItemById(id);
                //设置itemModel到redis内
                redisTemplate.opsForValue().set("item_"+id,itemModel);
                redisTemplate.expire("item_"+id,10, TimeUnit.MINUTES);
            }
            //填充本地缓存
            cacheService.setCommonCache("item_"+id,itemModel);
```

---

##   5-9 本地数据热点缓存压测结果验证 

![1584254821876](picture/1584254821876.png)

---

##  5-10 nginx proxy cache缓存实现及压测结果验证 

nginx可以用来做反向代理，统一收口用户第一层的入口请求

```
nginx proxy cache缓存
	nginx反向代理前置
	依靠文件系统存索引级的文件
	依靠内存缓存文件地址
```

```
vim nginx.conf
```

```properties
# 申明一个cache缓存节点的内容
    proxy_cache_path /usr/local/openresty/nginx/tmp_cache levels=1:2 keys_zone=tmp_cache:100m inactive=7d max_size=10g;


proxy_cache tmp_cache;
proxy_cache_key $uri;
proxy_cache_valid 200 206 304 302 7d;

```

![1584256857684](picture/1584256857684.png)

重启nginx

```
sbin/nginx -s reload
```

但是这个并不好用，因为读文件读的是磁盘，而不是内存，所以比较慢

这里我并不会用它

---

##  5-11 nginx lua原理（上） 

```
nginx lua
◆ lua协程机制
◆ nginx协程机制
◆ nginx lua插载点
◆ openResty
```

```
协程机制
	依附于线程的内存模型,切换开销小
	遇阻塞及归还执行权,代码同步
	无需加锁
```

lua脚本

![1584259043285](picture/1584259043285.png)

---

##  5-12 nginx lua原理（中） 

```
nginx协程
	nginx的每一个Worker进程都是在epoll或kqueue这种事件模型之上,封装成协程。
	每一个请求都有一个协程进行处理。
	即使 ngx_lua须要运行Lua,相对C有一定的开销,但依旧能保证高并发能力
```

![1584259574411](picture/1584259574411.png)

![1584259603380](picture/1584259603380.png)



##  5-13 nginx lua原理（下） 

![1584259754732](picture/1584259754732.png)

![1584259817182](picture/1584259817182.png)

##  5-14 Nginx Lua实战 

先关闭nginx

```
pkill -9 nginx
```

---

```
cd //usr/local/openresty
mkdir lua
cd lua
```

```
vim init.lua
```

```lua
ngx.log(ngx.ERR,"init lua success");
```

![1584261638711](picture/1584261638711.png)

```
vim conf/nginx.conf
```

```
init_by_lua_file ../lua/init.lua;
```

![1584262053603](picture/1584262053603.png)

启动nginx

```
cd nginx/
sbin/nginx -c conf/nginx.conf
```

![1584262515773](picture/1584262515773.png)

查看日志

```
cd logs/
tail -f error.log
```

![1584262652310](picture/1584262652310.png)

-----

以上只是测试

```
vim conf/nginx.conf
```

```
location /staticitem/get{
            content_by_lua_file ../lua/staticitem.lua;
        }

```

![1584263316344](picture/1584263316344.png)

```
cd lua
vim staticitem.lua
```

（以http response方式返回一串字符串）

```
ngx.say("hello static item lua");
```

![1584263628876](picture/1584263628876.png)

重启nginx

```
sbin/nginx -s reload
```

测试

浏览器访问 http://106.14.105.113/staticitem/get 

​	返回了一个文件

![1584263858475](picture/1584263858475.png)

----

指定返回样式

```
vim conf/nginx.conf
```

```
default_type "text/html";
```

![1584264008823](picture/1584264008823.png)

重启nginx

```
sbin/nginx -s reload
```

浏览器访问 http://106.14.105.113/staticitem/get 

![1584264084973](picture/1584264084973.png)

---

##  5-15 又见OpenResty 

![1584264215492](picture/1584264215492.png)

![1584264271398](picture/1584264271398.png)

---

##  5-16 OpenResty实战---Hello World 

##  5-17 OpenResty实战---Shared dic 

```
cd nginx
vim conf/nginx.conf
```

```
lua_shared_dict my_cache 128m;
```

![1584264560523](picture/1584264560523.png)

```
cd lua
vim itemsharedic.lua
```

```lua
function get_from_cache(key)
    local cache_ngx = ngx.shared.my_cache
    local value = cache_ngx:get(key)
    return value
end

function set_to_cache(key,value,exptime)
    if not exptime then
        exptime = 0
    end
    local cache_ngx = ngx.shared.my_cache
    local succ,err,forcible = cache_ngx:set(key,value,exptime)
    return succ
end

local args = ngx.req.get_uri_args()
local id = args["id"]
local item_model = get_from_cache("item_"..id)
if item_model == nil then
    local resp = ngx.location.capture("/item/get?id="..id)
    item_model = resp.body
    set_to_cache("item"..id,item_model,1*60)
end
ngx.say(item_model)

```

![1584270549947](picture/1584270549947.png)

----

```
vim conf/nginx.conf
```

```
location /luaitem/get{
  default_type "application/json";
  content_by_lua_file ../lua/itemsharedic.lua;
}
```

![1584268296889](picture/1584268296889.png)

重启nginx

```
sbin/nginx -s reload
```

测试：浏览器 http://106.14.105.113/luaitem/get?id=6 

![1584271262352](picture/1584271262352.png)

---

##   5-18 OpenResty实战---Redis支持 

架构：

![1584271709180](picture/1584271709180.png)

![1584271836896](picture/1584271836896.png)

```
cd //usr/local/openresty/lualib/resty/redis.lua
```

里面包含对redis的操作

---

```
cd lua
vim itemredis.lua
```

```
local args = ngx.req.get_uri_args()
local id = args["id"]
--引入文件
local redis = require "resty.redis"
local cache = redis:new()
local ok,err = cache:connect("106.14.105.113",6379)
local item_model = cache:get("item"..id)
if item_model == ngx.null or item_model == nil then
    local resp = ngx.location.capture("/item/get?id="..id)
    item_model = resp.body
end

ngx.say(item_model)

```

![1584273347604](picture/1584273347604.png)

```
vim nginx/conf/nginx.conf
```

![1584273476012](picture/1584273476012.png)

重启nginx

```
sbin/nginx -s reload
```

----

# 第6章 查询性能优化技术之页面静态化【动态请求加静态页面一同静态化】

 本章讲述了cdn的核心原理并将静态页面部署到cdn上，之后使用了phantomjs的无头浏览器方案实现了将静态请求和动态请求合并一同部署到cdn上，更进一步的将商品详情页的流量能力提升到极致。 

##   6-1 静态资源cdn引入（上） 

![1584274860799](picture/1584274860799.png)

##  6-2 静态资源cdn引入（下） 

```
静态请求CDN
	DNS用 CNAME解析到源站
	回源缓存设置
	强推失效
```

![1584276362025](picture/1584276362025.png)

![1584276517956](picture/1584276517956.png)

![1584276595155](picture/1584276595155.png)

![1584276777823](picture/1584276777823.png)

![1584276862287](picture/1584276862287.png)

![1584276963038](picture/1584276963038.png)

![1584277131795](picture/1584277131795.png)

##  6-3 静态资源cdn深入讲解---Cache Control响应头 

![1584277430969](picture/1584277430969.png)

![1584277464004](picture/1584277464004.png)

![1584277498134](picture/1584277498134.png)

![1584277571494](picture/1584277571494.png)

![1584277616040](picture/1584277616040.png)

![1584277637146](picture/1584277637146.png)

---

##   6-4 静态资源cdn深入讲解---浏览器三种刷新方式 

![1584277832854](picture/1584277832854.png)

![1584277943850](picture/1584277943850.png)

---

##   6-5 静态资源cdn深入讲解---CDN自定义缓存策略 

```
CDN自定义缓存策略
◆可自定义目录过期时间
◆可自定义后缀名过期时间
◆可自定义对应权重
◆可通过界面或api强制cdn对应目录刷新(非保成功)
```

![1584278405802](picture/1584278405802.png)

##   6-6 静态资源cdn深入讲解---静态资源部署策略 

![1584279185035](picture/1584279185035.png)

![1584279243725](picture/1584279243725.png)

![1584279323815](picture/1584279323815.png)

##  6-7 全页面静态化技术引入 

![1584279621709](picture/1584279621709.png)

![1584279836884](picture/1584279836884.png)

![1584279872253](picture/1584279872253.png)

[下载]( https://phantomjs.org/download.html )

![1584281846585](picture/1584281846585.png)

打开phantomjs\bin文件夹，双击运行phantomjs.exe，出现如下界面，那么你就可以运行JS代码了。 

![1584281882424](picture/1584281882424.png)

## 6-8 商品详情页全页面静态化（上） 

![1584280183196](picture/1584280183196.png)

新建`getitem.js`

```js
var page = require("webpage").create();
var fs = require("fs");
page.open("http://miaoshaserver/resources/getitem.html?id=6",function (status) {
    
    console.log("status = " + status);
    setTimeout(function () {
        fs.write("getitem.html",page.content,"w");
        phantom.exit();
    },1000);
});

```

---

##  6-9 商品详情页全页面静态化（下） 

修改`getitem.html`

```js
<input type="hidden" id="isInit" value="0"/>





function hasInit(){
        var isInit = $("#isInit").val();
        return isInit;
    }

    function setHasInit(){
        $("#isInit").val("1");
    }

    function initView(){
        var isInit = hasInit();
        if(isInit == "1"){
            return;
        }
        //获取商品详情
        $.ajax({
            type:"GET",
            url:"http://"+g_host+"/item/get",
            data:{
                "id":getParam("id"),
            },
            xhrFields:{withCredentials:true},
            success:function(data){
                if(data.status == "success"){
                    g_itemVO = data.data;
                    reloadDom();
                    setInterval(reloadDom,1000);
                    setHasInit();
                }else{
                    alert("获取信息失败，原因为"+data.data.errMsg);
                }
            },
            error:function(data){
                alert("获取信息失败，原因为"+data.responseText);
            }
        });
    }





initView();
```

![1584282374728](picture/1584282374728.png)

![1584282405115](picture/1584282405115.png)

![1584282441404](picture/1584282441404.png)

修改`getitem.js`

```js
var page = require("webpage").create();
var fs = require("fs");
page.open("http://miaoshaserver/resources/getitem.html?id=6",function (status) {

    console.log("status = " + status);
    var isInit = "0";
    setInterval(function () {
        if (isInit!="1") {
            page.evaluate(function () {
                initView();
            });
            isInit = page.evaluate(function () {
                return hasInit();
            });
        } else {
            fs.write("getitem.html",page.content,"w");
            phantom.exit();
        }

    },1000);
});

```

---

# 第7章 交易性能优化技术之缓存库存【用缓存解决交易问题】

 本章介绍了下单交易的性能优化技术，通过交易验证缓存的优化，库存缓存模型优化解决了交易流程中繁琐耗性能的验证缓存，并解决数据库库存行锁的问题，同时也引入了缓存与数据库分布式提交过程中不一致的风险 

##   7-1 交易性能瓶颈 

```
本章目标
	掌握高效交易验证方式
	掌握缓存库存模型
```

```
交易性能瓶颈
	jmeter压测
	交易验证完全依赖数据库
	库存行锁
	后置处理逻辑
```

jmeter压测

![1584322697154](picture/1584322697154.png)

![1584322947456](picture/1584322947456.png)

处理逻辑

![1584323192533](picture/1584323192533.png)

##  7-2 交易验证优化 

```
交易验证优化
	用户风控策略优化:策略缓存模型化
	活动校验策略优化:引入活动发布流程模型缓存化,紧急下线能力
```

1.ItemService添加新的方法

```java
//item及promo model缓存模型
    ItemModel getItemByIdInCache(Integer id);
```

2.ItemServiceImpl实现新方法

```java
@Autowired
    private RedisTemplate redisTemplate;





@Override
    public ItemModel getItemByIdInCache(Integer id) {
        ItemModel itemModel = (ItemModel) redisTemplate.opsForValue().get("item_validate_"+id);
        if(itemModel == null){
            itemModel = this.getItemById(id);
            redisTemplate.opsForValue().set("item_validate_"+id,itemModel);
            redisTemplate.expire("item_validate_"+id,10, TimeUnit.MINUTES);
        }
        return itemModel;
    }

```

3.修改OrderServiceImpl

```java
//1.校验下单状态,下单的商品是否存在，用户是否合法，购买数量是否正确
        //ItemModel itemModel = itemService.getItemById(itemId);
        ItemModel itemModel = itemService.getItemByIdInCache(itemId);
```

4.UserService添加新的方法

```java
//通过缓存获取用户对象
    UserModel getUserByIdInCache(Integer id);
```

5.UserServiceImpl实现方法

```java
 @Override
    public UserModel getUserByIdInCache(Integer id) {
        UserModel userModel = (UserModel) redisTemplate.opsForValue().get("user_validate_"+id);
        if(userModel == null){
            userModel = this.getUserById(id);
            redisTemplate.opsForValue().set("usejavar_validate_"+id,userModel);
            redisTemplate.expire("user_validate_"+id,10, TimeUnit.MINUTES);
        }
        return userModel;
    }
```

6.修改OrderServiceImpl

```java
 UserModel userModel = userService.getUserByIdInCache(userId);
```

##   7-3 交易验证优化后jmeter压测验证 

##  7-4 活动缓存库存方案一 

![1584325592189](picture/1584325592189.png)

itemId被大量使用

给itemId加上索引

![1584325209782](picture/1584325209782.png)

```sql
ALTER TABLE item_stock ADD UNIQUE INDEX item_id_index(item_id)
```

![1584325382114](picture/1584325382114.png)

---

```
库存行锁优化
	扣减库存缓存化
	异步同步数据库
	库存数据库最终一致性保证
```

```
扣减库存缓存化
	方案:
	(1)活动发布同步库存进缓存
	(2)下单交易减缓存库存
```

----

**实现扣减库存缓存化**

第一步实现`活动发布同步库存进缓存`

1.PromoService中添加活动发布方法

```java
//活动发布
    void publishPromo(Integer promoId);
```

2.PromoServiceImpl中实现方法

```java
 @Override
    public void publishPromo(Integer promoId) {
        //通过活动id获取活动
        PromoDO promoDO = promoDOMapper.selectByPrimaryKey(promoId);
        if(promoDO.getItemId() == null || promoDO.getItemId().intValue() == 0){
            return;
        }
        ItemModel itemModel = itemService.getItemById(promoDO.getItemId());

        // 活动开始前，商品下架。活动开始后，商品上架
        //将库存同步到redis内
        redisTemplate.opsForValue().set("promo_item_stock_"+itemModel.getId(), itemModel.getStock());

    }
```

3.ItemController中添加新方法

```java
 @RequestMapping(value = "/publishpromo",method = {RequestMethod.GET})
    @ResponseBody
    public CommonReturnType publishpromo(@RequestParam(name = "id")Integer id){
        promoService.publishPromo(id);
        return CommonReturnType.create(null);

    }
```

----



第二步实现`下单交易减缓存库存`

1.ItemServiceImpl修改decreaseStock方法

```java
@Override
    @Transactional
    public boolean decreaseStock(Integer itemId, Integer amount) throws BusinessException {
        //int affectedRow =  itemStockDOMapper.decreaseStock(itemId,amount);
        long result = redisTemplate.opsForValue().increment("promo_item_stock_"+itemId,amount.intValue() * -1);
        if(result >0){
            //更新库存成功
            return true;
        }else if(result == 0){
            //打上库存已售罄的标识
            redisTemplate.opsForValue().set("promo_item_stock_invalid_"+itemId,"true");

            //更新库存成功
            return true;
        }else{
            //更新库存失败
            increaseStock(itemId,amount);
            return false;
        }

    }
```

![1584326356300](picture/1584326356300.png)

----

##  7-5 活动缓存库存方案二（上） 

```
异步同步数据库
    方案:
    (1)活动发布同步库存进缓存
    (2)下单交易减缓存库存
    (3)异步消息扣减数据库内库存
```

```
异步消息队列 rocketmq
    高性能,高并发,分布式消息中间件
    典型应用场景:分布式事务异步解耦
```

rocketmq是阿里巴巴根据Kafka改造的

![1584327289512](picture/1584327289512.png)

![1584327734288](picture/1584327734288.png)

##  7-6 活动缓存库存方案二（下） 

![1584328014710](picture/1584328014710.png)

![1584328040268](picture/1584328040268.png)

![1584328358511](picture/1584328358511.png)

----

 ##  7-7 rocketmq安装 

[官网]( http://rocketmq.apache.org/docs/quick-start/ )

```
wget https://archive.apache.org/dist/rocketmq/4.6.1/rocketmq-all-4.6.1-bin-release.zip
chmod 777 rocketmq-all-4.6.1-bin-release.zip
```

```
yum install unzip
unzip rocketmq-all-4.6.1-bin-release.zip
```

Start Name Server

```
nohup sh bin/mqnamesrv &
tail -f ~/logs/rocketmqlogs/namesrv.log
```

Start Broker

```
nohup sh bin/mqbroker -n localhost:9876 &
tail -f ~/logs/rocketmqlogs/broker.log 
```

---

##   7-8 缓存库存接入异步化

1.application. properties 添加配置

```properties
mq.nameserver.addr=115.28.67.199:9876
mq.topicname=TopicTest
```

2.引入依赖

```xml
<dependency>
        <groupId>org.apache.rocketmq</groupId>
        <artifactId>rocketmq-client</artifactId>
        <version>4.3.0</version>
    </dependency>
```

2.新建mq目录

--MqConsumer

--MqProducer

3.ItemServiceImpl调用MqProducer方法

----

```
异步同步数据库
    问题:
    (1)异步消息发送失败
    (2)扣减操作执行失败
    (3)下单失败无法正确回补库存
```

---

# 第8章 交易性能优化技术之事务型消息【保证最终一致性的利器】

 本章延续之前缓存库存所引入的事务不一致的问题，使用了异步化的事务型消息解决了最终一致性的问题，同时引入库存售罄这样的方案解决过载击穿的问题。 

##  8-1 事务型消息（上） 

```
本章目标
    掌握异步化事务型消息模型
    掌握库存售罄模型
```

1.在ItemService中添加方法

```java
//异步更新库存
    boolean asyncDecreaseStock(Integer itemId,Integer amount);

//库存回补
    boolean increaseStock(Integer itemId,Integer amount)throws BusinessException;
```

2.ItemServiceImpl实现方法

```java
 @Override
    public boolean asyncDecreaseStock(Integer itemId, Integer amount) {
        boolean mqResult = mqProducer.asyncReduceStock(itemId,amount);
        return mqResult;
    }

@Override
    public boolean increaseStock(Integer itemId, Integer amount) throws BusinessException {
        redisTemplate.opsForValue().increment("promo_item_stock_"+itemId,amount.intValue());
        return true;
    }
```

3.当前面所有的事务都执行完，最后再发异步更新库存的操作

![1584336523105](picture/1584336523105.png)

##   8-2 事务型消息应用（下） 

使用rocketmq的事务型消息

MqProducer

```java
package com.imooc.miaoshaproject.mq;

import com.alibaba.fastjson.JSON;
import com.imooc.miaoshaproject.dao.StockLogDOMapper;
import com.imooc.miaoshaproject.dataobject.StockLogDO;
import com.imooc.miaoshaproject.error.BusinessException;
import com.imooc.miaoshaproject.service.OrderService;
import org.apache.rocketmq.client.exception.MQBrokerException;
import org.apache.rocketmq.client.exception.MQClientException;
import org.apache.rocketmq.client.producer.*;
import org.apache.rocketmq.common.message.Message;
import org.apache.rocketmq.common.message.MessageExt;
import org.apache.rocketmq.remoting.exception.RemotingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by hzllb on 2019/2/23.
 */
@Component
public class MqProducer {

    private DefaultMQProducer producer;

    private TransactionMQProducer transactionMQProducer;

    @Value("${mq.nameserver.addr}")
    private String nameAddr;

    @Value("${mq.topicname}")
    private String topicName;


    @Autowired
    private OrderService orderService;

    @Autowired
    private StockLogDOMapper stockLogDOMapper;

    @PostConstruct
    public void init() throws MQClientException {
        //做mq producer的初始化
        producer = new DefaultMQProducer("producer_group");
        producer.setNamesrvAddr(nameAddr);
        producer.start();

        transactionMQProducer = new TransactionMQProducer("transaction_producer_group");
        transactionMQProducer.setNamesrvAddr(nameAddr);
        transactionMQProducer.start();

        transactionMQProducer.setTransactionListener(new TransactionListener() {
            @Override
            public LocalTransactionState executeLocalTransaction(Message msg, Object arg) {
                //真正要做的事  创建订单
                Integer itemId = (Integer) ((Map)arg).get("itemId");
                Integer promoId = (Integer) ((Map)arg).get("promoId");
                Integer userId = (Integer) ((Map)arg).get("userId");
                Integer amount = (Integer) ((Map)arg).get("amount");
                String stockLogId = (String) ((Map)arg).get("stockLogId");
                try {
                    orderService.createOrder(userId,itemId,promoId,amount,stockLogId);
                } catch (BusinessException e) {
                    e.printStackTrace();
                    //设置对应的stockLog为回滚状态
                    StockLogDO stockLogDO = stockLogDOMapper.selectByPrimaryKey(stockLogId);
                    stockLogDO.setStatus(3);
                    stockLogDOMapper.updateByPrimaryKeySelective(stockLogDO);
                    return LocalTransactionState.ROLLBACK_MESSAGE;
                }
                return LocalTransactionState.COMMIT_MESSAGE;
            }

            @Override
            public LocalTransactionState checkLocalTransaction(MessageExt msg) {
                //根据是否扣减库存成功，来判断要返回COMMIT,ROLLBACK还是继续UNKNOWN
                String jsonString  = new String(msg.getBody());
                Map<String,Object>map = JSON.parseObject(jsonString, Map.class);
                Integer itemId = (Integer) map.get("itemId");
                Integer amount = (Integer) map.get("amount");
                String stockLogId = (String) map.get("stockLogId");
                StockLogDO stockLogDO = stockLogDOMapper.selectByPrimaryKey(stockLogId);
                if(stockLogDO == null){
                    return LocalTransactionState.UNKNOW;
                }
                if(stockLogDO.getStatus().intValue() == 2){
                    return LocalTransactionState.COMMIT_MESSAGE;
                }else if(stockLogDO.getStatus().intValue() == 1){
                    return LocalTransactionState.UNKNOW;
                }
                return LocalTransactionState.ROLLBACK_MESSAGE;
            }
        });
    }

    //事务型同步库存扣减消息
    public boolean transactionAsyncReduceStock(Integer userId,Integer itemId,Integer promoId,Integer amount,String stockLogId){
        Map<String,Object> bodyMap = new HashMap<>();
        bodyMap.put("itemId",itemId);
        bodyMap.put("amount",amount);
        bodyMap.put("stockLogId",stockLogId);

        Map<String,Object> argsMap = new HashMap<>();
        argsMap.put("itemId",itemId);
        argsMap.put("amount",amount);
        argsMap.put("userId",userId);
        argsMap.put("promoId",promoId);
        argsMap.put("stockLogId",stockLogId);

        Message message = new Message(topicName,"increase",
                JSON.toJSON(bodyMap).toString().getBytes(Charset.forName("UTF-8")));
        TransactionSendResult sendResult = null;
        try {

            sendResult = transactionMQProducer.sendMessageInTransaction(message,argsMap);
        } catch (MQClientException e) {
            e.printStackTrace();
            return false;
        }
        if(sendResult.getLocalTransactionState() == LocalTransactionState.ROLLBACK_MESSAGE){
            return false;
        }else if(sendResult.getLocalTransactionState() == LocalTransactionState.COMMIT_MESSAGE){
            return true;
        }else{
            return false;
        }

    }

    //同步库存扣减消息
    public boolean asyncReduceStock(Integer itemId,Integer amount)  {
        Map<String,Object> bodyMap = new HashMap<>();
        bodyMap.put("itemId",itemId);
        bodyMap.put("amount",amount);

        Message message = new Message(topicName,"increase",
                JSON.toJSON(bodyMap).toString().getBytes(Charset.forName("UTF-8")));
        try {
            producer.send(message);
        } catch (MQClientException e) {
            e.printStackTrace();
            return false;
        } catch (RemotingException e) {
            e.printStackTrace();
            return false;
        } catch (MQBrokerException e) {
            e.printStackTrace();
            return false;
        } catch (InterruptedException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}

```

---

##   8-3 库存流水状态（1） 

```
异步同步数据库
    问题:
    (1)异步消息发送失败
    (2)扣减操作执行失败
    (3)下单失败无法正确回补库存
```

```
操作流水
    问题本质:
    没有库存操作流水
```

![1584346714361](picture/1584346714361.png)

操作流水：记录进行了哪些操作

1.新建表`stock_log`,用来做库存流水型数据

```sql
CREATE TABLE `stock_log` (
  `stock_log_id` varchar(64) NOT NULL,
  `item_id` int(11) NOT NULL DEFAULT '0',
  `amount` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '//1表示初始状态，2表示下单扣减库存成功，3表示下单回滚',
  PRIMARY KEY (`stock_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

2.mybatis生成相应类

`mybatis-generator.xml`

```xml
<table tableName="stock_log"  domainObjectName="StockLogDO" enableCountByExample="false"
               enableUpdateByExample="false" enableDeleteByExample="false"
               enableSelectByExample="false" selectByExampleQueryId="false"></table>
```

3.ItemService新增方法

```java
//初始化库存流水
    String initStockLog(Integer itemId,Integer amount);
```

##   8-4 库存流水状态（2） 

1.ItemServiceImpl实现方法

```java
//初始化对应的库存流水
    @Override
    @Transactional
    public String initStockLog(Integer itemId, Integer amount) {
        StockLogDO stockLogDO = new StockLogDO();
        stockLogDO.setItemId(itemId);
        stockLogDO.setAmount(amount);
        stockLogDO.setStockLogId(UUID.randomUUID().toString().replace("-",""));
        stockLogDO.setStatus(1);

        stockLogDOMapper.insertSelective(stockLogDO);

        return stockLogDO.getStockLogId();

    }
```

2.OrderController

```java
//加入库存流水init状态
        String stockLogId = itemService.initStockLog(itemId,amount);


        //再去完成对应的下单事务型消息机制
        if(!mqProducer.transactionAsyncReduceStock(userModel.getId(),itemId,promoId,amount,stockLogId)){
            throw new BusinessException(EmBusinessError.UNKNOWN_ERROR,"下单失败");
        }
        return CommonReturnType.create(null);
```

---

## 8-5 库存流水状态（3） 

1.OrderServiceImpl

```java
//设置库存流水状态为成功
        StockLogDO stockLogDO = stockLogDOMapper.selectByPrimaryKey(stockLogId);
        if(stockLogDO == null){
            throw new BusinessException(EmBusinessError.UNKNOWN_ERROR);
        }
        stockLogDO.setStatus(2);
        stockLogDOMapper.updateByPrimaryKeySelective(stockLogDO);

```

---

##  8-6 库存流水状态（4） 

```
库存数据库最终一致性保证
    方案:
    (1)引入库存操作流水
    (2)引入事务性消息机制
    ◆问题:
	(1) redis不可用时如何处理
	(2)扣减流水错误如何处理
```

```
业务场景决定高可用技术实现
    设计原则:
    宁可少卖,不能超卖(有的商家采取的是宁可多买)
    方案:
    (1) redis可以比实际数据库中少
    (2)超时释放
```

##   8-7 库存售罄处理方案 

```
库存售罄
    库存售罄标识
    售罄后不去操作后续流程
    售罄后通知各系统售罄
    回补上新
```

1.ItemServiceImpl

```java
 @Override
    @Transactional
    public boolean decreaseStock(Integer itemId, Integer amount) throws BusinessException {
        //int affectedRow =  itemStockDOMapper.decreaseStock(itemId,amount);
        long result = redisTemplate.opsForValue().increment("promo_item_stock_"+itemId,amount.intValue() * -1);
        if(result >0){
            //更新库存成功
            return true;
        }else if(result == 0){
            //打上库存已售罄的标识
            redisTemplate.opsForValue().set("promo_item_stock_invalid_"+itemId,"true");

            //更新库存成功
            return true;
        }else{
            //更新库存失败
            increaseStock(itemId,amount);
            return false;
        }

    }
```

![1584349543930](picture/1584349543930.png)

2.OrderController

```java
//判断是否库存已售罄，若对应的售罄key存在，则直接返回下单失败
        if(redisTemplate.hasKey("promo_item_stock_invalid_"+itemId)){
            throw new BusinessException(EmBusinessError.STOCK_NOT_ENOUGH);
        }
```

---

##  8-8 后置流程总结 

```
后置流程
    销量逻辑异步化
    交易单逻辑异步化
```

```
交易单逻辑异步化
    生成交易单 sequence后直接异步返回
    前端轮询异步单状态
```

# 第9章 流量削峰技术【削峰填谷之神级操作】

 即便查询优化，交易优化技术用到极致后，只要外部的流量超过了系统可承载的范围就有拖垮系统的风险。本章通过秒杀令牌，秒杀大闸，队列泄洪等流量削峰技术解决全站的流量高性能运行效率。 

##  9-1 流量削峰技术引入 

```
本章目标
    掌握秒杀令牌的原理和使用方式
    掌握秒杀大闸的原理和使用方式
    掌握队列泄洪的原理和使用方式
```

##  9-2 秒杀令牌实现（上） 

```
抛缺陷
    秒杀下单接口会被脚本不停的刷
    秒杀验证逻辑和秒杀下单接口强关联,代码冗余度高
    秒杀验证逻辑复杂,对交易系统产生无关联负载
```

```
秒杀令牌原理
    秒杀接口需要依靠令牌才能进入
    秒杀的令牌由秒杀活动模块负责生成
    秒杀活动模块对秒杀令牌生成全权处理,逻辑收口
    秒杀下单前需要先获得秒杀令牌
```

代码实现：

1.PromoService中新增方法

```java
//生成秒杀用的令牌
    String generateSecondKillToken(Integer promoId,Integer itemId,Integer userId);
```

2.PromoServiceImpl实现方法

```java
 @Override
    public String generateSecondKillToken(Integer promoId,Integer itemId,Integer userId) {

        //判断是否库存已售罄，若对应的售罄key存在，则直接返回下单失败
        if(redisTemplate.hasKey("promo_item_stock_invalid_"+itemId)){
            return null;
        }
        PromoDO promoDO = promoDOMapper.selectByPrimaryKey(promoId);

        //dataobject->model
        PromoModel promoModel = convertFromDataObject(promoDO);
        if(promoModel == null){
            return null;
        }

        //判断当前时间是否秒杀活动即将开始或正在进行
        if(promoModel.getStartDate().isAfterNow()){
            promoModel.setStatus(1);
        }else if(promoModel.getEndDate().isBeforeNow()){
            promoModel.setStatus(3);
        }else{
            promoModel.setStatus(2);
        }
        //判断活动是否正在进行
        if(promoModel.getStatus().intValue() != 2){
            return null;
        }
        //判断item信息是否存在
        ItemModel itemModel = itemService.getItemByIdInCache(itemId);
        if(itemModel == null){
            return null;
        }
        //判断用户信息是否存在
        UserModel userModel = userService.getUserByIdInCache(userId);
        if(userModel == null){
            return null;
        }

        //获取秒杀大闸的count数量
        long result = redisTemplate.opsForValue().increment("promo_door_count_"+promoId,-1);
        if(result < 0){
            return null;
        }
        //生成token并且存入redis内并给一个5分钟的有效期
        String token = UUID.randomUUID().toString().replace("-","");

        redisTemplate.opsForValue().set("promo_token_"+promoId+"_userid_"+userId+"_itemid_"+itemId,token);
        redisTemplate.expire("promo_token_"+promoId+"_userid_"+userId+"_itemid_"+itemId,5, TimeUnit.MINUTES);

        return token;
    }

```

3.OrderController

```java
//生成秒杀令牌
    @RequestMapping(value = "/generatetoken",method = {RequestMethod.POST},consumes={CONTENT_TYPE_FORMED})
    @ResponseBody
    public CommonReturnType generatetoken(@RequestParam(name="itemId")Integer itemId,
                                        @RequestParam(name="promoId")Integer promoId) throws BusinessException {
        //根据token获取用户信息
        String token = httpServletRequest.getParameterMap().get("token")[0];
        if(StringUtils.isEmpty(token)){
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN,"用户还未登陆，不能下单");
        }
        //获取用户的登陆信息
        UserModel userModel = (UserModel) redisTemplate.opsForValue().get(token);
        if(userModel == null){
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN,"用户还未登陆，不能下单");
        }
        //获取秒杀访问令牌
        String promoToken = promoService.generateSecondKillToken(promoId,itemId,userModel.getId());

        if(promoToken == null){
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR,"生成令牌失败");
        }
        //返回对应的结果
        return CommonReturnType.create(promoToken);
    }






// 校验秒杀令牌是否正确
        String token = httpServletRequest.getParameterMap().get("token")[0];


//校验秒杀令牌是否正确
        if(promoId != null){
            String inRedisPromoToken = (String) redisTemplate.opsForValue().get("promo_token_"+promoId+"_userid_"+userModel.getId()+"_itemid_"+itemId);
            if(inRedisPromoToken == null){
                throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR,"秒杀令牌校验失败");
            }
            if(!org.apache.commons.lang3.StringUtils.equals(promoToken,inRedisPromoToken)){
                throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR,"秒杀令牌校验失败");
            }
        }
```

![1584353352872](picture/1584353352872.png)

---

##  9-3 秒杀令牌实现（下） 

修改前端代码

--修改`getitem.html`

```js
$.ajax({
				type:"POST",
				contentType:"application/x-www-form-urlencoded",
				url:"http://"+g_host+"/order/generatetoken?token="+token,
				data:{
					"itemId":g_itemVO.id,
					"promoId":g_itemVO.promoId
				},
				xhrFields:{withCredentials:true},
				success:function(data){
					if(data.status == "success"){
						var promoToken = data.data;
						$.ajax({
							type:"POST",
							contentType:"application/x-www-form-urlencoded",
							url:"http://"+g_host+"/order/createorder?token="+token,
							data:{
								"itemId":g_itemVO.id,
								"amount":1,
								"promoId":g_itemVO.promoId,
								"promoToken":promoToken
							},
							xhrFields:{withCredentials:true},
							success:function(data){
								if(data.status == "success"){
									alert("下单成功");
									window.location.reload();
								}else{
									alert("下单失败，原因为"+data.data.errMsg);
									if(data.data.errCode == 20003){
										window.location.href="login.html";
									}
								}
							},
							error:function(data){
								alert("下单失败，原因为"+data.responseText);
							}
						});


					}else{
						alert("获取令牌失败，原因为"+data.data.errMsg);
								if(data.data.errCode == 20003){
										window.location.href="login.html";
									}
					}
				},
				error:function(data){
					alert("获取令牌失败，原因为"+data.responseText);
				}
			});
```

```
缺陷
	秒杀令牌只要活动一开始就无限制生成,影响系统性能
```

---

##  9-4 秒杀大闸原理及实现 

```
秒杀大闸原理
    依靠秒杀令牌的授权原理定制化发牌逻辑,做到大闸功能
    根据秒杀商品初始库存颁发对应数量令牌,控制大闸流量
    用户风控策略前置到秒杀令牌发放中
    库存售罄判断前置到秒杀令牌发放中
```

代码实现：

1.PromoServiceImpl

根据秒杀商品初始库存颁发对应数量令牌,控制大闸流量

```java
//将大闸的限制数字设到redis内
        redisTemplate.opsForValue().set("promo_door_count_"+promoId,itemModel.getStock().intValue() * 5);



 //获取秒杀大闸的count数量
        long result = redisTemplate.opsForValue().increment("promo_door_count_"+promoId,-1);
        if(result < 0){
            return null;
        }
```

库存售罄判断前置到秒杀令牌发放中

```java
//判断是否库存已售罄，若对应的售罄key存在，则直接返回下单失败
        if(redisTemplate.hasKey("promo_item_stock_invalid_"+itemId)){
            return null;
        }
```

---

```
抛缺陷
    浪涌流量涌入后系统无法应对
    多库存,多商品等令牌限制能力弱
```

##  9-5 队列泄洪原理 

```
队列泄洪原理
    排队有些时候比并发更高效(例如 redis单线程模型,innodb mutex key等)
    依靠排队去限制并发流量
    依靠排队和下游拥塞窗口程度调整队列释放流量大小
    支付宝银行网关队列举例（支付宝有很高处理并发的能力，但下游银行没有）
```

##   9-6 队列泄洪实现 

1.OrderController

```java
 private ExecutorService executorService;

    @PostConstruct
    public void init(){
        executorService = Executors.newFixedThreadPool(20);

    }





//同步调用线程池的submit方法
        //拥塞窗口为20的等待队列，用来队列化泄洪
        Future<Object> future = executorService.submit(new Callable<Object>() {

            @Override
            public Object call() throws Exception {
                //加入库存流水init状态
                String stockLogId = itemService.initStockLog(itemId,amount);


                //再去完成对应的下单事务型消息机制
                if(!mqProducer.transactionAsyncReduceStock(userModel.getId(),itemId,promoId,amount,stockLogId)){
                    throw new BusinessException(EmBusinessError.UNKNOWN_ERROR,"下单失败");
                }
                return null;
            }
        });

        try {
            future.get();
        } catch (InterruptedException e) {
            throw new BusinessException(EmBusinessError.UNKNOWN_ERROR);
        } catch (ExecutionException e) {
            throw new BusinessException(EmBusinessError.UNKNOWN_ERROR);
        }


```

##  9-7 本地或分布式 

```
本地or分布式
    本地:将队列维护在本地内存中
    分布式:将队列设置到外部 redis内
```

# 第10章 防刷限流技术【保护系统，免于过载】

 本章介绍了常见的黄牛入侵手段，以及如何使用对应的防刷手段防止黄牛入侵。同时业务的发展预估永远可能高于系统可承载的能力，因此介绍了使用多种限流技术保证系统的稳定。 

##  10-1 防刷限流技术总章介绍 

```
本章目标
    掌握验证码生成与验证技术
    掌握限流原理与实现
    掌握防黄牛技术
```

##  10-2 验证码技术（上） 

```
验证码
    包装秒杀令牌前置,需要验证码来错峰
    数学公式验证码生成器	
```

代码实现：

1.生成验证码

--新建util目录，该目录下新建`CodeUtil`文件

```java
package com.imooc.miaoshaproject.util;

/**
 * Created by hzllb on 2019/3/9.
 */

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.imageio.ImageIO;

public class CodeUtil {
    private static int width = 90;// 定义图片的width
    private static int height = 20;// 定义图片的height
    private static int codeCount = 4;// 定义图片上显示验证码的个数
    private static int xx = 15;
    private static int fontHeight = 18;
    private static  int codeY = 16;
    private static char[] codeSequence = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

    /**
     * 生成一个map集合
     * code为生成的验证码
     * codePic为生成的验证码BufferedImage对象
     * @return
     */
    public static Map<String,Object> generateCodeAndPic() {
        // 定义图像buffer
        BufferedImage buffImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        // Graphics2D gd = buffImg.createGraphics();
        // Graphics2D gd = (Graphics2D) buffImg.getGraphics();
        Graphics gd = buffImg.getGraphics();
        // 创建一个随机数生成器类
        Random random = new Random();
        // 将图像填充为白色
        gd.setColor(Color.WHITE);
        gd.fillRect(0, 0, width, height);

        // 创建字体，字体的大小应该根据图片的高度来定。
        Font font = new Font("Fixedsys", Font.BOLD, fontHeight);
        // 设置字体。
        gd.setFont(font);

        // 画边框。
        gd.setColor(Color.BLACK);
        gd.drawRect(0, 0, width - 1, height - 1);

        // 随机产生40条干扰线，使图象中的认证码不易被其它程序探测到。
        gd.setColor(Color.BLACK);
        for (int i = 0; i < 30; i++) {
            int x = random.nextInt(width);
            int y = random.nextInt(height);
            int xl = random.nextInt(12);
            int yl = random.nextInt(12);
            gd.drawLine(x, y, x + xl, y + yl);
        }

        // randomCode用于保存随机产生的验证码，以便用户登录后进行验证。
        StringBuffer randomCode = new StringBuffer();
        int red = 0, green = 0, blue = 0;

        // 随机产生codeCount数字的验证码。
        for (int i = 0; i < codeCount; i++) {
            // 得到随机产生的验证码数字。
            String code = String.valueOf(codeSequence[random.nextInt(36)]);
            // 产生随机的颜色分量来构造颜色值，这样输出的每位数字的颜色值都将不同。
            red = random.nextInt(255);
            green = random.nextInt(255);
            blue = random.nextInt(255);

            // 用随机产生的颜色将验证码绘制到图像中。
            gd.setColor(new Color(red, green, blue));
            gd.drawString(code, (i + 1) * xx, codeY);

            // 将产生的四个随机数组合在一起。
            randomCode.append(code);
        }
        Map<String,Object> map  =new HashMap<String,Object>();
        //存放验证码
        map.put("code", randomCode);
        //存放生成的验证码BufferedImage对象
        map.put("codePic", buffImg);
        return map;
    }

    public static void main(String[] args) throws Exception {
        //创建文件输出流对象
        OutputStream out = new FileOutputStream(""+System.currentTimeMillis()+".jpg");
        Map<String,Object> map = CodeUtil.generateCodeAndPic();
        ImageIO.write((RenderedImage) map.get("codePic"), "jpeg", out);
        System.out.println("验证码的值为："+map.get("code"));
    }
}

```

2.OrderController

```java
//生成验证码
    @RequestMapping(value = "/generateverifycode",method = {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public void generateverifycode(HttpServletResponse response) throws BusinessException, IOException {
        String token = httpServletRequest.getParameterMap().get("token")[0];
        if(StringUtils.isEmpty(token)){
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN,"用户还未登陆，不能生成验证码");
        }
        UserModel userModel = (UserModel) redisTemplate.opsForValue().get(token);
        if(userModel == null){
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN,"用户还未登陆，不能生成验证码");
        }

        Map<String,Object> map = CodeUtil.generateCodeAndPic();

        redisTemplate.opsForValue().set("verify_code_"+userModel.getId(),map.get("code"));
        redisTemplate.expire("verify_code_"+userModel.getId(),10,TimeUnit.MINUTES);

        ImageIO.write((RenderedImage) map.get("codePic"), "jpeg", response.getOutputStream());


    }


    //生成秒杀令牌
    @RequestMapping(value = "/generatetoken",method = {RequestMethod.POST},consumes={CONTENT_TYPE_FORMED})
    @ResponseBody
    public CommonReturnType generatetoken(@RequestParam(name="itemId")Integer itemId,
                                        @RequestParam(name="promoId")Integer promoId,
                                          @RequestParam(name="verifyCode")String verifyCode) throws BusinessException {
        //根据token获取用户信息
        String token = httpServletRequest.getParameterMap().get("token")[0];
        if(StringUtils.isEmpty(token)){
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN,"用户还未登陆，不能下单");
        }
        //获取用户的登陆信息
        UserModel userModel = (UserModel) redisTemplate.opsForValue().get(token);
        if(userModel == null){
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN,"用户还未登陆，不能下单");
        }

        //通过verifycode验证验证码的有效性
        String redisVerifyCode = (String) redisTemplate.opsForValue().get("verify_code_"+userModel.getId());
        if(StringUtils.isEmpty(redisVerifyCode)){
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR,"请求非法");
        }
        if(!redisVerifyCode.equalsIgnoreCase(verifyCode)){
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR,"请求非法，验证码错误");
        }

        //获取秒杀访问令牌
        String promoToken = promoService.generateSecondKillToken(promoId,itemId,userModel.getId());

        if(promoToken == null){
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR,"生成令牌失败");
        }
        //返回对应的结果
        return CommonReturnType.create(promoToken);
    }
```

##  10-3 验证码技术（下） 

![1584363828679](picture/1584363828679.png)

浏览器访问： http://localhost:8090/order/generateverifycode?token=35d0be10933b4227886439577de305ad 

![1584364663034](picture/1584364663034.png)

---

修改前端代码

--getitem.html

```html
<div id="verifyDiv" style="display:none;" class="form-actions">
			<img src=""/>
			<input type="text" id="verifyContent" value=""/>
			<button class="btn blue" id="verifyButton" type="submit">
				验证
			</button>	
		</div>
```

```js
$("#verifyDiv img").attr("src","http://"+g_host+"/order/generateverifycode?token="+token);
			$("#verifyDiv").show();
```



##  10-4 限流目的介绍 

```
限流目的
    流量远比你想的要多
    系统活着比挂了要好
    宁愿只让少数人能用,也不要让所有人不能用
```

##  10-5 限流方案 

TPS:用来衡量对数据库会产生写操作，transaction操作的一个容量指标

QPS:查询每秒数量的指标

```
限流方案
    限并发
    令牌桶算法
    漏桶算法
```

##  10-6 限流代码实现 

令牌桶算法

![1584366440964](picture/1584366440964.png)

漏桶算法

![1584366604740](picture/1584366604740.png)

```
令牌桶算法:限制每一秒的流量的最大值，可以应对一些突发的流量
漏桶算法:是用来平滑网络流量，以固定的速率流入
互联网行业用的最多的还是令牌桶算法
```

```
限流力度
    接口维度
    总维度
```

```
限流范围
◆集群限流:依赖 redis或其他的中间件技术做统一计数器,往往会产生性能瓶颈
◆单机限流:负载均衡的前提下单机平均限流效果更好
```

---

代码实现：

1.OrderController

```java
private RateLimiter orderCreateRateLimiter;

    @PostConstruct
    public void init(){
        executorService = Executors.newFixedThreadPool(20);

        orderCreateRateLimiter = RateLimiter.create(300);

    }




if(orderCreateRateLimiter.acquire() <= 0){
            throw new BusinessException(EmBusinessError.RATELIMIT);
        }
```

----

# 第11章 课程总结【回顾与展望】

 本章主要对课程所介绍的内容做总结，列出所涉及到的关键知识点，回顾电商秒杀系统，并提出问题以及扩展方案。 

![1584367560211](picture/1584367560211.png)

```
项目框架回顾
    项目结构分层、业务逻辑分层、领域模型分层
    代码实战中成长,并发现问题
    业务编码过程中需要思考性能问题
```

```
性能压测框架
    云端部署体验企业级开发流程
    容器优化通用方案,管道优化通用方案
```

```
分布式扩展
	负载均衡设计
	水平扩展vs垂直扩展
```

```
查询优化技术之多级缓存
    多级缓存屏障系统
    读不到脏读
    越近越好的缓存
```

```
查询优化技术之页面静态化
    CDN的美妙设计	
    一切皆页面,一切皆静态
```

```
交易优化技术之缓存库存
    交易验证:性能和正确性的权衡
    库存模型:性能和可用性的权衡
```

```
交易优化技术之事务型消息
    ACID vs CAP & BASE
    最终一致性方案
```

```
流量错峰技术
    防浪费
    防洪峰、防击穿
    排队
```

```
防刷限流
    错峰
    限流
    防黄牛
```

---

