function getPeople() {
	$.get('/people-api/person', function(data) {
		$('#personTable tbody > tr').remove();
		var people = data._embedded.person;
		$.each(people, function(index) {
			$("#personTable tbody").append('<tr><td>' + people[index].firstName + '</td><td>' + people[index].lastName + '</td><td>' + people[index].birthDate + '</td><</tr>');
		});
	})
}

function getFamilies() {
	$.get('/people-api/family', function(data) {
        $('#peopleTable tbody > tr').remove();
        var families = data._embedded.family;
        $.each(families, function(index) {
            $("#familyTable tbody").append('<tr><td>' + families[index].name + '</td></tr>');
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