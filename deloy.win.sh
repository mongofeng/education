#!/bin/bash

# 部署的服务器的地址
deloy_server=root@120.79.208.201

# 前端部署的地址
deloy_root_path=/opt/docker-file/nginx/html/

# 部署的目录
deloy_path=platform

# 打包的目录
build_path=build


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
dir=${deloy_root_path}${deloy_path}
echo "删除目标文件夹下的所有文件:$dir"
ssh -i ~/.ssh/pk_rsa.pem  ${deloy_server} "rm -rf $dir"

echo 拷贝文件夹
target=${deloy_server}:${dir}
echo "拷贝文件夹到目录下:${target}"
scp -i  ~/.ssh/pk_rsa.pem  -r $build_path $target

echo 部署成功
