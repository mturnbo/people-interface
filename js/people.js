function getPeople() {
	$.get('/people-api/person', function(data) {
		$('#personTable tbody > tr').remove();
		var people = data._embedded.person;
		$.each(people, function(index) {
			var personId = people[index]._links.self.href.split("/").pop();
			var tableRow = '<tr>';
			tableRow += '<td>' + people[index].firstName + '</td>';
			tableRow += '<td>' + people[index].lastName + '</td>';
			tableRow += '<td>' + people[index].birthDate + '</td>';
			tableRow += '<td><button class="pure-button editperson" data-id="' + personId 
				+ '" data-firstname="' + people[index].firstName 
				+ '" data-lastname="' + people[index].lastName 
				+ '" data-birthdate="' + people[index].birthDate 
				+ '">Edit</button></td>';
			tableRow += '<td><button class="pure-button removeperson" data-id="' + personId + '">Remove</button></td>';
			tableRow += '</tr>';
			$("#personTable tbody").append(tableRow);
		});
		setPersonButtonsClickEvents();
	});
	
}

function getFamilies() {
	$.get('/people-api/family', function(data) {
        $('#peopleTable tbody > tr').remove();
        var families = data._embedded.family;
        $.each(families, function(index) {
	        var familyId = families[index]._links.self.href.split("/").pop();
	        var tableRow = '<tr>';
	        tableRow += '<td>' + families[index].name + '</td>';
			tableRow += '<td><button class="pure-button editfamily" data-id="' + familyId + '">Edit</button></td>';
			tableRow += '<td><button class="pure-button removefamily" data-id="' + familyId + '">Remove</button></td>';
	        tableRow += '</tr>';
            $("#familyTable tbody").append(tableRow);
        });
        setPersonButtonsClickEvents();
    });	
}

function addPerson(newPerson) {
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: '/people-api/person',
		dataType: 'json',
		data: newPerson,
		statusCode: {
			201: function() {
				getPeople();
			}
    	}
	});
}

function editPerson(id, person) {
	$.ajax({
		type: 'PATCH',
		contentType: 'application/json',
		url: '/people-api/person/' + id,
		dataType: 'json',
		data: person,
		statusCode: {
			201: function() {
				getPeople();
			}
    	}
	});	
	$('#personEditContainer').fadeOut('fast', function() {
		$('#personTableContainer').slideDown();
	});	
}

function removePerson() {
	if (confirm("Are you sure?")) {	
		var id = $(this).data('id');
		$.ajax({
			type: 'DELETE',
			url: '/people-api/person' + id,
			dataType: 'json',
			statusCode: {
				204: function() {
					getPeople();
				}
	    	}
		});
	}
}

function addFamily(newFamily) {
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: '/people-api/family',
		dataType: 'json',
		data: newFamily,
		statusCode: {
			201: function() {
				getFamilies();
			}
    	}
	});
}

function removeFamily() {
	if (confirm("Are you sure?")) {		
		var id = $(this).data('id');
		$.ajax({
			type: 'DELETE',
			url: '/people-api/family/' + id,
			dataType: 'json',
			statusCode: {
				204: function() {
					getFamilies();
				}
	    	}
		});
	}
}

function setPersonButtonsClickEvents() {
	
	$('.editperson').click(function() {
		$('#editPersonId').val($(this).data('id'));
		$('#editPersonFirstname').val($(this).data('firstname'));
		$('#editPersonLastname').val($(this).data('lastname'));
		$('#editPersonBirthDate').val($(this).data('birthdate'));
		$('#personTableContainer').slideUp('fast', function() {
			$('#personEditContainer').fadeIn();
		});
	});
	
	$('.removeperson').click(function() {
		if (confirm("Are you sure?")) {	
			var id = $(this).data('id');
			$.ajax({
				type: 'DELETE',
				url: '/people-api/person/' + id,
				dataType: 'json',
				statusCode: {
					204: function() {
						getPeople();
					}
		    	}
			});
		}
	});
}


function setFamilyButtonsClickEvents() {
	
	$('.editfamily').click(function() {
		var id = $(this).data('id');
		$('#familyTableContainer').slideUp('fast', function() {
			$('#familyEditContainer').fadeIn();
		});
	});
	
	$('.removefamily').click(function() {
		if (confirm("Are you sure?")) {		
			var id = $(this).data('id');
			$.ajax({
				type: 'DELETE',
				url: '/people-api/family/' + id,
				dataType: 'json',
				statusCode: {
					204: function() {
						getFamilies();
					}
		    	}
			});
		}
	});
}

$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
 };

$(document).ready(function() {
	
	$('#frmNewPerson').submit(function() {
		var data = JSON.stringify($(this).serializeObject());
		addPerson(data);
		$(this).trigger('reset');
		return false;
	});
	
	$('#frmNewFamily').submit(function() {
		var data = JSON.stringify($(this).serializeObject());
		addFamily(data);
		$(this).trigger('reset');
		return false;
	});

	$('#frmEditPerson').submit(function() {
		var data = JSON.stringify($(this).serializeObject());
		var id = $('#editPersonId').val();
		editPerson(id, data);
		return false;
	});
	
	$('#btnEditPersonCancel').click(function() {
		$('#personEditContainer').fadeOut('fast', function() {
			$('#personTableContainer').slideDown();
		});	
		return false;	
	});
	
	$('#btnEditFamilyCancel').click(function() {
		$('#familyEditContainer').fadeOut('fast', function() {
			$('#familyTableContainer').slideDown();
		});	
		return false;	
	});
	
	getPeople();
	getFamilies();
	
});