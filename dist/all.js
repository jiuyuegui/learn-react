var React = require('react');
var $ = require('jquery');

var converter = new Showdown.converter();
var Comment = React.createClass({
	render: function() {
		var rawMarkup = converter.makeHtml(this.props.children.toString());
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML={{__html: rawMarkup}} />
			</div>
		);
	}
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment author={comment.author}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.refs.author.getDOMNode().value.trim();
		var text = this.refs.text.getDOMNode().value.trim();
		if(!text || !author) {
			return;
		} 
		//TODO: send request to the server
		this.props.onCommentSubmit({author: author, text: text});

		this.refs.author.getDOMNode().value = '';
		this.refs.text.getDOMNode().value = '';
		return;
	},
	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="your name" ref="author" />
				<input type="text" placeholder="say something..." ref="text" />
				<input type="submit" value="Post" />
			</form>
		);
	}
});

var CommentBox = React.createClass({
	loadCommentsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handleCommentSubmit: function(comment) {
		var comments = this.state.data;
		var newComments = comments.concat([comment]);
		this.setState({data: newComments});

		//TODO: submit to the server and refresh the list
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'post',
			data: comment,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {
			data: []
		};
	},
	//componentDidMount之后json路径才是相对于index.html的；想想之前用的componentWillMount
	componentDidMount: function() {
		this.loadCommentsFromServer();
		// setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	render: function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
			</div>
		);
	}
});

React.render(
	<CommentBox url="comments.json" pollInterval={1000} />, 
	document.getElementById('content')
);
var React = require('react');
var $ = require('jquery');

var ProductCategoryRow = React.createClass({
	render: function() {
		return (<tr><th colSpan="2">{this.props.category}</th></tr>);
	}
});

var ProductRow = React.createClass({
	render: function() {
		//样式用双花括【{color: 'red'}是个对象】弧且驼峰式
		var name = this.props.product.stocked ? this.props.product.name : <span style={{color: 'red'}}>{this.props.product.name}</span>;
		return (
			<tr>
				<td>{name}</td>
				<td>{this.props.product.price}</td>
			</tr>
		);
	}
});

var ProductTable = React.createClass({
	render: function() {
		var rows = [];
		var lastCategory = null;
		this.props.products.forEach(function(product) {
			if(product.category !== lastCategory) {
				//key是react用于标识组件的，规范写法
				rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
			}
			rows.push(<ProductRow product={product} key={product.name}  />);
			lastCategory = product.category;
		});
		return (
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	}
});

var SearchBar = React.createClass({
	handleSearch: function() {
		var a = this.refs.check.getDOMNode().value.trim();
		this.props.handleCheck(a);
	},
	render: function() {
		return (
			<form>
				<input type="text" ref="check" onChange={this.handleSearch} placeholder="Search..." />
				<p>
					<input type="checkbox" />
					{' '}
					only show products in stock
				</p>
			</form>
		);
	}
});
//花括弧的使用时机，当传递对象等数据到其中的时候
var FilterableProductTable = React.createClass({
	getInitialState: function() {
		return {
			filterText: '',
			inStockOnly: false
		};
	},
	render: function() {
		return (
			<div>
				<SearchBar
					filterText={this.state.filterText}
					inStockOnly={this.state.inStockOnly}
					handleCheck={this.props.handleTable}
				/>
				<ProductTable 
					products={this.props.products} 
					filterText={this.state.filterText}
					inStockOnly={this.state.inStockOnly}
				/>
			</div>
		);
	}
});
//reactlink用法？props可以有多个，state只能有一个吗？

var Container = React.createClass({
	getInitialState: function() {
		return {
			products: []
		};
	},
	componentWillMount: function() {
		this.handleTable();
	},
	/*handleInit: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: (json) => {
				this.setState({products: json});
			},
			error: (xhr, status, err) => {
				console.info(this.props.url, status, err.toString());
			}
		});
	},*/
	handleTable: function(a) {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: (json) => {
				if(a) {
					var count = 0;
					$(json).each(function(i, em) {
						if(em.name.indexOf(a) < 0) {
							json.splice(i-count, 1);
							count++;
						}
					});
				}
				this.setState({products: json});
			},
			error: (xhr, status, err) => {
				console.info(this.props.url, status, err.toString());
			}
		});
	},
	render: function() {
		return (
			<FilterableProductTable handleTable={this.handleTable} products={this.state.products} />
		);
	}
});
React.render(
	<Container url={'search.json'} />,
	document.getElementById('container')
);
var React = require('react');

var HelloWorld = React.createClass({
	propTypes: {	
		data: React.PropTypes.object
	},
	render: function() {
		/*var child = React.createElement('li', {className: 'one'}, 'child');
		var root = React.createElement('ul', {className: 'zero'}, child);*/

		/*var Factory = React.createFactory('p');		//工厂模式是什么意思？为什么不起作用？
		var root2 = Factory({className: 'prop'});*/

		var root = React.DOM.ul({className: 'my-list'},	//会报错？
						React.DOM.li(null, 'Text Content')
					);
		return (
			<p>
				Hello, <input type="text" placeholder="Your Name" />!
				It is {this.props.data.toTimeString()}	
				{root}
			</p>
		);
	}
});

React.render(
	<HelloWorld data={new Date()} />,
	document.getElementById('test')
);

var person = function(name, age) {
	this.name = name;
	this.age = age;

	this.sayName = function() {
		console.log(this.name);
	}
}

var ming = new person('ming', 23);