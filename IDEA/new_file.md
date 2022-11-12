1、cd ~/Library/Caches
2、cd Library/Application\ Support/ 
mac上如何彻底删除IntelliJ IDEA等软件

mac上安装IntelliJ IDEA后，如果IntelliJ IDEA出了问题需要重新安装，有时会发现软件删除重装后，IntelliJ IDEA仍然出现打不开的问题，很是困扰。

下面方法教你彻底删除mac中的IntelliJ IDEA等类似软件。

1、将应用移至废纸篓进行删除
2、打开访达
3、在屏幕顶部工具栏点击 “前往”，显示下拉菜单，按下键盘"option"键，就可以看到资源库，点击进入资源库
4、在资源库文件夹内， 查找以下目录里所包含的IntelliJIdea文件夹，删除即可：
（1）删除~/Library/Preferences/IntelliJIdea（IntelliJIdea后边跟版本发行日期）
（2）删除~/Library/Caches/IntelliJIdea（IntelliJIdea后边跟版本发行日期）
（3）删除~/Library/Application Support/IntelliJIdea（IntelliJIdea后边跟版本发行日期）
（4）删除~/Library/ApplicationSupport/IntelliJIdea（IntelliJIdea后边跟版本发行日期）
『注：此路径名与（3）不同：ApplicationSupport文件名中间没有空格，在（3）中Application Support文件名中，两个单词间有空格』

（5）删除~/Library/Logs/IntelliJIdea（IntelliJIdea后边跟版本发行日期）
大功告成！
