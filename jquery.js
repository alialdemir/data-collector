var DomSelector = {

    selectable_doms: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "img", "a", "li", "b", "i", "strong",
        "span", "cite",
        "div:not(:has(div, p))",
        "td:not(:has(td, img))",
        "th", "dd", "dt", "code"
    ],


    disallowed_children: [
        "div",
        "p",
        "td",
        "img",
        "li"
    ],

    reserved_classnames: [
        "getdata-intro-modal",
        "getdata-sidebar",
        "getdata-selected_dom",
        "hopscotch-bubble",
        "hopscotch-bubble-container",
        "hopscotch-bubble-number",
        "hopscotch-bubble-content",
        "hopscotch-title",
        "hopscotch-content"
    ],

    reserved_class_characters: [
        "$",
        "(",
        ")",
        ":",
        ","
    ],

    ignored_siblings: [
        "#text",
        "#comment",
        "SCRIPT"
    ],

    ignored_doms: [
        "tbody",
        "thead"
    ],

    initialize: function (opts) {
        if (!opts || !opts.dom) {
            return;
        }

        var self = this;

        $(self.selectableDoms()).bind('click', function (e) {
            self.clickedOnSelectableDom(e);
        }).bind('mouseover', function (e) {
            self.mouseOverSelectableDom(e);
        }).bind('mouseout', function (e) {
            self.mouseOutSelectableDom(e);
        });
    },

    mouseOutSelectableDom: function (e) {
        e.stopPropagation();
        e.preventDefault();

        var self = this;
        var dom = e.target;

        self.clearMouseOverDom(dom);
    },

    clearMouseOverDom: function (dom) {
        $(dom).removeAttr("getdata_color");
        $(dom).removeClass('getdata-selectable-dom');
    },

    mouseOverSelectableDom: function (e) {
        e.stopPropagation();

        var self = this;
        var dom = e.currentTarget;

        $(dom).addClass('getdata-selectable-dom');
        $(dom).attr("getdata_color", self.getSelectableColor());
    },

    selectableDoms: function () {
        var self = this;
        var sds = self.selectable_doms.join(" , ");

        $sds = $(sds).filter(function (index, dom) {
            if (self.isReserved(dom)) return false;
            return true;
        });

        return $sds;
    },

    clickedOnSelectableDom: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var self = this;
        var dom = e.target;
        if (!self.isSelectable(dom)) {
            return;
        }

        self.clearMouseOverDom(dom);
        
        var new_dom_array = self.calculateNewDomArray(dom);
        var selector = self.getSelector(new_dom_array);

        self.write(selector);
        self.dressUpSelectedDoms(new_dom_array);

    },

    dressUpSelectedDoms: function (selector) {
        var self = this;
        $.each(selector, function (dom) {
            if (self.isReserved(dom) || self.selectedDomAlreadyDressedUp(dom)) return;
           
            $(dom).addClass('getdata-selected-dom');
        });
    },

    selectedDomAlreadyDressedUp: function (dom) {
        var self = this;
        return $(dom).hasClass('getdata-selected-dom');
    },

    write: function (selector) {
        var list = [];
        
        setInterval(() => {
            $(selector).each(function (i, el) {
                var text = $(el).text();
                if (!list.includes(text)) {
                    list.push(text);

                    console.log(text);
                }
            });

            console.log(list);
        }, 1000);
    },

    getSelector: function (new_dom_array) {
        var selector = '';

        $.each(new_dom_array, function (dom, elem) {

            selector += elem.el + elem.id + elem.class + ' ';
        });
console.log(selector);
        return selector;
    },

    isSelectable: function (dom) {
        var self = this;

        if (
            $(dom).find(
                self.disallowed_children.join(" , ")
            ).length > 0) {

            return false;
        }

        return !self.isReserved(dom);
    },

    isReserved: function (dom) {
        var self = this;
        var $dom = $(dom);
        var unselectable = false;

        self.reserved_classnames.forEach(function (u_dom) {
            if ($dom.hasClass(u_dom)) {
                unselectable = true;
            }
            if ($dom.parents("." + u_dom).length > 0) {
                unselectable = true;
            }
        });

        return unselectable;
    },

    calculateNewDomArray: function (dom) {
        var self = this;

        var new_dom_array = [];
        var curr_dom = dom;
        var max_depth = 15;
        var curr_depth = 0;

        do {
            // debugger;
            if (self.toBeDiscarded(curr_dom)) {
                continue;
            }

            var curr_hash = {};
            curr_hash.el = curr_dom.nodeName.toLowerCase();
            curr_hash.class = self.calculateClassName(curr_dom);
            curr_hash.id = self.calculateId(curr_dom);

            // Only use nth-child as a position if 
            //   the element does not already have a className or ID associated with it
            //   the position is more than 1
            if (self.needNthChildPosition(curr_dom)) {
                curr_hash.position = self.calculatePositionInLevel(curr_dom);
            }

            curr_depth += 1;
            new_dom_array.unshift(curr_hash);

        } while (
            (curr_dom = curr_dom.parentElement) &&
            curr_depth < max_depth &&
            curr_dom &&
            curr_dom.nodeName.toLowerCase() != "html"
        );

        return new_dom_array;
    },

    toBeDiscarded: function (dom) {
        var self = this;
        if (self.ignored_doms.indexOf(dom.nodeName.toLowerCase()) != -1) {
            return true;
        }

        return false;
    },

    calculateClassName: function (dom) {
        var self = this;

        if (!dom.className || dom.className.length == 0) return "";

        return dom.className
            .split(" ")
            .filter(function (class_name) {
                return class_name != 'getdata-selected-dom';
            })
            .filter(function (class_name) {
                var is_allowed = true;
                self.reserved_class_characters.forEach(function (reserved_char) {
                    if (class_name.includes(reserved_char)) {
                        is_allowed = false;
                    }
                })
                return is_allowed;
            })
            .map(function (class_name) {
                var class_name = class_name.trim();
                if (class_name.length > 0) return "." + class_name;
                return "";
            })
            .join("");
    },

    calculateId: function (dom) {
        if (dom.id && dom.id.length > 0) {
            return "#" + dom.id;
        }

        return "";
    },

    needNthChildPosition: function (dom) {
        var self = this;
        var domEl = dom.nodeName.toLowerCase();
        var domClassName = self.calculateClassName(dom);
        var domId = self.calculateId(dom);
        var calculated_position = self.calculatePositionInLevel(dom)
        if (
            domEl != "body" &&
            (
                (!domClassName || domClassName.length == 0) &&
                (!domId || domId.length == 0)
            ) &&
            calculated_position > 1
        ) {
            return true;

        } else if (
            domEl == "th" || domEl == "td"
        ) {
            return true;

        }
        return false;
    },

    calculatePositionInLevel: function (dom) {
        var self = this;
        var curr_dom = dom;
        var curr_pos = 1;
        while (curr_dom = curr_dom.previousSibling) {

            if (self.ignored_siblings.indexOf(curr_dom.nodeName.toLowerCase()) == -1) {
                curr_pos += 1;
            }

        };
        return curr_pos;
    },

    getSelectableColor: function () {
        var self = this;
        return "rgb(25, 25, 25, 0.5)";
    },
};

DomSelector.initialize({
    dom: $('body')
});


























.getdata-sidebar {
  background-color: #fff;
  box-shadow: 6px 1px 10px #888888;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 2147483640;
  font-family: "helvetica";
  font-weight: 100;  
  width: 100%;
}

.getdata-sidebar #getdata-header {
  height: 18px;
  padding-left: 15px;
  padding-top: 16px;
  padding-bottom: 16px;
  background-color: #c66a09;
  -webkit-box-sizing: content-box !important;
  box-sizing: content-box !important;
  width: 120px;
  float:left;  
}

.getdata-sidebar #getdata-header img {
  height: 18px;
  width: 22px;
  float: left;
  margin-right: 5px;
}

.getdata-sidebar #getdata-header div {
  height: 18px;
  width: 70px;
  font-size: 12px;
  line-height: 22px;
  text-transform:uppercase;
  color: #fff;
  float: left;
  text-align: left;
  white-space: nowrap;  
}

.getdata-sidebar #col_name_holder {
  height: 44px;
  float:left;
  max-width: 70%;
  margin-left: 20px;
  padding-top: 10px;  
}

.getdata-sidebar #col_name_holder #curr_col_name {
  color: #000;  
  height: 30px;
  font-size: 12px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  cursor: text;
  text-align: left;
  border-radius: 5px;
  outline: none;
  padding-left: 10px;
  padding-right: 10px;
  min-width: 175px;
  display: inline-block;  
  border: 1px solid #ccc;
}

.getdata-sidebar #col_name_holder #curr_col_name[contenteditable="false"] {
  color: #ccc;

}


.getdata-sidebar #selection_holder {
  height: 44px;
  float:left;
  max-width: 70%;
  margin-left: 20px;
  padding-top: 10px;
}

.getdata-sidebar #datasource_recommendations_holder {
  float: right;
  height: 28px;
  width: 100px;
  padding: 13px 5px 13px 5px;  
  cursor: pointer;
}

.getdata-sidebar #datasource_recommendations_holder #datasource_recommendations {
  width: 75px;
  padding-left: 10px;
  text-align: left;
  background: orange;
}

.getdata-sidebar #datasource_recommendations_holder #datasource_recommendations #datasource_recommendations_page {
  font-size: 13px;
  padding-left: 10px;
  display: inline-block;  
}


.getdata-sidebar #breadcrumbs {
  height: 10px;
  margin: 3px 0px;  
  text-align: left;  
  font-size: 10px;
  color: #413839;
  font-weight: normal;
  margin-right: 5px;  
}

.getdata-sidebar #breadcrumbs span.breadcrumb {
  font-size: 10px;
  color: #413839;
  font-weight: normal;
  margin-right: 5px;
}

.getdata-sidebar #breadcrumbs span.breadcrumb.current {
  color: #25383C;
  font-weight: bold;
}

.getdata-sidebar #columns {
  height: 28px !important;
}

.getdata-sidebar .column {
  cursor: pointer;
  margin-right: 5px;  
  border-radius: 5px;
  position: relative;
  width: 30px;
  float: left;
}

.getdata-sidebar .column .col-name {
  background-color: #b5b5c3;
  color: #000;  
  font-size: 12px;
  line-height: 20px;
  float: left;
  height: 20px;
  width: 105px;
  margin-top:     5px;
  margin-bottom:  5px;  
  margin-right:   8px;
  margin-left:    10px;  
  padding-left:   3px;
  padding-right:  3px;
  overflow: hidden;
  white-space: nowrap;
  cursor: text;
  text-align: left;
  border-radius: 2px;
  display: inline-block;
}

.getdata-sidebar .column .col-name:focus, .getdata-sidebar .column:hover .col-name {
  background-color: #fff;
  color: #000;
  outline: none;
}

.getdata-sidebar .column .col-name:focus, .getdata-sidebar .column.active .col-name {
  background-color: #fff;
  color: #000;
  outline: none;
}

.getdata-sidebar .column .stick-holder .stick-pagination {
  width: 4px;
  height: 20px;
  padding-right: 1px;
}

.getdata-sidebar .column .counter {
  width: 30px !important;  
  font-size: 12px !important;
  line-height: 30px !important;
  color: #fff !important;
  background-color: #ffcc99 !important;  
  border-radius:30px;
  border: 1px solid #ccc;  
  text-align: center;
  float: left;
  cursor: pointer;
  padding: 0px !important;
  height: 30px;
  margin: 0px;
  display: inline-block;

}

.getdata-sidebar .column.active .counter {
  background-color: #ff9933 !important;
}

.getdata-sidebar .column .delete {
  display: none;
  font-size: 6px;
  font-weight: lighter;
  background-color: #a00808;
  color: #fff;
  border-radius:5px;
  padding: 3px 3px;
  margin-top: 8px;
  margin-right: 5px;
  position: relative;
  top: -40px;
  left: 20px;
}

.getdata-sidebar .column:hover .delete {
  display: inline-block;
}

/** Color Scheming **/
[getdata_color] {
  cursor: pointer;
}

.getdata-selected_dom {
  position: absolute;
  box-shadow: 0 1px 2px rgba(0,0,0,.25);
  border-radius: 2px;
  padding: 2px 2px;
}

.getdata-sidebar .add_button_holder {
  float:left;  
  height: 28px;
  padding: 13px 30px 13px 0px ;
}

.getdata-sidebar .buttons_holder {
  float:right;  
  height: 28px;
  padding: 13px 5px 13px 5px ;
}

.getdata-sidebar .add_button_holder .getdata-sidebar-button {
  height: 25px;
  width: 25px;
  border-radius: 5px;
  float:left;
  margin-right: 5px;
  background-color: #086cb9;
  /*text-transform: uppercase;*/
  border: 1px #207ac0;
  color: #fff;
  cursor: pointer;
  text-align: center;
  font-size: 17px;
  line-height: 25px;
}

.getdata-sidebar .buttons_holder .getdata-sidebar-button {
  height: 25px;
  width: 100px;
  border-radius: 5px;
  float:left;
  margin-right: 5px;
  background-color: #086cb9;
  /*text-transform: uppercase;*/
  border: 1px #207ac0;
  color: #fff;
  cursor: pointer;
  text-align: center;
  font-size: 17px;
  line-height: 25px;
}

.getdata-sidebar .clearer {
  clear: both;
}

.getdata-sidebar .getdata-sidebar-button:hover {
  border: 1px #207ac0;
  -webkit-box-shadow: 0px 0px 2px 1px rgba(255, 255, 255, 0.4);
}

.getdata-sidebar #add_pagination {
  margin-bottom: 2px;
}

.getdata-sidebar #add_pagination.selecting {
  background-color: #0433b4;
}

.getdata-sidebar #add_pagination.selected {
  background-color: #8890a2;
}

.getdata-sidebar #add_pagination.dormant {
  background-color: #086cb9;
}

.getdata-sidebar #krake-tooltip {
  border-radius: 5px;
  padding: 5px;
  background-color: #e0ebeb;
  color: #000;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 10000;
  font-size: 11px;
  font-weight: bold;
  box-shadow: 2px 2px 5px rgba(50, 50, 50, 0.75);
  display: none;
}

/** In page styling for selected items **/
.getdata-selected-dom {
  background-color: #ffbf00 ;
  outline: solid 2px #ffbf00;
}

.getdata-selectable-dom {
  background-color: #ff9933;
  outline: solid 2px #ff9933;
}

.getdata-selected-page {
  background-color: #5e6c84 !important;
  outline: solid 2px #5e6c84 !important;  
}

.getdata-intro-modal .modal {
  z-index: 2147483641;
}

#getdata-intro-modal + .modal-backdrop.show{
  z-index: 2147483642;
}

#getdata-intro-modal {
  z-index: 2147483643;
}

#getdata-intro-modal .btn{
  cursor: pointer;
}