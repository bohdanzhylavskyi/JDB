import React from 'react';
import ReactDOM from 'react-dom';
import Checkbox from 'material-ui/Checkbox';

class MyRow extends React.Component {
	handle(e) {
		this.props.updateTable(this.props.data['id'],
			e.nativeEvent.target);
	}
	_onCheck(e, checked) {
		this.props.addRowToDelete(this.props.data['id'], checked);
	}
	render() {
		var that = this,
			data = this.props.data,
			columns = [];
			columns.push(<td><Checkbox 
				inputStyle={{backgroundColor: "red"}}
				style={{width: '24px'}}
				onCheck={this._onCheck.bind(this)}/></td>);

			columns.push(
				Object.keys(data).reverse().map(function (prop) {
							return (<td contentEditable={true}
								onBlur={that.handle.bind(that)}
								name={prop}
								key={prop}>
									{data[prop]}
								</td>)
					})
			)

		return (
				<tr>
					{columns}
				</tr>
			)
	}
}

export default MyRow;