"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page");
var application_settings_1 = require("tns-core-modules/application-settings");
var supervisor_service_1 = require("./supervisor.service");
var supervisor_1 = require("./supervisor");
var sides_1 = require("./sides");
var attendence_1 = require("./attendence");
var router_1 = require("@angular/router");
var nativescript_angular_1 = require("nativescript-angular");
var connectivityModule = require("tns-core-modules/connectivity");
var SupervisorComponent = (function () {
    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    function SupervisorComponent(page, service, router, routerExtensions) {
        this.page = page;
        this.service = service;
        this.router = router;
        this.routerExtensions = routerExtensions;
        //public users:string[]=["Ali","Amir","Zubair"];
        this.favourit_emy = [];
        this.other_emy = [];
        this.attendence = [];
        this.absents = [];
        this.sides = [];
        this.overtime = ["0", "1", "2", "3"];
        this.select_side = "Select Side Name";
        this.select_overtime = "Add overtime";
    }
    SupervisorComponent.prototype.ngOnInit = function () {
        this.main_funcation();
    };
    SupervisorComponent.prototype.main_funcation = function () {
        var connectionType = connectivityModule.getConnectionType();
        switch (connectionType) {
            case connectivityModule.connectionType.none:
                // Denotes no Internet connection.
                console.log("No connection");
                this.internet = false;
                break;
            case connectivityModule.connectionType.wifi:
                // Denotes a WiFi connection.
                console.log("WiFi connection");
                this.internet = true;
                break;
            case connectivityModule.connectionType.mobile:
                // Denotes a mobile connection, i.e. cellular network or WAN.
                console.log("Mobile connection");
                this.internet = true;
                break;
            default:
                break;
        }
        if (application_settings_1.getString("token") == undefined || application_settings_1.getString("token") == "") {
            // this.router.navigate(["/login"]);
            this.routerExtensions.navigate(["/login"], {
                clearHistory: true
            });
        }
        else {
            if (this.internet == true) {
                this.get_Supervisor_user_from_api();
                this.get_Supervisor_sides_from_api();
            }
        }
    };
    SupervisorComponent.prototype.get_Supervisor_sides_from_api = function () {
        var _this = this;
        this.service
            .get_supervisor_sides({ id: application_settings_1.getString("id") })
            .subscribe(function (res) {
            console.log("sides");
            var string_response = JSON.stringify(res);
            var helper = JSON.parse(string_response);
            for (var i = 0; i < helper._body.projects.length; i++) {
                var side = new sides_1.Sides(helper._body.projects[i].id, helper._body.projects[i].urduname);
                _this.sides.push(side);
            }
        }, function (error) {
            var string_response = JSON.stringify(error);
            //alert("user not exsist");
            alert(JSON.stringify(error._body.message));
        });
    };
    SupervisorComponent.prototype.get_Supervisor_user_from_api = function () {
        var _this = this;
        this.service
            .get_supervisor_users()
            .subscribe(function (res) {
            console.log("succes");
            var string_response = JSON.stringify(res);
            var helper = JSON.parse(string_response);
            /* console.log("-------------------------------------------");
                     console.log(JSON.stringify(helper._body.previous));
             console.log("------------------------------------");*/
            var d = new Date(helper._body.date);
            _this.today = d.getDate() + "-" + Number(d.getMonth() + 1) + "-" + d.getFullYear();
            application_settings_1.setString("date", d.getFullYear() + "-" + Number(d.getMonth() + 1) + "-" + d.getDate());
            // console.log(this.today);
            for (var i = 0; i < helper._body.response.length; i++) {
                var user = new supervisor_1.users(helper._body.response[i].id, helper._body.response[i].name, helper._body.response[i].urdu_name, helper._body.response[i].profession, "", "", "checkempty");
                if (helper._body.response[i].status == "working") {
                    console.log(application_settings_1.getString("id") + "-----" + helper._body.response[i].supervisor_id);
                    if (helper._body.response[i].supervisor_id == application_settings_1.getString("id")) {
                        _this.favourit_emy.push(user);
                    }
                    else {
                        _this.other_emy.push(user);
                    }
                }
            }
            /////checking if already attendence added
            for (var i = 0; i < helper._body.previous.length; i++) {
                for (var k = 0; k < _this.favourit_emy.length; k++) {
                    if (_this.favourit_emy[k].id == helper._body.previous[i].id) {
                        _this.favourit_emy.splice(k, 1);
                    }
                }
                for (var l = 0; l < _this.other_emy.length; l++) {
                    if (_this.other_emy[l].id == helper._body.previous[i].id) {
                        _this.other_emy.splice(l, 1);
                    }
                }
            }
            //    console.log("----------ffff---------" + JSON.stringify(this.favourit_emy));
            //   console.log("----------others---------" + JSON.stringify(this.other_emy));
        }, function (error) {
            var string_response = JSON.stringify(error);
            //alert("user not exsist");
            alert(JSON.stringify(error._body.message));
        });
    };
    ////////////////////for tabview
    SupervisorComponent.prototype.onIndexChanged = function (args) {
        //  alert(args.object+args.object.index);
    };
    SupervisorComponent.prototype.gotoattendence = function () {
        if (this.internet) {
            var ablayout = this.page.getViewById("presentlayout");
            ablayout.visibility = "visible";
        }
    };
    SupervisorComponent.prototype.gotoabsent = function () {
        if (this.internet) {
            var ablayout = this.page.getViewById("abesntlayout");
            ablayout.visibility = "visible";
        }
    };
    SupervisorComponent.prototype.onUserListItemTap = function (args, status) {
        this.list_index = args.index;
        this.user_list_type = status;
        var ab = this.page.getViewById("selectworkedside");
        if (ab.visibility == "visible") {
            ab.visibility = "collapse";
        }
        else {
            if (status == 1) {
                if (this.favourit_emy[args.index].src == "checked") {
                    this.favourit_emy[args.index].src = "checkempty";
                    for (var i = 0; i < this.attendence.length; i++) {
                        console.log(this.attendence[i].id + "-----------------" + this.favourit_emy[this.list_index].id);
                        if (this.attendence[i].id == this.favourit_emy[args.index].id) {
                            this.attendence.splice(i, 1);
                        }
                    }
                }
                else {
                    var ablayout = this.page.getViewById("selectworkedside");
                    ablayout.visibility = "visible";
                    var ablayout1 = this.page.getViewById("presentlayout");
                    ablayout1.opacity = 1;
                }
            }
            else {
                if (this.other_emy[args.index].src == "checked") {
                    this.other_emy[args.index].src = "checkempty";
                    for (var i = 0; i < this.attendence.length; i++) {
                        console.log(this.attendence[i].id + "-----------------" + this.other_emy[this.list_index].id);
                        if (this.attendence[i].id == this.other_emy[args.index].id) {
                            this.attendence.splice(i, 1);
                        }
                    }
                }
                else {
                    var ablayout = this.page.getViewById("selectworkedside");
                    ablayout.visibility = "visible";
                    var ablayout1 = this.page.getViewById("presentlayout");
                    ablayout1.opacity = 1;
                }
            }
        }
    };
    SupervisorComponent.prototype.onAbsentListItemTap = function (args, status) {
        if (status == 1) {
            if (this.favourit_emy[args.index].src == "checked") {
                this.favourit_emy[args.index].src = "checkempty";
                for (var i = 0; i < this.absents.length; i++) {
                    if (this.absents[i].id == this.favourit_emy[args.index].id) {
                        this.absents.splice(i, 1);
                    }
                }
            }
            else {
                var btn = this.page.getViewById("submit_attendencebtn");
                btn.visibility = "visible";
                this.favourit_emy[args.index].src = "checked";
                var rec = new attendence_1.Attendence(this.favourit_emy[args.index].id, this.favourit_emy[args.index].name, "", "", "A", application_settings_1.getString("name"), application_settings_1.getString("date"));
                this.absents.push(rec);
            }
        }
        else {
            if (this.other_emy[args.index].src == "checked") {
                this.other_emy[args.index].src = "checkempty";
                for (var i = 0; i < this.absents.length; i++) {
                    if (this.absents[i].id == this.other_emy[args.index].id) {
                        this.absents.splice(i, 1);
                    }
                }
            }
            else {
                var btn = this.page.getViewById("submit_attendencebtn");
                btn.visibility = "visible";
                this.other_emy[args.index].src = "checked";
                var rec = new attendence_1.Attendence(this.other_emy[args.index].id, this.other_emy[args.index].name, "", "", "A", application_settings_1.getString("name"), application_settings_1.getString("date"));
                this.absents.push(rec);
            }
        }
        console.log(JSON.stringify(this.absents));
    };
    SupervisorComponent.prototype.empty = function () {
        var ablayout = this.page.getViewById("selectworkedside");
        if (ablayout.visibility == "visible") {
            ablayout.visibility = "collapse";
            var ablayout1 = this.page.getViewById("presentlayout");
            ablayout1.opacity = 1;
        }
    };
    SupervisorComponent.prototype.empty1 = function () {
    };
    SupervisorComponent.prototype.selectside = function () {
        console.log("called");
        var ablayout = this.page.getViewById("selectsidedetail");
        ablayout.visibility = "visible";
    };
    SupervisorComponent.prototype.onselecsidedetail = function (args) {
        var ablayout = this.page.getViewById("selectsidedetail");
        ablayout.visibility = "collapse";
        this.select_side = this.sides[args.index].id;
        this.info = "";
    };
    SupervisorComponent.prototype.selectovertime = function () {
        var ablayout = this.page.getViewById("selectovertime");
        ablayout.visibility = "visible";
    };
    SupervisorComponent.prototype.onOvertimeDetail = function (args) {
        var ablayout = this.page.getViewById("selectovertime");
        ablayout.visibility = "collapse";
        this.select_overtime = this.overtime[args.index];
    };
    SupervisorComponent.prototype.onCanceldetail = function () {
        var ablayout = this.page.getViewById("selectworkedside");
        ablayout.visibility = "collapse";
        var ablayout1 = this.page.getViewById("presentlayout");
        ablayout1.opacity = 1;
        this.info = "";
    };
    SupervisorComponent.prototype.onSubmitdetail = function () {
        if (this.select_side == "Select Side Name") {
            this.info = "Please add side detail";
        }
        else {
            if (this.user_list_type == 1) {
                if (this.select_overtime == "Add overtime") {
                    this.favourit_emy[this.list_index].src = "checked";
                    this.favourit_emy[this.list_index].sidename = this.select_side;
                    this.favourit_emy[this.list_index].overtime = this.select_overtime;
                    var att = new attendence_1.Attendence(this.favourit_emy[this.list_index].id, this.favourit_emy[this.list_index].name, this.favourit_emy[this.list_index].sidename, "0", "P", application_settings_1.getString("name"), application_settings_1.getString("date"));
                    this.attendence.push(att);
                }
                else {
                    this.favourit_emy[this.list_index].src = "checked";
                    this.favourit_emy[this.list_index].sidename = this.select_side;
                    this.favourit_emy[this.list_index].overtime = this.select_overtime;
                    var att = new attendence_1.Attendence(this.favourit_emy[this.list_index].id, this.favourit_emy[this.list_index].name, this.favourit_emy[this.list_index].sidename, this.favourit_emy[this.list_index].overtime, "P", application_settings_1.getString("name"), application_settings_1.getString("date"));
                    this.attendence.push(att);
                }
            }
            else {
                if (this.select_overtime == "Add overtime") {
                    this.other_emy[this.list_index].src = "checked";
                    this.other_emy[this.list_index].sidename = this.select_side;
                    this.other_emy[this.list_index].overtime = this.select_overtime;
                    var att = new attendence_1.Attendence(this.other_emy[this.list_index].id, this.other_emy[this.list_index].name, this.other_emy[this.list_index].sidename, "0", "P", application_settings_1.getString("name"), application_settings_1.getString("date"));
                    this.attendence.push(att);
                }
                else {
                    this.other_emy[this.list_index].src = "checked";
                    this.other_emy[this.list_index].sidename = this.select_side;
                    this.other_emy[this.list_index].overtime = this.select_overtime;
                    var att = new attendence_1.Attendence(this.other_emy[this.list_index].id, this.other_emy[this.list_index].name, this.other_emy[this.list_index].sidename, this.other_emy[this.list_index].overtime, "P", application_settings_1.getString("name"), application_settings_1.getString("date"));
                    this.attendence.push(att);
                }
            }
            var btn = this.page.getViewById("submitattence_btn");
            btn.visibility = "visible";
            var ablayout = this.page.getViewById("selectworkedside");
            ablayout.visibility = "collapse";
            var ablayout1 = this.page.getViewById("presentlayout");
            ablayout1.opacity = 1;
            this.info = "";
            this.select_side = "Select Side Name";
            this.select_overtime = "Add overtime";
            this.other_emy[this.list_index].overtime = "0";
            this.favourit_emy[this.list_index].overtime = "0";
        }
    };
    SupervisorComponent.prototype.goBack = function () {
        var ablayout = this.page.getViewById("abesntlayout");
        ablayout.visibility = "collapse";
        var ablayout1 = this.page.getViewById("presentlayout");
        ablayout1.visibility = "collapse";
        var ablayout2 = this.page.getViewById("selectworkedside");
        ablayout2.visibility = "collapse";
        var ablayout3 = this.page.getViewById("selectsidedetail");
        ablayout3.visibility = "collapse";
        var ablayout4 = this.page.getViewById("selectovertime");
        ablayout4.visibility = "collapse";
    };
    SupervisorComponent.prototype.Submit_absents = function () {
        var _this = this;
        if (this.absents.length == 0) {
            alert("Please mark atleast one absent before submit.");
        }
        else {
            //console.log(JSON.stringify(this.attendence));
            this.service
                .submit_attendence_api({ data: this.absents })
                .subscribe(function (res) {
                console.log("succes attendence");
                var string_response = JSON.stringify(res);
                var helper = JSON.parse(string_response);
                // console.log(JSON.stringify(helper));
                if (helper.status == 200) {
                    for (var i = 0; i < _this.absents.length; i++) {
                        //////match record in favourit employee arrey
                        for (var j = 0; j < _this.favourit_emy.length; j++) {
                            if (_this.absents[i].id == _this.favourit_emy[j].id) {
                                _this.favourit_emy.splice(j, 1);
                            }
                        }
                    }
                    for (var i = 0; i < _this.absents.length; i++) {
                        ////match record from others employee array
                        for (var k = 0; k < _this.other_emy.length; k++) {
                            if (_this.absents[i].id == _this.other_emy[k].id) {
                                _this.other_emy.splice(k, 1);
                            }
                        }
                    }
                    var btn = _this.page.getViewById("submit_attendencebtn");
                    btn.visibility = "collapse";
                    alert("Opertation succeeded");
                }
                else {
                    alert("problem occurred while submitting the attendence.");
                }
            }, function (error) {
                var string_response = JSON.stringify(error);
                //alert("user not exsist");
                alert(JSON.stringify(error._body.message));
            });
        }
    };
    SupervisorComponent.prototype.Submit_Attendence = function () {
        var _this = this;
        if (this.attendence.length == 0) {
            alert("Please mark atleast one attendence before submit.");
        }
        else {
            //console.log(JSON.stringify(this.attendence));
            this.service
                .submit_attendence_api({ data: this.attendence })
                .subscribe(function (res) {
                console.log("succes attendence");
                var string_response = JSON.stringify(res);
                var helper = JSON.parse(string_response);
                // console.log(JSON.stringify(helper));
                if (helper.status == 200) {
                    for (var i = 0; i < _this.attendence.length; i++) {
                        //////match record in favourit employee arrey
                        for (var j = 0; j < _this.favourit_emy.length; j++) {
                            if (_this.attendence[i].id == _this.favourit_emy[j].id) {
                                _this.favourit_emy.splice(j, 1);
                            }
                        }
                    }
                    for (var i = 0; i < _this.attendence.length; i++) {
                        ////match record from others employee array
                        for (var k = 0; k < _this.other_emy.length; k++) {
                            if (_this.attendence[i].id == _this.other_emy[k].id) {
                                _this.other_emy.splice(k, 1);
                            }
                        }
                    }
                    var btn = _this.page.getViewById("submitattence_btn");
                    btn.visibility = "collapse";
                    alert("Opertation succeeded");
                }
                else {
                    alert("problem occurred while submitting the attendence.");
                }
            }, function (error) {
                var string_response = JSON.stringify(error);
                //alert("user not exsist");
                alert(JSON.stringify(error._body.message));
            });
        }
    };
    SupervisorComponent.prototype.view_attendence = function () {
        if (this.internet) {
            this.router.navigate(["/view-attendence"]);
        }
    };
    ////////////////////////////////////////////////////////screen tap event
    SupervisorComponent.prototype.onTap = function (args) {
        this.main_funcation();
    };
    SupervisorComponent = __decorate([
        core_1.Component({
            selector: "ns-items",
            moduleId: module.id,
            templateUrl: "./supervisor.component.html",
            styleUrls: ["supervisor.css"]
        }),
        __metadata("design:paramtypes", [page_1.Page, supervisor_service_1.SupervisorService, router_1.Router, nativescript_angular_1.RouterExtensions])
    ], SupervisorComponent);
    return SupervisorComponent;
}());
exports.SupervisorComponent = SupervisorComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJ2aXNvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdXBlcnZpc29yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFnRDtBQUVoRCxpREFBOEM7QUFVOUMsOEVBTytDO0FBQy9DLDJEQUF1RDtBQUN2RCwyQ0FBbUM7QUFDbkMsaUNBQThCO0FBRTlCLDJDQUF3QztBQUV4QywwQ0FBdUM7QUFDdkMsNkRBQXNEO0FBRXRELElBQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFPcEU7SUFxQkksNElBQTRJO0lBQzVJLGlIQUFpSDtJQUNqSCw2QkFBb0IsSUFBVSxFQUFVLE9BQTBCLEVBQVUsTUFBYSxFQUFTLGdCQUFrQztRQUFoSCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBbUI7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFPO1FBQVMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQWxCcEksZ0RBQWdEO1FBQ3pDLGlCQUFZLEdBQWEsRUFBRSxDQUFDO1FBQzVCLGNBQVMsR0FBYSxFQUFFLENBQUM7UUFDekIsZUFBVSxHQUFrQixFQUFFLENBQUM7UUFDL0IsWUFBTyxHQUFrQixFQUFFLENBQUM7UUFFNUIsVUFBSyxHQUFZLEVBQUUsQ0FBQztRQUNwQixhQUFRLEdBQWEsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6QyxnQkFBVyxHQUFXLGtCQUFrQixDQUFDO1FBQ3pDLG9CQUFlLEdBQVcsY0FBYyxDQUFDO0lBVWhELENBQUM7SUFFRCxzQ0FBUSxHQUFSO1FBR0ksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCw0Q0FBYyxHQUFkO1FBR0ksSUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUU5RCxNQUFNLENBQUMs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LENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUU1QywyQkFBMkI7Z0JBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUcvQyxDQUFDLENBQUMsQ0FBQztRQUNmLENBQUM7SUFHTCxDQUFDO0lBRUQsNkNBQWUsR0FBZjtRQUVJLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFDO1lBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQztJQUtMLENBQUM7SUFDTCx3RUFBd0U7SUFDcEUsbUNBQUssR0FBTCxVQUFNLElBQXNCO1FBQzFCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUV4QixDQUFDO0lBM3BCUSxtQkFBbUI7UUFOL0IsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsNkJBQTZCO1lBQzFDLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO1NBQ2hDLENBQUM7eUNBd0I0QixXQUFJLEVBQW1CLHNDQUFpQixFQUFpQixlQUFNLEVBQTJCLHVDQUFnQjtPQXZCM0gsbUJBQW1CLENBK3BCL0I7SUFBRCwwQkFBQztDQUFBLEFBL3BCRCxJQStwQkM7QUEvcEJZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7VGV4dEZpZWxkfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS90ZXh0LWZpZWxkXCI7XHJcbmltcG9ydCB7UGFnZX0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvcGFnZVwiO1xyXG5pbXBvcnQge1N0YWNrTGF5b3V0fSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9sYXlvdXRzL3N0YWNrLWxheW91dFwiO1xyXG5pbXBvcnQge0ltYWdlfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9pbWFnZVwiO1xyXG5pbXBvcnQge0Fic29sdXRlTGF5b3V0fSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9sYXlvdXRzL2Fic29sdXRlLWxheW91dFwiO1xyXG5pbXBvcnQge0ZvbnRXZWlnaHQsIEtleWJvYXJkVHlwZX0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZW51bXNcIjtcclxuaW1wb3J0IGJsYWNrID0gRm9udFdlaWdodC5ibGFjaztcclxuaW1wb3J0IHtUYWJWaWV3fSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS90YWItdmlld1wiO1xyXG5pbXBvcnQge0dyaWRMYXlvdXR9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2xheW91dHMvZ3JpZC1sYXlvdXRcIjtcclxuaW1wb3J0IHtTZWxlY3RlZEluZGV4Q2hhbmdlZEV2ZW50RGF0YX0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd25cIjtcclxuaW1wb3J0IHtEcm9wRG93bn0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd25cIjtcclxuaW1wb3J0IHtcclxuICAgIHNldFN0cmluZyxcclxuICAgIGdldFN0cmluZyxcclxuICAgIHNldE51bWJlcixcclxuICAgIGdldE51bWJlcixcclxuICAgIHNldEJvb2xlYW4sXHJcbiAgICBnZXRCb29sZWFuXHJcbn0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0IHtTdXBlcnZpc29yU2VydmljZX0gZnJvbSBcIi4vc3VwZXJ2aXNvci5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7dXNlcnN9IGZyb20gXCIuL3N1cGVydmlzb3JcIjtcclxuaW1wb3J0IHtTaWRlc30gZnJvbSBcIi4vc2lkZXNcIjtcclxuaW1wb3J0IG51bWJlciA9IEtleWJvYXJkVHlwZS5udW1iZXI7XHJcbmltcG9ydCB7QXR0ZW5kZW5jZX0gZnJvbSBcIi4vYXR0ZW5kZW5jZVwiO1xyXG5pbXBvcnQge0J1dHRvbn0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvYnV0dG9uXCI7XHJcbmltcG9ydCB7Um91dGVyfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7Um91dGVyRXh0ZW5zaW9uc30gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyXCI7XHJcbmltcG9ydCB7R2VzdHVyZUV2ZW50RGF0YX0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZ2VzdHVyZXNcIjtcclxuY29uc3QgY29ubmVjdGl2aXR5TW9kdWxlID0gcmVxdWlyZShcInRucy1jb3JlLW1vZHVsZXMvY29ubmVjdGl2aXR5XCIpO1xyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcIm5zLWl0ZW1zXCIsXHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9zdXBlcnZpc29yLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgICBzdHlsZVVybHM6IFtcInN1cGVydmlzb3IuY3NzXCJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTdXBlcnZpc29yQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBwdWJsaWMgaWQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBwYXNzd29yZDogc3RyaW5nO1xyXG5cclxuICAgIC8vcHVibGljIHVzZXJzOnN0cmluZ1tdPVtcIkFsaVwiLFwiQW1pclwiLFwiWnViYWlyXCJdO1xyXG4gICAgcHVibGljIGZhdm91cml0X2VteTogdXNlcnMgW10gPSBbXTtcclxuICAgIHB1YmxpYyBvdGhlcl9lbXk6IHVzZXJzIFtdID0gW107XHJcbiAgICBwdWJsaWMgYXR0ZW5kZW5jZTogQXR0ZW5kZW5jZSBbXSA9IFtdO1xyXG4gICAgcHVibGljIGFic2VudHM6IEF0dGVuZGVuY2UgW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgc2lkZXM6IFNpZGVzW10gPSBbXTtcclxuICAgIHB1YmxpYyBvdmVydGltZTogc3RyaW5nW10gPSBbXCIwXCIsXCIxXCIsIFwiMlwiLCBcIjNcIl07XHJcbiAgICBwdWJsaWMgc2VsZWN0X3NpZGU6IHN0cmluZyA9IFwiU2VsZWN0IFNpZGUgTmFtZVwiO1xyXG4gICAgcHVibGljIHNlbGVjdF9vdmVydGltZTogc3RyaW5nID0gXCJBZGQgb3ZlcnRpbWVcIjtcclxuICAgIHB1YmxpYyBpbmZvOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdG9kYXk6IGFueTtcclxuXHJcbiAgICBwdWJsaWMgbGlzdF9pbmRleDogYW55O1xyXG4gICAgcHVibGljIHVzZXJfbGlzdF90eXBlOiBhbnk7XHJcbiAgICBwdWJsaWMgaW50ZXJuZXQ6IGJvb2xlYW47XHJcbiAgICAvLyBUaGlzIHBhdHRlcm4gbWFrZXMgdXNlIG9mIEFuZ3VsYXLigJlzIGRlcGVuZGVuY3kgaW5qZWN0aW9uIGltcGxlbWVudGF0aW9uIHRvIGluamVjdCBhbiBpbnN0YW5jZSBvZiB0aGUgSXRlbVNlcnZpY2Ugc2VydmljZSBpbnRvIHRoaXMgY2xhc3MuXHJcbiAgICAvLyBBbmd1bGFyIGtub3dzIGFib3V0IHRoaXMgc2VydmljZSBiZWNhdXNlIGl0IGlzIGluY2x1ZGVkIGluIHlvdXIgYXBw4oCZcyBtYWluIE5nTW9kdWxlLCBkZWZpbmVkIGluIGFwcC5tb2R1bGUudHMuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgc2VydmljZTogU3VwZXJ2aXNvclNlcnZpY2UscHJpdmF0ZSAgcm91dGVyOlJvdXRlcixwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMpIHtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuXHJcblxyXG4gICAgICAgIHRoaXMubWFpbl9mdW5jYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWluX2Z1bmNhdGlvbigpe1xyXG5cclxuXHJcbiAgICAgICAgY29uc3QgY29ubmVjdGlvblR5cGUgPSBjb25uZWN0aXZpdHlNb2R1bGUuZ2V0Q29ubmVjdGlvblR5cGUoKTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChjb25uZWN0aW9uVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIGNvbm5lY3Rpdml0eU1vZHVsZS5jb25uZWN0aW9uVHlwZS5ub25lOlxyXG4gICAgICAgICAgICAgICAgLy8gRGVub3RlcyBubyBJbnRlcm5ldCBjb25uZWN0aW9uLlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBjb25uZWN0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcm5ldD1mYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNvbm5lY3Rpdml0eU1vZHVsZS5jb25uZWN0aW9uVHlwZS53aWZpOlxyXG4gICAgICAgICAgICAgICAgLy8gRGVub3RlcyBhIFdpRmkgY29ubmVjdGlvbi5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2lGaSBjb25uZWN0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcm5ldD10cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY29ubmVjdGl2aXR5TW9kdWxlLmNvbm5lY3Rpb25UeXBlLm1vYmlsZTpcclxuICAgICAgICAgICAgICAgIC8vIERlbm90ZXMgYSBtb2JpbGUgY29ubmVjdGlvbiwgaS5lLiBjZWxsdWxhciBuZXR3b3JrIG9yIFdBTi5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTW9iaWxlIGNvbm5lY3Rpb25cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmludGVybmV0PXRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZ2V0U3RyaW5nKFwidG9rZW5cIik9PXVuZGVmaW5lZCB8fCBnZXRTdHJpbmcoXCJ0b2tlblwiKT09XCJcIilcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbG9naW5cIl0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCIvbG9naW5cIl0sIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySGlzdG9yeTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5pbnRlcm5ldD09dHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0X1N1cGVydmlzb3JfdXNlcl9mcm9tX2FwaSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRfU3VwZXJ2aXNvcl9zaWRlc19mcm9tX2FwaSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldF9TdXBlcnZpc29yX3NpZGVzX2Zyb21fYXBpKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNlcnZpY2VcclxuICAgICAgICAgICAgLmdldF9zdXBlcnZpc29yX3NpZGVzKHtpZDogZ2V0U3RyaW5nKFwiaWRcIil9KVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaWRlc1wiKTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5nX3Jlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGVscGVyID0gSlNPTi5wYXJzZShzdHJpbmdfcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDxoZWxwZXIuX2JvZHkucHJvamVjdHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IFNpZGVzKGhlbHBlci5fYm9keS5wcm9qZWN0c1tpXS5pZCwgaGVscGVyLl9ib2R5LnByb2plY3RzW2ldLnVyZHVuYW1lKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNpZGVzLnB1c2goc2lkZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5nX3Jlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KFwidXNlciBub3QgZXhzaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGVycm9yLl9ib2R5Lm1lc3NhZ2UpKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXRfU3VwZXJ2aXNvcl91c2VyX2Zyb21fYXBpKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNlcnZpY2VcclxuICAgICAgICAgICAgLmdldF9zdXBlcnZpc29yX3VzZXJzKClcclxuICAgICAgICAgICAgLnN1YnNjcmliZShyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5nX3Jlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGVscGVyID0gSlNPTi5wYXJzZShzdHJpbmdfcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgLyogY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoaGVscGVyLl9ib2R5LnByZXZpb3VzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7Ki9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGQgPSBuZXcgRGF0ZShoZWxwZXIuX2JvZHkuZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2RheSA9IGQuZ2V0RGF0ZSgpICsgXCItXCIgKyBOdW1iZXIoZC5nZXRNb250aCgpKzEpICsgXCItXCIgKyBkLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0U3RyaW5nKFwiZGF0ZVwiLGQuZ2V0RnVsbFllYXIoKStcIi1cIitOdW1iZXIoZC5nZXRNb250aCgpKzEpK1wiLVwiK2QuZ2V0RGF0ZSgpKTtcclxuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudG9kYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlbHBlci5fYm9keS5yZXNwb25zZS5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXIgPSBuZXcgdXNlcnMoaGVscGVyLl9ib2R5LnJlc3BvbnNlW2ldLmlkLCBoZWxwZXIuX2JvZHkucmVzcG9uc2VbaV0ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlbHBlci5fYm9keS5yZXNwb25zZVtpXS51cmR1X25hbWUsIGhlbHBlci5fYm9keS5yZXNwb25zZVtpXS5wcm9mZXNzaW9uLCBcIlwiLCBcIlwiLCBcImNoZWNrZW1wdHlcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihoZWxwZXIuX2JvZHkucmVzcG9uc2VbaV0uc3RhdHVzPT1cIndvcmtpbmdcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhnZXRTdHJpbmcoXCJpZFwiKSArXCItLS0tLVwiK2hlbHBlci5fYm9keS5yZXNwb25zZVtpXS5zdXBlcnZpc29yX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWxwZXIuX2JvZHkucmVzcG9uc2VbaV0uc3VwZXJ2aXNvcl9pZCA9PSBnZXRTdHJpbmcoXCJpZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15LnB1c2godXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXkucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vLy8vY2hlY2tpbmcgaWYgYWxyZWFkeSBhdHRlbmRlbmNlIGFkZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxoZWxwZXIuX2JvZHkucHJldmlvdXMubGVuZ3RoO2krKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaz0wO2s8dGhpcy5mYXZvdXJpdF9lbXkubGVuZ3RoO2srKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmZhdm91cml0X2VteVtrXS5pZD09aGVscGVyLl9ib2R5LnByZXZpb3VzW2ldLmlkKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXkuc3BsaWNlKGssMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgbD0wO2w8dGhpcy5vdGhlcl9lbXkubGVuZ3RoO2wrKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5vdGhlcl9lbXlbbF0uaWQ9PWhlbHBlci5fYm9keS5wcmV2aW91c1tpXS5pZCl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJfZW15LnNwbGljZShsLDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLWZmZmYtLS0tLS0tLS1cIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuZmF2b3VyaXRfZW15KSk7XHJcbiAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS1vdGhlcnMtLS0tLS0tLS1cIiArIEpTT04uc3RyaW5naWZ5KHRoaXMub3RoZXJfZW15KSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdfcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vYWxlcnQoXCJ1c2VyIG5vdCBleHNpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkoZXJyb3IuX2JvZHkubWVzc2FnZSkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9mb3IgdGFidmlld1xyXG4gICAgb25JbmRleENoYW5nZWQoYXJncykge1xyXG5cclxuICAgICAgICAvLyAgYWxlcnQoYXJncy5vYmplY3QrYXJncy5vYmplY3QuaW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdvdG9hdHRlbmRlbmNlKCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmludGVybmV0KSB7XHJcbiAgICAgICAgICAgIGxldCBhYmxheW91dDogU3RhY2tMYXlvdXQgPSA8U3RhY2tMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwicHJlc2VudGxheW91dFwiKTtcclxuICAgICAgICAgICAgYWJsYXlvdXQudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdvdG9hYnNlbnQoKSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuaW50ZXJuZXQpIHtcclxuICAgICAgICAgICAgbGV0IGFibGF5b3V0OiBTdGFja0xheW91dCA9IDxTdGFja0xheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJhYmVzbnRsYXlvdXRcIik7XHJcbiAgICAgICAgICAgIGFibGF5b3V0LnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgb25Vc2VyTGlzdEl0ZW1UYXAoYXJncywgc3RhdHVzKSB7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmxpc3RfaW5kZXggPSBhcmdzLmluZGV4O1xyXG4gICAgICAgIHRoaXMudXNlcl9saXN0X3R5cGUgPSBzdGF0dXM7XHJcblxyXG4gICAgICAgIGxldCBhYiAgOiBBYnNvbHV0ZUxheW91dCA9IDxBYnNvbHV0ZUxheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3R3b3JrZWRzaWRlXCIpO1xyXG5cclxuICAgICAgICBpZihhYi52aXNpYmlsaXR5ID09IFwidmlzaWJsZVwiKXtcclxuXHJcbiAgICAgICAgICAgIGFiLnZpc2liaWxpdHk9XCJjb2xsYXBzZVwiO1xyXG4gICAgICAgIH1lbHNle1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBpZiAoc3RhdHVzID09IDEpIHtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5mYXZvdXJpdF9lbXlbYXJncy5pbmRleF0uc3JjID09IFwiY2hlY2tlZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZhdm91cml0X2VteVthcmdzLmluZGV4XS5zcmMgPSBcImNoZWNrZW1wdHlcIjtcclxuICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5hdHRlbmRlbmNlLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmF0dGVuZGVuY2VbaV0uaWQrXCItLS0tLS0tLS0tLS0tLS0tLVwiK3RoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYXR0ZW5kZW5jZVtpXS5pZD09dGhpcy5mYXZvdXJpdF9lbXlbYXJncy5pbmRleF0uaWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGVuZGVuY2Uuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGFibGF5b3V0OiBBYnNvbHV0ZUxheW91dCA9IDxBYnNvbHV0ZUxheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3R3b3JrZWRzaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgYWJsYXlvdXQudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFibGF5b3V0MTogR3JpZExheW91dCA9IDxHcmlkTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInByZXNlbnRsYXlvdXRcIik7XHJcbiAgICAgICAgICAgICAgICBhYmxheW91dDEub3BhY2l0eSA9IDE7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vdGhlcl9lbXlbYXJncy5pbmRleF0uc3JjID09IFwiY2hlY2tlZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteVthcmdzLmluZGV4XS5zcmMgPSBcImNoZWNrZW1wdHlcIjtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5hdHRlbmRlbmNlLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYXR0ZW5kZW5jZVtpXS5pZCtcIi0tLS0tLS0tLS0tLS0tLS0tXCIrdGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5hdHRlbmRlbmNlW2ldLmlkPT10aGlzLm90aGVyX2VteVthcmdzLmluZGV4XS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW5kZW5jZS5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYWJsYXlvdXQ6IEFic29sdXRlTGF5b3V0ID0gPEFic29sdXRlTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInNlbGVjdHdvcmtlZHNpZGVcIik7XHJcbiAgICAgICAgICAgICAgICBhYmxheW91dC52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWJsYXlvdXQxOiBHcmlkTGF5b3V0ID0gPEdyaWRMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwicHJlc2VudGxheW91dFwiKTtcclxuICAgICAgICAgICAgICAgIGFibGF5b3V0MS5vcGFjaXR5ID0gMTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBvbkFic2VudExpc3RJdGVtVGFwKGFyZ3MsIHN0YXR1cykge1xyXG5cclxuICAgICAgICBpZiAoc3RhdHVzID09IDEpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmF2b3VyaXRfZW15W2FyZ3MuaW5kZXhdLnNyYyA9PSBcImNoZWNrZWRcIil7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbYXJncy5pbmRleF0uc3JjID0gXCJjaGVja2VtcHR5XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmFic2VudHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5hYnNlbnRzW2ldLmlkPT10aGlzLmZhdm91cml0X2VteVthcmdzLmluZGV4XS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWJzZW50cy5zcGxpY2UoaSwxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnRuOiBCdXR0b24gPSA8QnV0dG9uPnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInN1Ym1pdF9hdHRlbmRlbmNlYnRuXCIpO1xyXG4gICAgICAgICAgICAgICAgYnRuLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbYXJncy5pbmRleF0uc3JjID0gXCJjaGVja2VkXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVjPW5ldyBBdHRlbmRlbmNlKHRoaXMuZmF2b3VyaXRfZW15W2FyZ3MuaW5kZXhdLmlkLHRoaXMuZmF2b3VyaXRfZW15W2FyZ3MuaW5kZXhdLm5hbWUsXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlwiLFwiQVwiLGdldFN0cmluZyhcIm5hbWVcIiksZ2V0U3RyaW5nKFwiZGF0ZVwiKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFic2VudHMucHVzaChyZWMpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMub3RoZXJfZW15W2FyZ3MuaW5kZXhdLnNyYyA9PSBcImNoZWNrZWRcIil7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXlbYXJncy5pbmRleF0uc3JjID0gXCJjaGVja2VtcHR5XCI7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuYWJzZW50cy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmFic2VudHNbaV0uaWQ9PXRoaXMub3RoZXJfZW15W2FyZ3MuaW5kZXhdLmlkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hYnNlbnRzLnNwbGljZShpLDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYnRuOiBCdXR0b24gPSA8QnV0dG9uPnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInN1Ym1pdF9hdHRlbmRlbmNlYnRuXCIpO1xyXG4gICAgICAgICAgICAgICAgYnRuLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteVthcmdzLmluZGV4XS5zcmMgPSBcImNoZWNrZWRcIjtcclxuICAgICAgICAgICAgICAgIGxldCByZWM9bmV3IEF0dGVuZGVuY2UodGhpcy5vdGhlcl9lbXlbYXJncy5pbmRleF0uaWQsdGhpcy5vdGhlcl9lbXlbYXJncy5pbmRleF0ubmFtZSxcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiXCIsXCJBXCIsZ2V0U3RyaW5nKFwibmFtZVwiKSxnZXRTdHJpbmcoXCJkYXRlXCIpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWJzZW50cy5wdXNoKHJlYyk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5hYnNlbnRzKSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZW1wdHkoKSB7XHJcbiAgICAgICAgbGV0IGFibGF5b3V0OiBBYnNvbHV0ZUxheW91dCA9IDxBYnNvbHV0ZUxheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3R3b3JrZWRzaWRlXCIpO1xyXG4gICAgICAgIGlmIChhYmxheW91dC52aXNpYmlsaXR5ID09IFwidmlzaWJsZVwiKSB7XHJcblxyXG4gICAgICAgICAgICBhYmxheW91dC52aXNpYmlsaXR5ID0gXCJjb2xsYXBzZVwiO1xyXG4gICAgICAgICAgICBsZXQgYWJsYXlvdXQxOiBHcmlkTGF5b3V0ID0gPEdyaWRMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwicHJlc2VudGxheW91dFwiKTtcclxuICAgICAgICAgICAgYWJsYXlvdXQxLm9wYWNpdHkgPSAxO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBlbXB0eTEoKSB7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RzaWRlKCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxlZFwiKTtcclxuICAgICAgICBsZXQgYWJsYXlvdXQ6IEFic29sdXRlTGF5b3V0ID0gPEFic29sdXRlTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInNlbGVjdHNpZGVkZXRhaWxcIik7XHJcbiAgICAgICAgYWJsYXlvdXQudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgb25zZWxlY3NpZGVkZXRhaWwoYXJncykge1xyXG5cclxuXHJcbiAgICAgICAgbGV0IGFibGF5b3V0OiBBYnNvbHV0ZUxheW91dCA9IDxBYnNvbHV0ZUxheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3RzaWRlZGV0YWlsXCIpO1xyXG4gICAgICAgIGFibGF5b3V0LnZpc2liaWxpdHkgPSBcImNvbGxhcHNlXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0X3NpZGUgPSB0aGlzLnNpZGVzW2FyZ3MuaW5kZXhdLmlkO1xyXG4gICAgICAgIHRoaXMuaW5mbyA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNlbGVjdG92ZXJ0aW1lKCkge1xyXG5cclxuICAgICAgICBsZXQgYWJsYXlvdXQ6IEFic29sdXRlTGF5b3V0ID0gPEFic29sdXRlTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInNlbGVjdG92ZXJ0aW1lXCIpO1xyXG4gICAgICAgIGFibGF5b3V0LnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcclxuICAgIH1cclxuXHJcbiAgICBvbk92ZXJ0aW1lRGV0YWlsKGFyZ3MpIHtcclxuXHJcblxyXG4gICAgICAgIGxldCBhYmxheW91dDogQWJzb2x1dGVMYXlvdXQgPSA8QWJzb2x1dGVMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic2VsZWN0b3ZlcnRpbWVcIik7XHJcbiAgICAgICAgYWJsYXlvdXQudmlzaWJpbGl0eSA9IFwiY29sbGFwc2VcIjtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3Rfb3ZlcnRpbWUgPSB0aGlzLm92ZXJ0aW1lW2FyZ3MuaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ2FuY2VsZGV0YWlsKCkge1xyXG5cclxuXHJcbiAgICAgICAgbGV0IGFibGF5b3V0OiBBYnNvbHV0ZUxheW91dCA9IDxBYnNvbHV0ZUxheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3R3b3JrZWRzaWRlXCIpO1xyXG4gICAgICAgIGFibGF5b3V0LnZpc2liaWxpdHkgPSBcImNvbGxhcHNlXCI7XHJcbiAgICAgICAgbGV0IGFibGF5b3V0MTogR3JpZExheW91dCA9IDxHcmlkTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInByZXNlbnRsYXlvdXRcIik7XHJcbiAgICAgICAgYWJsYXlvdXQxLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgIHRoaXMuaW5mbyA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgb25TdWJtaXRkZXRhaWwoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdF9zaWRlID09IFwiU2VsZWN0IFNpZGUgTmFtZVwiKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmluZm8gPSBcIlBsZWFzZSBhZGQgc2lkZSBkZXRhaWxcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy51c2VyX2xpc3RfdHlwZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rfb3ZlcnRpbWUgPT0gXCJBZGQgb3ZlcnRpbWVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0uc3JjID0gXCJjaGVja2VkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5zaWRlbmFtZSA9IHRoaXMuc2VsZWN0X3NpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5vdmVydGltZSA9IHRoaXMuc2VsZWN0X292ZXJ0aW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0ID0gbmV3IEF0dGVuZGVuY2UodGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5pZCwgdGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhdm91cml0X2VteVt0aGlzLmxpc3RfaW5kZXhdLnNpZGVuYW1lLCBcIjBcIiwgXCJQXCIsZ2V0U3RyaW5nKFwibmFtZVwiKSxnZXRTdHJpbmcoXCJkYXRlXCIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRlbmRlbmNlLnB1c2goYXR0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5zcmMgPSBcImNoZWNrZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhdm91cml0X2VteVt0aGlzLmxpc3RfaW5kZXhdLnNpZGVuYW1lID0gdGhpcy5zZWxlY3Rfc2lkZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhdm91cml0X2VteVt0aGlzLmxpc3RfaW5kZXhdLm92ZXJ0aW1lID0gdGhpcy5zZWxlY3Rfb3ZlcnRpbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHQgPSBuZXcgQXR0ZW5kZW5jZSh0aGlzLmZhdm91cml0X2VteVt0aGlzLmxpc3RfaW5kZXhdLmlkLCB0aGlzLmZhdm91cml0X2VteVt0aGlzLmxpc3RfaW5kZXhdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0uc2lkZW5hbWUsIHRoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0ub3ZlcnRpbWUsIFwiUFwiLGdldFN0cmluZyhcIm5hbWVcIiksZ2V0U3RyaW5nKFwiZGF0ZVwiKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW5kZW5jZS5wdXNoKGF0dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rfb3ZlcnRpbWUgPT0gXCJBZGQgb3ZlcnRpbWVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0uc3JjID0gXCJjaGVja2VkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5zaWRlbmFtZSA9IHRoaXMuc2VsZWN0X3NpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5vdmVydGltZSA9IHRoaXMuc2VsZWN0X292ZXJ0aW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0ID0gbmV3IEF0dGVuZGVuY2UodGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5pZCwgdGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteVt0aGlzLmxpc3RfaW5kZXhdLnNpZGVuYW1lLCBcIjBcIiwgXCJQXCIsZ2V0U3RyaW5nKFwibmFtZVwiKSxnZXRTdHJpbmcoXCJkYXRlXCIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRlbmRlbmNlLnB1c2goYXR0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5zcmMgPSBcImNoZWNrZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteVt0aGlzLmxpc3RfaW5kZXhdLnNpZGVuYW1lID0gdGhpcy5zZWxlY3Rfc2lkZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteVt0aGlzLmxpc3RfaW5kZXhdLm92ZXJ0aW1lID0gdGhpcy5zZWxlY3Rfb3ZlcnRpbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHQgPSBuZXcgQXR0ZW5kZW5jZSh0aGlzLm90aGVyX2VteVt0aGlzLmxpc3RfaW5kZXhdLmlkLCB0aGlzLm90aGVyX2VteVt0aGlzLmxpc3RfaW5kZXhdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0uc2lkZW5hbWUsIHRoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0ub3ZlcnRpbWUsIFwiUFwiLGdldFN0cmluZyhcIm5hbWVcIiksZ2V0U3RyaW5nKFwiZGF0ZVwiKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW5kZW5jZS5wdXNoKGF0dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGJ0bjogQnV0dG9uID0gPEJ1dHRvbj50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzdWJtaXRhdHRlbmNlX2J0blwiKTtcclxuICAgICAgICAgICAgYnRuLnZpc2liaWxpdHk9XCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgICAgIGxldCBhYmxheW91dDogQWJzb2x1dGVMYXlvdXQgPSA8QWJzb2x1dGVMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic2VsZWN0d29ya2Vkc2lkZVwiKTtcclxuICAgICAgICAgICAgYWJsYXlvdXQudmlzaWJpbGl0eSA9IFwiY29sbGFwc2VcIjtcclxuICAgICAgICAgICAgbGV0IGFibGF5b3V0MTogR3JpZExheW91dCA9IDxHcmlkTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInByZXNlbnRsYXlvdXRcIik7XHJcbiAgICAgICAgICAgIGFibGF5b3V0MS5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgdGhpcy5pbmZvID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rfc2lkZSA9IFwiU2VsZWN0IFNpZGUgTmFtZVwiO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdF9vdmVydGltZSA9IFwiQWRkIG92ZXJ0aW1lXCI7XHJcbiAgICAgICAgICAgIHRoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0ub3ZlcnRpbWUgPSBcIjBcIjtcclxuICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5vdmVydGltZSA9IFwiMFwiO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBnb0JhY2soKXtcclxuXHJcblxyXG4gICAgICAgIGxldCBhYmxheW91dDogU3RhY2tMYXlvdXQgPSA8U3RhY2tMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwiYWJlc250bGF5b3V0XCIpO1xyXG4gICAgICAgIGFibGF5b3V0LnZpc2liaWxpdHkgPSBcImNvbGxhcHNlXCI7XHJcblxyXG4gICAgICAgIGxldCBhYmxheW91dDE6IFN0YWNrTGF5b3V0ID0gPFN0YWNrTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInByZXNlbnRsYXlvdXRcIik7XHJcbiAgICAgICAgYWJsYXlvdXQxLnZpc2liaWxpdHkgPSBcImNvbGxhcHNlXCI7XHJcbiAgICAgICAgbGV0IGFibGF5b3V0MjogU3RhY2tMYXlvdXQgPSA8U3RhY2tMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic2VsZWN0d29ya2Vkc2lkZVwiKTtcclxuICAgICAgICBhYmxheW91dDIudmlzaWJpbGl0eSA9IFwiY29sbGFwc2VcIjtcclxuICAgICAgICBsZXQgYWJsYXlvdXQzOiBTdGFja0xheW91dCA9IDxTdGFja0xheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3RzaWRlZGV0YWlsXCIpO1xyXG4gICAgICAgIGFibGF5b3V0My52aXNpYmlsaXR5ID0gXCJjb2xsYXBzZVwiO1xyXG4gICAgICAgIGxldCBhYmxheW91dDQ6IFN0YWNrTGF5b3V0ID0gPFN0YWNrTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInNlbGVjdG92ZXJ0aW1lXCIpO1xyXG4gICAgICAgIGFibGF5b3V0NC52aXNpYmlsaXR5ID0gXCJjb2xsYXBzZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIFN1Ym1pdF9hYnNlbnRzKCl7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYWJzZW50cy5sZW5ndGg9PTApe1xyXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBtYXJrIGF0bGVhc3Qgb25lIGFic2VudCBiZWZvcmUgc3VibWl0LlwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5hdHRlbmRlbmNlKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VydmljZVxyXG4gICAgICAgICAgICAgICAgLnN1Ym1pdF9hdHRlbmRlbmNlX2FwaSh7ZGF0YTp0aGlzLmFic2VudHN9KVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2NlcyBhdHRlbmRlbmNlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0cmluZ19yZXNwb25zZSA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoZWxwZXIgPSBKU09OLnBhcnNlKHN0cmluZ19yZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShoZWxwZXIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaGVscGVyLnN0YXR1cz09MjAwKXtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5hYnNlbnRzLmxlbmd0aDtpKyspe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vLy9tYXRjaCByZWNvcmQgaW4gZmF2b3VyaXQgZW1wbG95ZWUgYXJyZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGo9MDtqPHRoaXMuZmF2b3VyaXRfZW15Lmxlbmd0aDtqKyspe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5hYnNlbnRzW2ldLmlkPT10aGlzLmZhdm91cml0X2VteVtqXS5pZCl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXkuc3BsaWNlKGosMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuYWJzZW50cy5sZW5ndGg7aSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9tYXRjaCByZWNvcmQgZnJvbSBvdGhlcnMgZW1wbG95ZWUgYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMub3RoZXJfZW15Lmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5hYnNlbnRzW2ldLmlkPT10aGlzLm90aGVyX2VteVtrXS5pZCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJfZW15LnNwbGljZShrLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ0bjogQnV0dG9uID0gPEJ1dHRvbj50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzdWJtaXRfYXR0ZW5kZW5jZWJ0blwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ0bi52aXNpYmlsaXR5PVwiY29sbGFwc2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiT3BlcnRhdGlvbiBzdWNjZWVkZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJwcm9ibGVtIG9jY3VycmVkIHdoaWxlIHN1Ym1pdHRpbmcgdGhlIGF0dGVuZGVuY2UuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdfcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KFwidXNlciBub3QgZXhzaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChKU09OLnN0cmluZ2lmeShlcnJvci5fYm9keS5tZXNzYWdlKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuICAgIFN1Ym1pdF9BdHRlbmRlbmNlKCl7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYXR0ZW5kZW5jZS5sZW5ndGg9PTApe1xyXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBtYXJrIGF0bGVhc3Qgb25lIGF0dGVuZGVuY2UgYmVmb3JlIHN1Ym1pdC5cIik7XHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMuYXR0ZW5kZW5jZSkpO1xyXG4gICAgICAgICAgICB0aGlzLnNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5zdWJtaXRfYXR0ZW5kZW5jZV9hcGkoe2RhdGE6dGhpcy5hdHRlbmRlbmNlfSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXMgYXR0ZW5kZW5jZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdfcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaGVscGVyID0gSlNPTi5wYXJzZShzdHJpbmdfcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShoZWxwZXIpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihoZWxwZXIuc3RhdHVzPT0yMDApe1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuYXR0ZW5kZW5jZS5sZW5ndGg7aSsrKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vLy9tYXRjaCByZWNvcmQgaW4gZmF2b3VyaXQgZW1wbG95ZWUgYXJyZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaj0wO2o8dGhpcy5mYXZvdXJpdF9lbXkubGVuZ3RoO2orKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYXR0ZW5kZW5jZVtpXS5pZD09dGhpcy5mYXZvdXJpdF9lbXlbal0uaWQpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXkuc3BsaWNlKGosMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmF0dGVuZGVuY2UubGVuZ3RoO2krKykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9tYXRjaCByZWNvcmQgZnJvbSBvdGhlcnMgZW1wbG95ZWUgYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5vdGhlcl9lbXkubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMuYXR0ZW5kZW5jZVtpXS5pZD09dGhpcy5vdGhlcl9lbXlba10uaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJfZW15LnNwbGljZShrLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnRuOiBCdXR0b24gPSA8QnV0dG9uPnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInN1Ym1pdGF0dGVuY2VfYnRuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidG4udmlzaWJpbGl0eT1cImNvbGxhcHNlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiT3BlcnRhdGlvbiBzdWNjZWVkZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwicHJvYmxlbSBvY2N1cnJlZCB3aGlsZSBzdWJtaXR0aW5nIHRoZSBhdHRlbmRlbmNlLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdfcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KFwidXNlciBub3QgZXhzaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChKU09OLnN0cmluZ2lmeShlcnJvci5fYm9keS5tZXNzYWdlKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICB2aWV3X2F0dGVuZGVuY2UoKXtcclxuXHJcbiAgICAgICAgaWYodGhpcy5pbnRlcm5ldCl7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi92aWV3LWF0dGVuZGVuY2VcIl0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICB9XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vc2NyZWVuIHRhcCBldmVudFxyXG4gICAgb25UYXAoYXJnczogR2VzdHVyZUV2ZW50RGF0YSkge1xyXG4gICAgICB0aGlzLm1haW5fZnVuY2F0aW9uKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59Il19