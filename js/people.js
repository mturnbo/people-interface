function getPeople() {
    $.ajax({
        type: 'GET',
        url: '/people-api/person',
        success: function(data) {
	        $('#peopleTable tbody > tr').remove();
            var people = data._embedded.person;
            $.each(people, function(index) {
	            $("#personTable tbody").append('<tr><td>' + people[index].firstName + '</td><td>' + people[index].lastName + '</td><td>' + people[index].birthDate + '</td><</tr>');
            });
        }
    });	
}

function getFamilies() {
	$.ajax({
        type: 'GET',
        url: '/people-api/family',
        success: function(data) {
	        $('#peopleTable tbody > tr').remove();
            var families = data._embedded.family;
            $.each(families, function(index) {
	            $("#familyTable tbody").append('<tr><td>' + families[index].name + '</td></tr>');
            });
        }
    });	
}

$(document).ready(function() {
	getPeople();
	getFamilies();
});