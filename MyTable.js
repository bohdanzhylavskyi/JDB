import React from 'react';
import MyRow from './MyRow';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';

var	classNames = require('classnames');

class MyTable extends React.Component {

	render() {
		var columns = this.props.rows.length>0 ? Object.keys(this.props.rows[0]) : [];
		


		function capitalize(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
		return (
			<div className="over">
				<table className="table my-table">
					<tr>
						<th><IconButton
						onClick={this.props.removeRows}
						disabled={!this.props.isTrashActive}
						><i className={classNames("material-icons", {delete: true})}>delete</i></IconButton></th>

					    {columns.reverse().map(function (column) {
					    	return <th key={column}>{capitalize(column)}</th>
					    })}
					</tr>
				{this.props.rows.map((row) => 
					<MyRow updateTable={this.props.updateTable} 
						addRowToDelete={this.props.addRowToDelete}
						data={row} 
						key={row.id}/>)}
				</table>
				<RaisedButton label="Add Row"
				   disabled={!this.props.isAddActive} 
		     	   backgroundColor="#6E7A94"
		     	   labelColor="#fff"
		      	  fullWidth={true}
		      	  onClick={this.props.addRow}/>
			</div>
		)
	}
}

export default MyTable;