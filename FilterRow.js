import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';

var options2 = [
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '=', label: '=' },
    { value: '!=', label: '!=' },
    { value: 'like', label: 'like' }
];

class FilterRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedColumn: '',
			selectedMark: '',
			value: ''
		}
	}
	handleSelectColumn(SelectedColumn) {
		this.setState({
			selectedColumn: SelectedColumn.value
		}, this.pushInfo)
	}
	handleSelectMark(SelectedMark) {
		this.setState({
			selectedMark: SelectedMark.value
		}, this.pushInfo)
	}
	handleValue(event) {
		this.setState({
			value: event.target.value
		}, this.pushInfo)
	}
	pushInfo() {
		console.log('was push');
		var ts = this.state;
		this.props.pushInfo({
			id: this.props.id,
			column: ts.selectedColumn,
			mark: ts.selectedMark,
			value: ts.value
		})
	}
	render() {
		return (
			<tr>
				<td>
					<Select
						style={{width: '189px'}}
					    name="form-field-name"
					    value={this.state.selectedColumn}
					    options={this.props.rows}
					    onChange={this.handleSelectColumn.bind(this)}
					    className="select-column"
					/>
				</td>
				<td style={{textAlign: 'left'}}>
					<Select
						style={{width: '60px'}}
					    name="form-field-name"
					    options={options2}
					    value={this.state.selectedMark}
					    onChange={this.handleSelectMark.bind(this)}
					    className="select-mark"
					/>
				</td>
				<td>
					<input type="text" 
					className="form-control"
					value={this.state.value}
					style={{padding: '.3rem .75rem'}}
					onChange={this.handleValue.bind(this)}/>
				</td>
			</tr>
		)
	}
}
export default FilterRow;