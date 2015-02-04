//global tasklist array
var taskListData = [];

$(document).ready(function(){

	$('#inputTaskDuedate').datepicker({
		format: 'mm/dd/yyyy',
		autoclose: true,
		todayHighlight: true
	});

	//populate task list
	populateTable();

	//when add is clicked, insert the task and refresh the table
	$('#btnAddTask').on('click', addTask);

	//delete task
	$('#taskList table tbody').on('click', 'td .linkdeletetask', deleteTask);
});

//load data into table
function populateTable(){

	var tableContent = '';

	//ajax call for json data
	$.getJSON('/tasks/tasklist', function(data){

		//create date object
		var dueDate = new Date(this.duedate);

		//add a row for each item
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td>' + new Date(this.duedate).toDateString() + '</td>';
			tableContent += '<td>' + this.task + '</td>';
			tableContent += '<td>' + this.priority +'</td>';
			tableContent += '<td><button type="button" class="linkdeletetask btn btn-danger btn-xs" rel="' + this._id + '">X</button></td>';
			tableContent += '</tr>';
		});

		//add content to the table
		$('#taskList table tbody').html(tableContent);
	});
}

//Add task
function addTask(event){
	
	event.preventDefault();

	//validate form

	var newTask = {
		'duedate': new Date($('#addTask fieldset input#inputTaskDuedate').val()),
		'task': $('#addTask fieldset input#inputTaskTask').val(),
		'priority': $('#addTask fieldset select#selectTaskPriority').val()
	}

	//ajax post to addtask service
	$.ajax({
		type: 'POST',
		data: newTask,
		url: '/tasks/addtask',
		dataType: 'JSON'
	}).done(function(response){
		
		//check for succesful response
		if(response.msg ===''){
			
			//clearn the form
			$('#addTask fieldset input').val('');

			//populate the table
			populateTable();

			//close modal
			$('#addTaskModal').modal('hide');

			//show success message

		} else {
			
			//display error
			alert('Error:: ' + response.msg);
		}

	});
}

//delete task
function deleteTask(event){

	event.preventDefault();

	//pop up confirmation
	var confirmation = confirm('Are you sure?');

	//delete if confirmed
	if (confirmation === true){

		$.ajax({
			type: 'DELETE',
			url: '/tasks/deletetask/' + $(this).attr('rel')
		}).done(function(response){

			//check for sucess
			if(response.msg !== ''){
				alert('Error: ' + response.msg);
			}

			//refresh the table
			populateTable();
		});
	} else {
		return false;
	}
}