// menu creator
// requires jquery and jqueryui

// constructor
// INPUTS
// domLocation: where in the dom to place the menu
// menuStruct: an object that species the hierarchy of menu items
function Menu(domLocation, menuStruct) {
    this.$menu = $('<ul id="menu"></ul>'); // creates menu at given dom location
    this.$menu.appendTo(domLocation);
    this.buildMenu(this.$menu, menuStruct);
    this.$menu.menu();
}

Menu.prototype.buildMenu = function(ul, data) {
    $.each(data,

    function(index, item) {
        var li = $('<li id=' + item.id + '><a href="#">' + item.text + "</a></li>");
        li.appendTo(ul);
        if (typeof(item.children) === 'object') {
            var subUl = $('<ul> </ul>');
            subUl.appendTo(li);
            Menu.prototype.buildMenu(subUl, item.children);
        }
    });
};


