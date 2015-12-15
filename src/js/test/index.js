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