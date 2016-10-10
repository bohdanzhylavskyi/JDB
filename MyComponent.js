import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import MyTable from './MyTable';
import MyFilter from './MyFilter'

var _ = require('underscore');

const style = {
	height: '48px'
}
const headers = [
  {value: 'Name', type: 'TextField', width: 200},
  {value: 'Address', type: 'TextField', width: 200},
  {value: 'Phone', type: 'TextField', width: 200},
  {value: 'Enabled', type: 'Toggle', width: 50},
]

const rows = []

class MyComponent extends React.Component {
	constructor(props) {
	    super(props);
	    var tables = [];
	    this.state = {
	    	value: '',
	    	currentTable: '',
	    	selectedRows: [],
	    	tables: tables,
	    	rows: [],
	    	rowsToDelete: []
	    };
	}
	handleChange(e, key, value) {
		this.setState({value: value})
	}
	handleRowSelecting(selectedRows) {
		console.log(selectedRows);
		this.state = selectedRows;
	}
	handleDBConnect(){
		var that = this;
		this.setState({
			currentTable: this.state.value,
			rowsToDelete: []
		}, that.getRows);
	}
	getTables() {
		var that = this;
		fetch("/gettables", {
			method: 'POST'
		}).then(resp => resp.json())
		.then(function(obj) {
			that.setState({
				tables: obj.tables,
				value: obj.tables[0],
				tableToConnect: ''
			})
		})
	}
	getFilteredRows(filterObj) {
		if(filterObj == null) {this.getRows()};
		var that = this;
		fetch('/gfrows', {
			method: 'POST',
			body: JSON.stringify({
				tableName: this.state.currentTable,
		    	filters: filterObj
		    })
		})
		.then(resp => resp.json())
		.then(function (obj) {
			console.log(obj);
			that.setState({
				rows: obj.rows
			});
		})
	}
	getRows() {
		console.log("Was get row");
		var that = this;
		console.log(that.state.currentTable + "ds");
		fetch('/getrows', {
			method: 'POST',
			body: JSON.stringify({
		    	tableName: that.state.currentTable
		    })
		})
		.then(resp => resp.json())
		.then(function (obj) {
			console.log('was end');
			console.log(obj);
			that.setState({
				rows: obj.rows
			});
		})
	}
	removeRows() {
		var that = this;
		fetch('/removerows', {
			method: 'post',  
		    headers: {  
		      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
		    },  
		    body: JSON.stringify({
		    	tableName: that.state.currentTable,
		    	rowsToDelete: that.state.rowsToDelete
		    })  
		})
		.then(resp => resp.json())
		.then(function (obj) {
			that.setState({
				rows: obj.rows,
				rowsToDelete: []
			})
		}) 
	}
	addRowToDelete(id, checked) {
		if(!checked) {
			this.setState({
				rowsToDelete: _.without(this.state.rowsToDelete, id)
			})
		} else {
			var tmp = this.state.rowsToDelete;
			tmp.push(id);
			this.setState({
				rowsToDelete: tmp
			})
		}
	}
	addRow() {
		var that = this;
		console.log("was add row");
		fetch('/addrow', {
			method: 'post',  
		    headers: {  
		      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
		    },  
		    body: JSON.stringify({
		    	tableName: that.state.currentTable
		    })  
		}).then(resp => resp.json())
		.then(function (obj) {
			that.setState({
				rows: obj.rows
			})
		})
	}
	updateTable(ID, elem) {
		var that = this;
		fetch('/updaterow', {
			method: 'post',  
		    headers: {  
		      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
		    },  
		    body: JSON.stringify({
		    	tableName: that.state.currentTable,
		    	id: ID,
		    	column: elem.getAttribute('name'),
		    	value: elem.innerText
		    })  
		})
		.then(function (resp) {
			console.log(resp);
		})
	}
	componentDidMount() {
		console.log("was did");
		this.getTables();
	}
	render() {
		console.log(this.state.value);
		console.log("##");
		this.state.rowsToDelete.length;
		var isActive = this.state.rowsToDelete.length>0;
		return (
			<div>
				<SelectField value={this.state.value} 
					onChange={this.handleChange.bind(this)}
					fullWidth={true}
					>
		          {
		          	this.state.tables.map(function(val) {
		          		return <MenuItem value={val} primaryText={val} />
		          	})
		          }
		        </SelectField>
		        <br/>
		        <div className="clearfix">
		        	<RaisedButton label={"Connect"}
		        	 className="pull-right" style={{marginBottom: '40px'}}
		        	 onClick={this.handleDBConnect.bind(this)}/>
		        </div>
		        
		        <MyFilter rows={this.state.rows.length>0 ? Object.keys(this.state.rows[0]) : []}
		        		  tableName={this.state.currentTable}
		        		  getFilteredRows={this.getFilteredRows.bind(this)}/>
		        
		        <MyTable rows={this.state.rows}
		        		addRowToDelete={this.addRowToDelete.bind(this)}
		        		removeRows={this.removeRows.bind(this)}
		        		addRow={this.addRow.bind(this)}
		        		updateTable={this.updateTable.bind(this)}
		        		isTrashActive={isActive}
		        		isAddActive={this.state.currentTable.length>0}/>
		        
			</div>
		)
	}
}

export default MyComponent;