which node
/opt/homebrew/bin/node

因为node环境是全局的，需要安装到系统目录下，涉及目录有 /usr/local/bin、usr/local/lib、/usr/local/include、/usr/local/share，这几个目录的拥者是root，其他用户没有权限操作他们。

chmod u+x *.sh
chmod是权限管理命令change the permissions mode of a file的缩写。
u代表所有者。x代表执行权限。’+’ 表示增加权限。
chmod u+x file.sh 就表示对当前目录下的file.sh文件的所有者增加可执行权限。

brew uninstall --ignore-dependencies node 
Uninstalling /opt/homebrew/Cellar/node/17.3.0... (1,976 files, 44.4MB)

which brew
/opt/homebrew/bin/brew

第一步:删除现有Node版本
如果你的系统已经安装了node，请先卸载它。我的系统已经通过Homebrew安装了node。所以先把它卸载了。如果还没有安装就跳过。
brew uninstall --ignore-dependencies node 
brew uninstall --force node 

第二步:在Mac上安装NVM
现在，你的系统已经准备好了，可以进行安装。更新Homebrew软件包列表并安装NVM。

brew update 
brew install nvm

v14.17.4

 ~ % which node
/usr/local/bin/node


/opt/homebrew/Cellar/node

安装nvm
$ brew install nvm
安装完成后，修改环境变量

进入当前用户的Home目录
$ cd ~

编辑.bash_profile文件
$ vim .bash_profile

按 i 进入编辑模式
然后按 esc 退出编辑模式
按 :wq 保存并退出

输入以下命令，更新配置过的环境变量
$ source .bash_profile

brew -v
Homebrew 3.3.9-78-gc2c0216

brew reinstall nvm

You should create NVM's working directory if it doesn't exist:

  mkdir ~/.nvm


Add the following to ~/.zshrc or your desired shell
configuration file:

  export NVM_DIR="$HOME/.nvm"
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

You can set $NVM_DIR to any location, but leaving it unchanged from
/opt/homebrew/opt/nvm will destroy any nvm-installed Node installations
upon upgrade/reinstall.

输入以下命令，更新配置过的环境变量
$ source .bash_profile

查看nvm版本
$ nvm --version

如果出现版本号，则说明安装成功

nvm 常用语法

安装node指定版本
$ nvm install 版本号

查看本地node的所有版本
$ nvm list

切换到指定的node版本

$ nvm use 10.19

卸载指定的node版本s

$ nvm uninstall 版本号

安装最新的node稳定版本

$ nvm install --lts

查看node的所有的版本

$ nvm ls-remote

使用node指定版本执行指定文件

$ nvm exec 版本号 node 要执行的文件路径

例如：nvm exec 4.8.3 node app.js

表示使用4.8.3 版本的node，执行app.js文件

设置默认版本的Node，每次启动终端都使用该版本的node

$nvm alias default 版本号

->       system
iojs -> N/A (default)
node -> stable (-> N/A) (default)
unstable -> N/A (default)

//删除指定版本
n rm xxx
//删除当前版本外的所有版本
n prune
//卸载当前已安装的node
n uninstall

n 10.16.3 //下载并安装node 10.16.3
n latest //下载并安装node 最新版本
n lts //下载并安装node 长期稳定维护版


n管理node版本

清除node缓存:sudo npm cache clean -f

安装 n 执行:npm install -g n

注意：如果报错如:code EACCES errno -13,表示你没有权限安装，使用管理员身份安装：sudo npm i g -n

查看n是否安装成功：n -V

使用n管理node

查看node可以使用的列表n ls
安装制定版本node

查看官方node版本 npm view node versions 或者 node官网
安装指定的node版本: n node版本号 如:n 17.2.0
注意：如果最终显示的还是原来node的版本号则需要在管理员权限下运行: sudo n node版本号

切换node版本

首先执行n，通过上下键进行切换选择，最后使用enter键选中版本。
如果选中后还是原来版本，则使用 sudo n，后再通过上下键进行切换选择，最后使用enter键选中版本。

删除指定版本node 运行命令 n rm node版本号或者运行 sudo n rm 10.13.1

卸载 n 执行 npm uninstall n -g或sudo npm uninstall n -g

卸载 brew remove node

解绑
卸载之后要先把之前node解除连接。
brew unlink node

查找可用的node版本
brew search node

brew install node@10
vi ~/.bash_profile
export PATH="/usr/local/opt/node@10/bin:$PATH"