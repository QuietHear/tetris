//定义Cell类型描述各自对象统一的结构
	function Cell(r,c){
		this.r=r;
		this.c=c;
		this.src="";
	};
//描述状态对象的数据结构
	function State(r0,c0,r1,c1,r2,c2,r3,c3){
		this.r0=r0; this.c0=c0;
		this.r1=r1; this.c1=c1;
		this.r2=r2; this.c2=c2;
		this.r3=r3; this.c3=c3;
	}
//定义公共父类型样式
	function shape(r0,c0,r1,c1,r2,c2,r3,c3,src,states,orgi){ //orgi：旋转参照对象
		this.cells=[
		new Cell(r0,c0),
		new Cell(r1,c1),
		new Cell(r2,c2),
		new Cell(r3,c3)];
		for(var i=0;i<this.cells.length;i++)
		{
			this.cells[i].src=src;
		}
		this.states=states; //旋转状态
		this.orgcell=this.cells[orgi]; //旋转参考对象
		this.statei=0; //默认加载状态下标，为0状态
	};
//公共父类型的原型
	shape.prototype={
		IMG:{  //统一存储图片地址
			T:"img/T.png",
			O:"img/O.png",
			I:"img/I.png",
			Z:"img/Z.png",
			S:"img/S.png",
			L:"img/L.png",
			J:"img/J.png"
		}, 
		moveDown:function(){//向下移动
			for(var i=0;i<this.cells.length;i++)//遍历主角的cells中所有块儿
			{
				this.cells[i].r++;
			}
		},
		moveLeft:function(){//向左移动
			for(var i=0;i<this.cells.length;i++)//遍历主角的cells中所有块儿
			{
				this.cells[i].c--;
			}
		},
		moveRight:function(){//向右移动
			for(var i=0;i<this.cells.length;i++)//遍历主角的cells中所有块儿
			{
				this.cells[i].c++;
			}
		},
		rotateR:function(){ //顺时针右旋转
			this.statei++;
			if(this.statei==this.states.length)
			{
				this.statei=0;
			}
			this.rotate();
		},
		rotateL:function(){ //逆时针左旋转
			this.statei--;
			if(this.statei<0)
			{
				this.statei=this.states.length-1;
			}
			this.rotate();
		},
		rotate:function(){
			var sta=this.states[this.statei];
			for(var i=0;i<this.cells.length;i++)
			{
				var cell=this.cells[i];
				cell.r=this.orgcell.r+sta["r"+i];
				cell.c=this.orgcell.c+sta["c"+i];
			}
		}
	}
//定义T类型描述所有T图形的数据结构	
	function T(){
		shape.call(this,0,3,0,4,0,5,1,4,
			this.IMG.T,
			[
				new State(0,-1,0,0,0,1,1,0),
				new State(-1,0,0,0,1,0,0,-1),
				new State(0,1,0,0,0,-1,-1,0),
				new State(1,0,0,0,-1,0,0,1)
			],1
		);
	};
	Object.setPrototypeOf(T.prototype,shape.prototype);//T原型继承公共类型原型
//定义O类型描述所有O图形的数据结构
	function O(){
		shape.call(this,0,4,0,5,1,4,1,5,
			this.IMG.O,
			[
				new State(0,-1,0,0,1,-1,1,0)
			],1
		);
	};
	Object.setPrototypeOf(O.prototype,shape.prototype);//O原型继承公共类型原型
//定义I类型描述所有I图形的数据结构
	function I(){
		shape.call(this,0,3,0,4,0,5,0,6,
			this.IMG.I,
			[
				new State(0,-1,0,0,0,1,0,2),
				new State(-1,0,0,0,1,0,2,0)
			],1
		);
	};
	Object.setPrototypeOf(I.prototype,shape.prototype);//I原型继承公共类型原型
//定义Z类型描述所有I图形的数据结构
	function Z(){
		shape.call(this,0,3,0,4,1,4,1,5,
			this.IMG.Z,
			[
				new State(0,-1,0,0,1,0,1,1),
				new State(-1,0,0,0,0,-1,1,-1)
			],1
		);
	};
	Object.setPrototypeOf(Z.prototype,shape.prototype);//I原型继承公共类型原型
//定义S类型描述所有I图形的数据结构
	function S(){
		shape.call(this,1,3,1,4,0,4,0,5,
			this.IMG.S,
			[
				new State(1,-1,1,0,0,0,0,1),
				new State(-1,-1,0,-1,0,0,1,0)
			],2
		);
	};
	Object.setPrototypeOf(S.prototype,shape.prototype);//S原型继承公共类型原型	
//定义L类型描述所有T图形的数据结构	
	function L(){
		shape.call(this,0,3,1,3,1,4,1,5,
			this.IMG.L,
			[
				new State(-1,0,0,0,0,1,0,2),
				new State(0,1,0,0,1,0,2,0),
				new State(1,0,0,0,0,-1,0,-2),
				new State(0,-1,0,0,-1,0,-2,0)
			],1
		);
	};
	Object.setPrototypeOf(L.prototype,shape.prototype);//L原型继承公共类型原型
//定义J类型描述所有T图形的数据结构	
	function J(){
		shape.call(this,1,3,1,4,1,5,0,5,
			this.IMG.J,
			[
				new State(0,-1,0,-2,0,0,-1,0),
				new State(-2,0,-1,0,0,0,0,1),
				new State(0,2,0,1,0,0,1,0),
				new State(2,0,1,0,0,0,0,-1)
			],2
		);
	};
	Object.setPrototypeOf(J.prototype,shape.prototype);//L原型继承公共类型原型