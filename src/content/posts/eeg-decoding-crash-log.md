---
title: 这一周我跑崩了七次模型
published: 2026-11-10
description: 换机器、重装环境、跨被试泛化崩掉，一些琐碎的实验记录。
aiPolished: false
image: /assets/images/wallpaper/darknight-rain.webp
imageColor: "#1b2340"
tags: [实验记录, 神经解码]
category: 大肥鱼日记
draft: false
lang: zh-CN
author: darknight
licenseName: CC BY-NC-SA 4.0
licenseUrl: https://creativecommons.org/licenses/by-nc-sa/4.0/
comment: false
---

换了台机器跑，想着终于不用排队等卡了。

结果第一次跑就全崩了。

先是环境不对，CUDA 版本差一个小的，编译出来的东西跑起来直接 core dumped。重装。装完发现 torch 版本和原来的代码对不上，几个算子名字都变了，一个一个改。

改完之后能跑了。准确率 61。

上周在同一份数据上是 71 的。

我盯着那个数字看了很久，怀疑是数据划分换了种子。重新划分一遍，还是 61。又怀疑是预处理里滤波的截止频率被谁改过，翻 git log，没有。最后发现是 scaler 的问题——新版本的库默认按整个 dataset 拟合，旧的按 train 拟合，测试集的统计量漏进去了。

换成按 train 拟合，71 回来了。

这种错最气人。不是模型不行，是前面某一步悄悄变了，而你又没有任何报错。

然后跨被试一跑，又崩了。

被试 A 上训的，被试 B 上测，掉到 38，基本等于瞎猜。之前就说过这个方向不好做，但真看到 38 还是会难受一下。

目前试了两个办法，都不太行。一个是加被试间的对抗，另一个是先把每个人的数据做一次对齐再训。前者把被试信息压下去了，但也顺手压掉了一部分任务信息，准确率跟着掉。后者好一点，能到 52，但方差特别大，换个被试又掉回去。

行了，先记这些。

明天继续洗数据。
