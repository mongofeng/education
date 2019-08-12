#!/bin/bash



# 部署的服务器的地址
DELOY_SERVER=root@118.31.227.99

# 前端部署的地址
DELOY_ROOT_PATH=/root/docker/nginx/html/

# 部署的目录
DEOLY_PATH=platform


echo 开始打包的操作
npm run build

if [ $? -eq 0 ]; then
    echo "编译成功"
else
    echo "编译失败退出"
    exit 1
fi
echo 部署执行后的文件

echo 登录操作服务器
dir=${DELOY_ROOT_PATH}${DEOLY_PATH}
echo "删除目标文件夹:$dir下的所有文件"
ssh $DELOY_SERVER "rm -rf $dir"

echo 拷贝文件夹
target=${DELOY_SERVER}:${DELOY_ROOT_PATH}${DEOLY_PATH}
echo ${target}
scp -r build ${target}

echo 部署成功
