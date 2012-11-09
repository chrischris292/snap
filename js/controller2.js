$(document).ready(function() {
    $("#dialog-form-species").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Ok: function() {
                $(this).dialog("close");
            }
        }
    });
    $("p").click(function() {
        $("#dialog-form-species").dialog("open");
    });
});