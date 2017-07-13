// 使用jQuery在DOM加载完成后的回调函数
$(function () {
	// 基本的'item'模型包含total，rolls和info
	var item = Backbone.Model.extend({
		// 对象的默认属性
		default: {
			total: "",	//112
			rolls: "",	//55 57
			dice: "" 	//2D100
		}
	});

	// item的集合，存放每次roll后的结果
	var itemList = Backbone.Collection.extend({
		model: item
	});

	var list = new itemList; //创建collection的实例

	// 将列表视图从主视图分离
	var listView = Backbone.View.extend({

		template: _.template($('#item-template').html()), //读取script标签上的模板

		initialize: function () {
			this.listenTo(this.model, 'change', this.render); //响应模型的change事件，渲染该模型的数据到li中
		},

		// 渲染数据到li中，然后返回对自己的引用this
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	// AppView为顶级视图
	var AppView = Backbone.View.extend({

		// 绑定视图元素
		el: $('#App'),

		// 视图事件
		events: {
			"click .js-roll": "roll"
		},

		// 在初始化函数中绑定collection的事件
		initialize: function () {
			this.listenTo(list, 'add', this.addOne); //当集合产生add事件时渲染列表视图，增加一条记录
		},

		roll: function () {
			var side = $("#sides").val();
			var dice = $("#dice").val();
			var res = [];
			var total = 0;
			for (var i = dice - 1; i >= 0; i--) {
				// 生成随机数
				var j = parseInt(Math.random()*side, 10);
				res.push(j);
				total += j;
			};

			var listRolls = res.join(" ");
			var listDice = dice + "D" + side; // 生成类似100D5的字符串
			// 为collection增加一条记录
			list.create({
				total: total,
				rolls: listRolls,
				dice: listDice 
			});
		},

		// 向列表视图增加一条记录
		addOne: function (item) {
			var view = new listView({model: item});
			this.$("#list").prepend(view.render().el);
		}

	});

	// Finally, we kick things off by creating the **App**.
	var App = new AppView;
});