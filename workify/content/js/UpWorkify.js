var isDebug = false;
var apiRoot = "https://proposalapi.gear.host/api/proposals";
if (isDebug) {
    apiRoot = "http://localhost:56242/api/proposals";
}

function AppendDropDown() {
    $("header.nav-v2").css("background-color", "indigo");
    var $container = $("<div></div>").addClass("form-group up-form-group");
    var $label = $("<label></label>");
    $label.text("Template");
    $label.appendTo($container);
    var $select = $("<select></select>");
    $select.addClass("up-btn up-btn-default up-dropdown-toggle");
    var $table = $("<table></table>");
    var $tr = $("<tr></tr>");
    var $td = $("<td></td>");
    $select.appendTo($td);
    $td.appendTo($tr);
    //up-btn up-btn-primary m-0
    //var $trBtnEdit = $("<tr></tr>");
    var $tdBtnEdit = $("<td></td>");
    $tdBtnEdit.appendTo($tr);
    //$('<input type="button"/>').addClass("up-btn up-btn-primary m-0").val("➕ Add").appendTo($tdBtnEdit);
    var $btnUpdate = $('<input type="button"/>').addClass("up-btn up-btn-primary m-0").attr("id", "btnUpdate").val("Update");
    var $btnDelete = $('<input type="button"/>').addClass("up-btn up-btn-link m-0").attr("id", "btnDelete").val("Delete");
    $btnUpdate.appendTo($tdBtnEdit.appendTo($tr));

    var $tdBtnDelete = $("<td></td>");
    $tdBtnDelete.appendTo($tr);
    var $btnDelete = $('<input type="button"/>').addClass("up-btn up-btn-link m-0").attr("id", "btnDelete").val("Delete");
    $btnDelete.appendTo($tdBtnDelete.appendTo($tr));

    $btnUpdate.hide();
    $btnDelete.hide();
    $btnUpdate.click(function () {
        $.ajax({
            url: apiRoot,
            type: 'PUT',
            data: {
                'fileName': $select.val(),
                'contents': $textArea.val()
            },
            success: function (result) {
                // Do something with the result
            }
        });
    });
    $btnDelete.click(function () {
        if (confirm('Are you sure you want to delete the saved proposal "' + $select.val() + '"?')) {
            $.ajax({
                url: apiRoot,
                type: 'DELETE',
                data: {
                    'fileName': $select.val()
                },
                success: function (result) {
                    // Do something with the result
                    BindProposals($select, $btnUpdate, $btnDelete, $textArea);
                }
            });
        }
    });
    //$trBtnEdit.appendTo($table);
    $tr.appendTo($table);

    $table.appendTo($container);
    var $parent = $("#cover_letter_label").parents("section");
    $parent.prepend($container);

    var $textArea = $($parent.find("textarea"));

    BindProposals($select, $btnUpdate, $btnDelete, $textArea);

    $select.on("change", function () {
        var fileName = $(this).val();
        if (fileName != "0") {
            $btnUpdate.show();
            $btnDelete.show();
            $.get(apiRoot + "?fileName=" + fileName, function (data) {
                $textArea.val(data);
                $textArea.css("height", "350px");
            });
        } else {
            $textArea.val("");
            $btnUpdate.hide();
            $btnDelete.hide();
        }
    });
}

function BindProposals($select, $btnUpdate, $btnDelete, $textArea) {
    $select.empty();
    $('<option value="0">--Select Template--</option>').appendTo($select);
    $.get(apiRoot, function (data) {
        $(data).each(function (i, e) {
            var $option = $('<option value="' + e + '">' + e.substring(0, e.length - 4) + '</option>')
            $option.appendTo($select);
        });
    }).done(function () {
        $textArea.val("");
        $btnUpdate.hide();
        $btnDelete.hide();
    });
}

function checkFlag() {
    if ($("#dropdown-label-4") == null) {
        window.setTimeout(checkFlag, 500); /* this checks the flag every 100 milliseconds*/
    } else {
        /* do something*/
        window.setTimeout(AppendDropDown, 5000);
    }
}

$(document).ready(function () {
    //checkFlag(true);
    //$("body").empty();
    window.setTimeout(checkFlag, 3000);
});