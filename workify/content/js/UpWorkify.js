var isDebug = true;
var apiRoot = "https://proposalapi.nitinsawant.com/api/proposals";
if (isDebug) {
    apiRoot = "http://localhost:5210/proposals";
}

function AppendDropDown() {
    $("header .nav-v2").css("background-color", "#F5F5DC");
    var $container = $("<div></div>").addClass("form-group up-form-group");
    var $label = $("<label></label>");
    $label.text("Template");
    $label.appendTo($container);
    var $select = $("<select></select>");
    $select.addClass("air3-btn air3-btn-primary air3-btn-block-sm").addClass("has-title");
    var $table = $("<table></table>");
    var $tr = $("<tr></tr>");
    var $td = $("<td></td>");
    $select.appendTo($td);
    $td.appendTo($tr);
    //up-btn up-btn-primary m-0
    //var $trBtnEdit = $("<tr></tr>");
    var $btnAdd = $('<input type="button"/>').addClass("air3-btn air3-btn-secondary air3-btn-block-sm").attr("id", "btnAdd").val("➕ Add");
    var $btnUpdate = $('<input type="button"/>').addClass("air3-btn air3-btn-secondary air3-btn-block-sm").attr("id", "btnUpdate").val("💾 Update");
    var $btnDelete = $('<input type="button"/>').addClass("air3-btn air3-btn-secondary air3-btn-block-sm").attr("id", "btnDelete").val("× Delete");

    var $tdBtnAdd = $("<td></td>");
    $tdBtnAdd.appendTo($tr);
    $btnAdd.appendTo($tdBtnAdd.appendTo($tr));

    var $tdBtnEdit = $("<td></td>");
    $tdBtnEdit.appendTo($tr);
    $btnUpdate.appendTo($tdBtnEdit.appendTo($tr));

    var $tdBtnDelete = $("<td></td>");
    $tdBtnDelete.appendTo($tr);
    $btnDelete.appendTo($tdBtnDelete.appendTo($tr));

    $btnUpdate.hide();
    $btnDelete.hide();
    $btnUpdate.click(function () {
        $.ajax({
            url: apiRoot,
            type: 'PUT',
            contentType: 'application/json; charset=utf8',
            data: JSON.stringify({
                'fileName': $select.val(),
                'contents': $textArea.val()
            }),
            success: function (result) {
                alert("Proposal saved successfully!");
                // Do something with the result
            }
        });
    });
    $btnDelete.click(function () {
        if (confirm('Are you sure you want to delete the saved proposal "' + $select.val() + '"?')) {
            $.ajax({
                url: apiRoot,
                type: 'DELETE',
                contentType: 'application/json; charset=utf8',
                data: JSON.stringify({
                    'fileName': $select.val()
                }),
                success: function (result) {
                    // Do something with the result
                    BindProposals($select, $btnUpdate, $btnDelete, $textArea);
                    alert("Proposal deleted successfully!");
                    if ($($select.find("option")).length == 0) {
                        $btnAdd.click();
                    }
                }
            });
        }
    });
    //$trBtnEdit.appendTo($table);

    $btnAdd.click(function () {
        $.ajax({
            url: apiRoot,
            type: 'PUT',
            contentType: 'application/json; charset=utf8',
            data: JSON.stringify({
                'fileName': "proposal v" + $($select.find("option")).length + ".txt",
                'contents': $textArea.val()
            }),
            success: function (result) {
                BindProposals($select, $btnUpdate, $btnDelete, $textArea);
                alert("New proposal template saved successfully!");
                // Do something with the result
            }
        });
    });

    $tr.appendTo($table);

    $table.appendTo($container);
    var $parent = $(".cover-letter-area").parents("section");
    $parent.prepend($container);

    var $textArea = $($parent.find("textarea"));

    BindProposals($select, $btnUpdate, $btnDelete, $textArea);

    $select.on("change", function () {
        var fileName = $(this).val();
        if (fileName != "0") {
            $btnUpdate.show();
            $btnDelete.show();
            $.post(apiRoot + "?fileName=" + fileName, function (data) {
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
            var $option = $('<option value="' + e + '">' + e.substring(0, e.length - 4) + '</option>');
            $option.addClass("air3-btn air3-btn-secondary air3-btn-block-sm");
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
