# CallingU-iOS
The iOS App of CallingU. 


·项目配置（需要mac和xcode）

本地新建项目文件夹，在目录下参考React Native官方网站 https://reactnative.cn/docs/0.51/getting-started.html 配置RN环境

下载所有文件至目录下，用xcode打开ios文件夹下Apps.xcodeproj文件，选择任意11.3版本手机模拟器即可运行


·内容描述

缺乏导航功能  初步构思的最简单的解决方案：用object-c写一个原生导航页面，然后利用rn和ios原生的交互，从rn页面跳转至object-c页面，但是按照官方配置的百度导航sdk环境存在问题无法解决


引导页、app载入界面、登录、注册页面均被注释掉，需要启用时进入App.js导航配置文件取消注释
