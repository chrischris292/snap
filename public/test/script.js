var state = {
    S1: '',
    S2: ''
};

// dialog box for graph options
var $dialog = $(document.createElement('div')).appendTo($('body'));
// y axis elements container
var $yaxisElementsContainer = $(document.createElement('form'));
// y axis elements array
var yAxisElementsArray = [];
for (var prop in state) {
    yAxisElementsArray.push(prop);
    //$yaxisElementsContainer.prepend($(document.createElement('input')).attr('type', 'checkbox').attr('name', prop))
    var $checkbox = $(document.createElement('input')).attr('type', 'checkbox').attr('name', prop).appendTo($yaxisElementsContainer);
    $checkbox.after($(document.createElement('label')).html(prop));
//    $(document.createElement('label').attr('text',prop)).after($checkbox);
}
$yaxisElementsContainer.appendTo($dialog);