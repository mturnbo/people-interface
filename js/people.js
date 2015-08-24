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
			tableRow += '<td><a href="#" onclick="removePerson(' + personId + ');"> X </td>';
			tableRow += '</tr>';
			$("#personTable tbody").append(tableRow);
		});
	})
}

function getFamilies() {
	$.get('/people-api/family', function(data) {
        $('#peopleTable tbody > tr').remove();
        var families = data._embedded.family;
        $.each(families, function(index) {
	        var familyId = families[index]._links.self.href.split("/").pop();
	        var tableRow = '<tr>';
	        tableRow += '<td>' + families[index].name + '</td>';
	        tableRow += '<td><a href="#" onclick="removeFamily(' + familyId + ');"> X </td>';
	        tableRow += '</tr>';
            $("#familyTable tbody").append(tableRow);
        });
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

function removePerson(id) {
	if (confirm("Are you sure?")) {	
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

function removeFamily(id) {
	if (confirm("Are you sure?")) {		
		$.ajax({
			type: 'DELETE',
			url: '/people-api/family' + id,
			dataType: 'json',
			statusCode: {
				204: function() {
					getFamilies();
				}
	    	}
		});
	}
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
	
	getPeople();
	getFamilies();
});