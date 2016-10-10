import React from 'react';
import ReactDOM from 'react-dom';

import FlatButton from 'material-ui/FlatButton';

import TextField from 'material-ui/TextField';
import FilterRow from './FilterRow'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Select from 'react-select';
var	classNames = require('classnames');

var options = [
    { value: 'one', label: 'Proffesion' },
    { value: 'two', label: 'Two' }
];
var options2 = [
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '=', label: '=' }
];

class MyFilter extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	filterRows: [],
	    	filterObj: [],
	    	indexCounter: 0
	    };
	}
	handleAddFilter() {
		var filterRows = this.state.filterRows;
		filterRows.push(this._getFilterRow());
		this.setState({
			filterRows: filterRows
		})
	}
	handleResetFilter() {
		this.props.getFilteredRows(null);
		this.setState({
			filterRows: [],
			filterObj: [],
			indexCounter: 0
		})
	}
	componentWillReceiveProps(nextProps) {
		// this.setState({
		// 	filterRows: []
		// })
		if(this.props.tableName !== nextProps.tableName) {
			this.setState({
				filterRows: [],
				filterObj: [],
				indexCounter: 0
			})
		}
	}
	_getFilterRow() {
		var opt = [];
		for(var i=0; i<this.props.rows.length; i++) {
			opt.push({value: this.props.rows[i], label: this.props.rows[i]})
		}
		return (<FilterRow rows={opt} 
				id={this.state.indexCounter++}
				pushInfo={this.pushInfo.bind(this)}/>)
	}

	pushInfo(obj) {
		console.log(obj)
		var ts = this.state, tmp = ts.filterObj;
		for(var i=0; i<tmp.length; i++) {
			if(tmp[i].id === obj.id) {
				tmp[i].column = obj.column;
				tmp[i].mark = obj.mark;
				tmp[i].value = obj.value;
				this.setState({
					filterObj: tmp
				})
				return;
			}
		}
		tmp.push(obj);
		this.setState({
			filterObj: tmp
		})
	}
	getInfo() {
		console.log(this.state.filterObj);
		this.props.getFilteredRows(this.state.filterObj);
	}

	render() {

		
		console.log(this.props.rows);
		return (
			<div className="filter-wrapper">
				<div className="btn-wrapper">
					<div className="add-filter"
						onClick={this.handleAddFilter.bind(this)}>
						<i className={"material-icons add_filter_btn"}>library_add</i>
					</div>
					<div className="reset-filter"
						onClick={this.handleResetFilter.bind(this)}>
						<i className={"material-icons reset_filter_btn"}>cached</i>
					</div>
				</div>
				<table className='table'>
					{this.state.filterRows}
				</table>
				<FlatButton label="Filter"
					className={classNames({'hidden': this.state.filterRows.length == 0})}
					backgroundColor="#00BCD4"
					labelStyle={{color: '#FF4081'}}
					onClick={this.getInfo.bind(this)}
					primary={true}/>
			</div>
		)
	}
}

export default MyFilter;