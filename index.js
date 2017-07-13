// 使用jQuery在DOM加载完成后的回调函数
$(function () {
	$('.js-confirm').click(function () {
		alert("ffff");
	});

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

	var list = new itemList;

	var listView = Backbone.View.extend({
		//tagName: "li",

		template: _.template($('#item-template').html()),

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
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
			this.listenTo(list, 'add', this.addOne);
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
			console.log(res);
			console.log(total);

			var listRolls = res.join(" ");
			var listDice = dice + "D" + side;
			list.create({
				total: total,
				rolls: listRolls,
				dice: listDice 
			});
		},

		addOne: function (item) {
			var view = new listView({model: item});
			this.$("#list").prepend(view.render().el);
		}

	});

	// Finally, we kick things off by creating the **App**.
	var App = new AppView;
});