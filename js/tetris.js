	var game={
		CSIZE:26, //格子大小
		OFFSET:15, //内边距
		pg:null, //容器元素
		shape:null, //主角元素
		nextshape:null, //下一个主角元素
		interval:550, //时间间隔
		timer:null,  //保存定时器名称
		wall:null, //保存停止下落的方块儿的墙
		RN:20, //总行数
		CN:10, //总列数
		lines:0,//保存清除总行数
		score:0,//保存总得分
		SCORES:[0,10,30,60,120],//得分范围
		GAMEOVER:0, //游戏结束
		RUNNING:1, //正常运行
		PAUSE:2, //暂停
		state:1,//保存游戏状态
		randomShape(){ //每次新的主角随机生成图形函数，ES6新出标准，可省略 :function
			var x=Math.floor(Math.random()*7);
			switch(x)
			{
				case 0:
					return new T();
				case 1:
					return new O();
				case 2:
					return new I();
				case 3:
					return new Z();
				case 4:
					return new S();
				case 5:
					return new L();
				case 6:
					return new J();
			}
		},
		paint(){ //重绘一切
		// 删除之前的全部主角，下一个主角和墙	
			this.pg.innerHTML=this.pg.innerHTML.replace(/<(img)[^>]*>/g,"");
		// 重新绘制主角
			this.paintShape();
		// 重新绘制下一个img
			this.paintNextShape();
		//重绘墙
			this.paintWall();
		//绘制分数和行数
			this.paintScore();
		},
		paintCell(img,cell){//设置一个格的数据
			img.src=cell.src;  //设置<img>元素的src
			img.style.left=this.OFFSET+this.CSIZE*cell.c+"px";  //设置img向右距离，在哪一列
			img.style.top=this.OFFSET+this.CSIZE*cell.r+"px"; //设置img向下距离，在哪一行
		},
		paintShape(){ //绘制主角元素方法
			var frag=document.createDocumentFragment(); //创建文档片段（托盘）
			for(var i=0;i<this.shape.cells.length;i++) //遍历新建图形的所有格子
			{
				var cell=this.shape.cells[i];
				var img=new Image();  //新建<img />元素
				this.paintCell(img,cell);
				frag.appendChild(img);
			}
			this.pg.appendChild(frag); //将托盘的全部内容写入父元素
		},
		paintNextShape(){ //重新绘制下一个主角元素
			var frag=document.createDocumentFragment(); //创建文档片段（托盘）
			for(var i=0;i<this.nextshape.cells.length;i++) //遍历新建图形的所有格子
			{
				var cell=this.nextshape.cells[i];
				var img=new Image();  //新建<img />元素
				this.paintCell(img,cell);
				img.style.left=parseFloat(img.style.left)+10*this.CSIZE+"px"; //再向右10个位置
				img.style.top=parseFloat(img.style.top)+this.CSIZE+"px"; //再向下1个位置
				frag.appendChild(img);
			}
			this.pg.appendChild(frag); //将托盘的全部内容写入父元素
		},
		paintWall(){//重绘墙
			var frag=document.createDocumentFragment(); //创建文档片段（托盘）
			for(var x=0;x<this.RN;x++) //遍历整个墙
			{
				for(var y=0;y<this.CN;y++)
				{
					if(this.wall[x][y]!==undefined) //若墙的一块儿中有内容cell
					{
						var cell1=this.wall[x][y];
						var img=new Image();  //新建<img />元素
						this.paintCell(img,cell1);
						frag.appendChild(img);
					}
				}
			}
			this.pg.appendChild(frag); //将托盘的全部内容写入父元素
		},
		paintScore(){//得分计算
			document.getElementById('lines').innerHTML=this.lines;  //清除总行数
			document.getElementById('score').innerHTML=this.score; //清除总得分
		},
		start:function(){ //开始游戏
			this.state=this.RUNNING;
			this.score=0; //清空得分记录
			this.lines=0; //清空行数记录
			this.wall=[]; //创建空二维数组
			for(var x=0;x<this.RN;x++)
			{
//				this.wall[x]=[];
//				for(var y=0;y<this.CN;y++)
//				{
//					this.wall[x][y]="";
//				}
				this.wall[x]=new Array(this.CN);
			}
			this.pg=document.querySelector(".playground");//获取最后添加图形的父容器
			this.shape=this.randomShape();  //创建主角元素
			this.nextshape=this.randomShape();  //创建下一个主角元素
			this.paint(); //绘制所有，刚开始什么都没有所以只绘制主角元素
			this.timer=setInterval(this.moveDown.bind(this),this.interval);//启动定时器，让主角元素自动向下
			document.onkeydown=function(e){ //用户输入操作
				switch(e.keyCode){
					case 32:  //空格，直接下落到底
						this.state===this.RUNNING && this.hardDrop();
						break;
					case 37:  //←，左移
						this.state===this.RUNNING && this.moveLeft();
						break;
					case 38:  //↑，顺时针右旋转
						this.state===this.RUNNING && this.rotateR();
						break;
					case 39:  //→，右移
						this.state===this.RUNNING && this.moveRight();
						break;
					case 40: //加速下落*1
						this.state===this.RUNNING && this.moveDown();
						break;
					case 90:  //Z，逆时针左旋转
						this.state===this.RUNNING && this.rotateL();
						break;
					case 83:  //S，重新开始游戏
						this.state===this.GAMEOVER && this.start();
						break;
					case 81:  //Q，退出游戏
						this.state!==this.GAMEOVER && this.quiet();
						break;
					case 80:  //P，暂停游戏
						this.state===this.RUNNING && this.pause();
						break;
					case 67:  //C，回到游戏
						this.state===this.PAUSE && this.starAgin();
						break;
				};
			}.bind(this);
		},
		moveDown(){ //向下移动
			if(this.canDown()) //若可以向下
			{
				this.shape.moveDown(); //下移并重新绘制主角元素
				this.paint();
			}
			else //若不可以向下
			{
				this.landIntoWall();  //将主角元素添加到墙中
				var ln=this.deleteRows();  //判断是否出现整个一行全有元素
				this.lines+=ln;   //加清除行数
				this.score+=this.SCORES[ln]; //加得分
				if(!this.isGameOver())  //判断是否游戏结束
				{
					clearInterval(this.timer);
					var img=new Image();
					img.src="img/game-over.png";
					img.className="pause";
					this.pg.appendChild(img);
					this.state=this.GAMEOVER;
				}
				else
				{
					this.shape=this.nextshape; //新还旧
					this.nextshape=this.randomShape(); //重新生成下一个主角，并绘制
					this.paint();
				}
			}
		},
		canDown:function(){ //判断是否能够继续下落
			for(var i=0;i<this.shape.cells.length;i++)//遍历主角的每个cell
			{
				var cell=this.shape.cells[i];
				if(cell.r==(this.RN-1) || this.wall[cell.r+1][cell.c]!=undefined ) //若到底或者墙的上边
				{
					return false;
				}
			}
			return true; //若全部都cell都没碰到边，则可以继续下落
		},
		hardDrop(){ //直接下落到底
			while(this.canDown()) //无限向下直到不能下降了
			{
				this.moveDown();
			}
		},
		moveLeft(){ //主角左移
			if(this.canLeft())
			{
				this.shape.moveLeft();
				this.paint();
			}
		},
		canLeft(){ //判断主角能否左移
			for(var i=0;i<this.shape.cells.length;i++)//遍历主角的每个cell
			{
				var cell=this.shape.cells[i];
				if(cell.c==0 || this.wall[cell.r][cell.c-1]!==undefined)  //若到左边缘或者墙的右边
				{
					return false;
				}
			}
			return true;//每个cell都满足要求
		},
		moveRight(){ //主角右移
			if(this.canRight())
			{
				this.shape.moveRight();
				this.paint();
			}
		},
		canRight(){  //判断主角能否右移
			for(var i=0;i<this.shape.cells.length;i++) //遍历主角的每个cell
			{
				var cell=this.shape.cells[i];
				if(cell.c==(this.CN-1) || this.wall[cell.r][cell.c+1]!==undefined)  //若到右边缘或者墙的左边
				{
					return false;
				}
			}
			return true;
		},
		rotateR(){ //主角顺时针右旋转
			this.shape.rotateR(); //尝试旋转一次
			if(!this.canRotate()) //判断旋转后会不会碰到各种边界
			{
				this.shape.rotateL(); //若为false，退回去一步
			}
			this.paint();
		},
		rotateL(){ //主角逆时针旋转
			this.shape.rotateL(); //尝试旋转一次
			if(!this.canRotate()) //判断旋转后会不会碰到各种边界
			{
				this.shape.rotateR(); //若为false，退回去一步
			}
			this.paint();
		},
		canRotate(){//判断能否旋转
			for(var i=0;i<this.shape.cells.length;i++)//遍历每个cell
			{
				var cell=this.shape.cells[i];
				if(cell.c<0 || cell.c>=this.CN || cell.r<0 || cell.r>=this.RN || this.wall[cell.r][cell.c]!==undefined) //不碰到任何边界
				{
					return false;
				}
			}
			return true;//若全部都满足，发挥true
		},
		landIntoWall(){ //停止下落后，添加主角到墙中
			for(var i=0;i<this.shape.cells.length;i++)//遍历主角的每个cell
			{
				var cell=this.shape.cells[i];
				this.wall[cell.r][cell.c]=cell;//相同位置填进去
			}
		},
		deleteRows(){ //检查时候含有可清除满格行
			for(var y=(this.RN-1),ln=0;y>=0;y--)//倒序检查墙的每一行
			{
				if(this.wall[y].join("")==="") //若最后一行为空，说明上面无内容
				{
					break;
				}
				else //若有内容 就检测
				{
					var reg=/^,|,,|,$/;  
					if(!reg.test(this.wall[y].toString())) //检测是否有空内容，若有
					{
						this.deleteRow(y); //删除该行
						ln++; //记录清除的行数
						if(ln==4){break;}
						y++;
					}
				}
			}
			return ln;
		},
		deleteRow(r){ //满足条件后删除第r行
			for(var x=r;x>=0;x--) //从r行开始向上遍历
			{
				if(this.wall[x-1].join("")!=="") //若上一行不为空
				{
					for(var i=0;i<this.wall[x].length;i++)
					{
						this.wall[x][i]=this.wall[x-1][i]; //将元素挪下来
						this.wall[x][i]&&(this.wall[x][i].r++); //若挪下来的有内容，则将其r++
					}
				}
				else //若为空
				{
					for(var i=0;i<this.wall[x].length;i++) //清除该行，并退出
					{
						this.wall[x][i]=undefined;
					}
					break;
				}
			}
		},
		pause(){ //暂停游戏
			clearInterval(this.timer);
			var img=new Image(); //新建图像对象，设置暂停游戏样式
			img.src="img/pause.png";
			img.className="pause";
			this.pg.appendChild(img);
			this.state=this.PAUSE;  //切换游戏状态为暂停
		},
		starAgin(){ //暂停后重新回到游戏
			this.timer=setInterval(this.moveDown.bind(this),this.interval);
			this.state=this.RUNNING; //切换游戏状态
		},
		isGameOver(){ //判断游戏是否结束
			for(var i=0;i<this.nextshape.cells.length;i++)
			{
				var cell=this.nextshape.cells[i];
				if(this.wall[cell.r][cell.c]!==undefined)
				{
					return false; //有内容，不可生成新的
				}
			}
			return true; //无内容，可继续生成新的
		},
		quiet(){ //退出游戏提示
			clearInterval(this.timer);
			if(confirm("确定要退出？")) //真，关闭
			{
				close();
			}
			else //假，返回继续游戏
			{
				this.timer=setInterval(this.moveDown.bind(this),this.interval);
			}
		}
	};
game.start();
