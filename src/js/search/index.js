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