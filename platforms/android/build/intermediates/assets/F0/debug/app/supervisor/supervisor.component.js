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
        this.overtime = ["1", "2", "3"];
        this.select_side = "Select Side Name";
        this.select_overtime = "Add overtime";
    }
    SupervisorComponent.prototype.ngOnInit = function () {
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
            console.log(JSON.stringify(helper));
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
                /*    console.log("--------------------------");
                    console.log(JSON.stringify(helper._body.response[i].id));
                    console.log(JSON.stringify(helper._body.response[i].name));
                    console.log(JSON.stringify(helper._body.response[i].urdu_name));
                    console.log(JSON.stringify(helper._body.response[i].profession));
                    console.log("------------------------------");*/
                var user = new supervisor_1.users(helper._body.response[i].id, helper._body.response[i].name, helper._body.response[i].urdu_name, helper._body.response[i].profession, "", "", "checkempty");
                if (helper._body.response[i].status == "working") {
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
        var ablayout = this.page.getViewById("presentlayout");
        ablayout.visibility = "visible";
    };
    SupervisorComponent.prototype.gotoabsent = function () {
        var ablayout = this.page.getViewById("abesntlayout");
        ablayout.visibility = "visible";
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
        this.router.navigate(["/view-attendence"]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJ2aXNvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdXBlcnZpc29yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFnRDtBQUVoRCxpREFBOEM7QUFVOUMsOEVBTytDO0FBQy9DLDJEQUF1RDtBQUN2RCwyQ0FBbUM7QUFDbkMsaUNBQThCO0FBRTlCLDJDQUF3QztBQUV4QywwQ0FBdUM7QUFDdkMsNkRBQXNEO0FBQ3RELElBQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFPcEU7SUFxQkksNElBQTRJO0lBQzVJLGlIQUFpSDtJQUNqSCw2QkFBb0IsSUFBVSxFQUFVLE9BQTBCLEVBQVUsTUFBYSxFQUFTLGdCQUFrQztRQUFoSCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBbUI7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFPO1FBQVMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQWxCcEksZ0RBQWdEO1FBQ3pDLGlCQUFZLEdBQWEsRUFBRSxDQUFDO1FBQzVCLGNBQVMsR0FBYSxFQUFFLENBQUM7UUFDekIsZUFBVSxHQUFrQixFQUFFLENBQUM7UUFDL0IsWUFBTyxHQUFrQixFQUFFLENBQUM7UUFFNUIsVUFBSyxHQUFZLEVBQUUsQ0FBQztRQUNwQixhQUFRLEdBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLGdCQUFXLEdBQVcsa0JBQWtCLENBQUM7UUFDekMsb0JBQWUsR0FBVyxjQUFjLENBQUM7SUFVaEQsQ0FBQztJQUVELHNDQUFRLEdBQVI7UUFFSSxJQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBRTlELE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDckIsS0FBSyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsSUFBSTtnQkFD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Q0FBQyxDQUFDLENBQUM7SUFHL0MsQ0FBQztJQTlvQlEsbUJBQW1CO1FBTi9CLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLDZCQUE2QjtZQUMxQyxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztTQUNoQyxDQUFDO3lDQXdCNEIsV0FBSSxFQUFtQixzQ0FBaUIsRUFBaUIsZUFBTSxFQUEyQix1Q0FBZ0I7T0F2QjNILG1CQUFtQixDQWlwQi9CO0lBQUQsMEJBQUM7Q0FBQSxBQWpwQkQsSUFpcEJDO0FBanBCWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQge1RleHRGaWVsZH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvdGV4dC1maWVsZFwiO1xyXG5pbXBvcnQge1BhZ2V9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL3BhZ2VcIjtcclxuaW1wb3J0IHtTdGFja0xheW91dH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvbGF5b3V0cy9zdGFjay1sYXlvdXRcIjtcclxuaW1wb3J0IHtJbWFnZX0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvaW1hZ2VcIjtcclxuaW1wb3J0IHtBYnNvbHV0ZUxheW91dH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvbGF5b3V0cy9hYnNvbHV0ZS1sYXlvdXRcIjtcclxuaW1wb3J0IHtGb250V2VpZ2h0LCBLZXlib2FyZFR5cGV9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2VudW1zXCI7XHJcbmltcG9ydCBibGFjayA9IEZvbnRXZWlnaHQuYmxhY2s7XHJcbmltcG9ydCB7VGFiVmlld30gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvdGFiLXZpZXdcIjtcclxuaW1wb3J0IHtHcmlkTGF5b3V0fSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9sYXlvdXRzL2dyaWQtbGF5b3V0XCI7XHJcbmltcG9ydCB7U2VsZWN0ZWRJbmRleENoYW5nZWRFdmVudERhdGF9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XHJcbmltcG9ydCB7RHJvcERvd259IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XHJcbmltcG9ydCB7XHJcbiAgICBzZXRTdHJpbmcsXHJcbiAgICBnZXRTdHJpbmcsXHJcbiAgICBzZXROdW1iZXIsXHJcbiAgICBnZXROdW1iZXIsXHJcbiAgICBzZXRCb29sZWFuLFxyXG4gICAgZ2V0Qm9vbGVhblxyXG59IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCB7U3VwZXJ2aXNvclNlcnZpY2V9IGZyb20gXCIuL3N1cGVydmlzb3Iuc2VydmljZVwiO1xyXG5pbXBvcnQge3VzZXJzfSBmcm9tIFwiLi9zdXBlcnZpc29yXCI7XHJcbmltcG9ydCB7U2lkZXN9IGZyb20gXCIuL3NpZGVzXCI7XHJcbmltcG9ydCBudW1iZXIgPSBLZXlib2FyZFR5cGUubnVtYmVyO1xyXG5pbXBvcnQge0F0dGVuZGVuY2V9IGZyb20gXCIuL2F0dGVuZGVuY2VcIjtcclxuaW1wb3J0IHtCdXR0b259IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2J1dHRvblwiO1xyXG5pbXBvcnQge1JvdXRlcn0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQge1JvdXRlckV4dGVuc2lvbnN9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhclwiO1xyXG5jb25zdCBjb25uZWN0aXZpdHlNb2R1bGUgPSByZXF1aXJlKFwidG5zLWNvcmUtbW9kdWxlcy9jb25uZWN0aXZpdHlcIik7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwibnMtaXRlbXNcIixcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3N1cGVydmlzb3IuY29tcG9uZW50Lmh0bWxcIixcclxuICAgIHN0eWxlVXJsczogW1wic3VwZXJ2aXNvci5jc3NcIl1cclxufSlcclxuZXhwb3J0IGNsYXNzIFN1cGVydmlzb3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcblxyXG4gICAgLy9wdWJsaWMgdXNlcnM6c3RyaW5nW109W1wiQWxpXCIsXCJBbWlyXCIsXCJadWJhaXJcIl07XHJcbiAgICBwdWJsaWMgZmF2b3VyaXRfZW15OiB1c2VycyBbXSA9IFtdO1xyXG4gICAgcHVibGljIG90aGVyX2VteTogdXNlcnMgW10gPSBbXTtcclxuICAgIHB1YmxpYyBhdHRlbmRlbmNlOiBBdHRlbmRlbmNlIFtdID0gW107XHJcbiAgICBwdWJsaWMgYWJzZW50czogQXR0ZW5kZW5jZSBbXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBzaWRlczogU2lkZXNbXSA9IFtdO1xyXG4gICAgcHVibGljIG92ZXJ0aW1lOiBzdHJpbmdbXSA9IFtcIjFcIiwgXCIyXCIsIFwiM1wiXTtcclxuICAgIHB1YmxpYyBzZWxlY3Rfc2lkZTogc3RyaW5nID0gXCJTZWxlY3QgU2lkZSBOYW1lXCI7XHJcbiAgICBwdWJsaWMgc2VsZWN0X292ZXJ0aW1lOiBzdHJpbmcgPSBcIkFkZCBvdmVydGltZVwiO1xyXG4gICAgcHVibGljIGluZm86IHN0cmluZztcclxuICAgIHB1YmxpYyB0b2RheTogYW55O1xyXG5cclxuICAgIHB1YmxpYyBsaXN0X2luZGV4OiBhbnk7XHJcbiAgICBwdWJsaWMgdXNlcl9saXN0X3R5cGU6IGFueTtcclxuICAgIHB1YmxpYyBpbnRlcm5ldDogYm9vbGVhbjtcclxuICAgIC8vIFRoaXMgcGF0dGVybiBtYWtlcyB1c2Ugb2YgQW5ndWxhcuKAmXMgZGVwZW5kZW5jeSBpbmplY3Rpb24gaW1wbGVtZW50YXRpb24gdG8gaW5qZWN0IGFuIGluc3RhbmNlIG9mIHRoZSBJdGVtU2VydmljZSBzZXJ2aWNlIGludG8gdGhpcyBjbGFzcy5cclxuICAgIC8vIEFuZ3VsYXIga25vd3MgYWJvdXQgdGhpcyBzZXJ2aWNlIGJlY2F1c2UgaXQgaXMgaW5jbHVkZWQgaW4geW91ciBhcHDigJlzIG1haW4gTmdNb2R1bGUsIGRlZmluZWQgaW4gYXBwLm1vZHVsZS50cy5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSBzZXJ2aWNlOiBTdXBlcnZpc29yU2VydmljZSxwcml2YXRlICByb3V0ZXI6Um91dGVyLHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucykge1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG5cclxuICAgICAgICBjb25zdCBjb25uZWN0aW9uVHlwZSA9IGNvbm5lY3Rpdml0eU1vZHVsZS5nZXRDb25uZWN0aW9uVHlwZSgpO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGNvbm5lY3Rpb25UeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgY29ubmVjdGl2aXR5TW9kdWxlLmNvbm5lY3Rpb25UeXBlLm5vbmU6XHJcbiAgICAgICAgICAgICAgICAvLyBEZW5vdGVzIG5vIEludGVybmV0IGNvbm5lY3Rpb24uXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGNvbm5lY3Rpb25cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmludGVybmV0PWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY29ubmVjdGl2aXR5TW9kdWxlLmNvbm5lY3Rpb25UeXBlLndpZmk6XHJcbiAgICAgICAgICAgICAgICAvLyBEZW5vdGVzIGEgV2lGaSBjb25uZWN0aW9uLlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJXaUZpIGNvbm5lY3Rpb25cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmludGVybmV0PXRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjb25uZWN0aXZpdHlNb2R1bGUuY29ubmVjdGlvblR5cGUubW9iaWxlOlxyXG4gICAgICAgICAgICAgICAgLy8gRGVub3RlcyBhIG1vYmlsZSBjb25uZWN0aW9uLCBpLmUuIGNlbGx1bGFyIG5ldHdvcmsgb3IgV0FOLlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJNb2JpbGUgY29ubmVjdGlvblwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJuZXQ9dHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoZ2V0U3RyaW5nKFwidG9rZW5cIik9PXVuZGVmaW5lZCB8fCBnZXRTdHJpbmcoXCJ0b2tlblwiKT09XCJcIilcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgLy8gdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2xvZ2luXCJdKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIi9sb2dpblwiXSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySGlzdG9yeTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5pbnRlcm5ldD09dHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRfU3VwZXJ2aXNvcl91c2VyX2Zyb21fYXBpKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRfU3VwZXJ2aXNvcl9zaWRlc19mcm9tX2FwaSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldF9TdXBlcnZpc29yX3NpZGVzX2Zyb21fYXBpKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNlcnZpY2VcclxuICAgICAgICAgICAgLmdldF9zdXBlcnZpc29yX3NpZGVzKHtpZDogZ2V0U3RyaW5nKFwiaWRcIil9KVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaWRlc1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0cmluZ19yZXNwb25zZSA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhlbHBlciA9IEpTT04ucGFyc2Uoc3RyaW5nX3Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShoZWxwZXIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoZWxwZXIuX2JvZHkucHJvamVjdHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IFNpZGVzKGhlbHBlci5fYm9keS5wcm9qZWN0c1tpXS5pZCwgaGVscGVyLl9ib2R5LnByb2plY3RzW2ldLnVyZHVuYW1lKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNpZGVzLnB1c2goc2lkZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5nX3Jlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KFwidXNlciBub3QgZXhzaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGVycm9yLl9ib2R5Lm1lc3NhZ2UpKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXRfU3VwZXJ2aXNvcl91c2VyX2Zyb21fYXBpKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNlcnZpY2VcclxuICAgICAgICAgICAgLmdldF9zdXBlcnZpc29yX3VzZXJzKClcclxuICAgICAgICAgICAgLnN1YnNjcmliZShyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5nX3Jlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGVscGVyID0gSlNPTi5wYXJzZShzdHJpbmdfcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgLyogY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoaGVscGVyLl9ib2R5LnByZXZpb3VzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7Ki9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGQgPSBuZXcgRGF0ZShoZWxwZXIuX2JvZHkuZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2RheSA9IGQuZ2V0RGF0ZSgpICsgXCItXCIgKyBOdW1iZXIoZC5nZXRNb250aCgpKzEpICsgXCItXCIgKyBkLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0U3RyaW5nKFwiZGF0ZVwiLGQuZ2V0RnVsbFllYXIoKStcIi1cIitOdW1iZXIoZC5nZXRNb250aCgpKzEpK1wiLVwiK2QuZ2V0RGF0ZSgpKTtcclxuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudG9kYXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlbHBlci5fYm9keS5yZXNwb25zZS5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGhlbHBlci5fYm9keS5yZXNwb25zZVtpXS5pZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoaGVscGVyLl9ib2R5LnJlc3BvbnNlW2ldLm5hbWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGhlbHBlci5fYm9keS5yZXNwb25zZVtpXS51cmR1X25hbWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGhlbHBlci5fYm9keS5yZXNwb25zZVtpXS5wcm9mZXNzaW9uKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTsqL1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VyID0gbmV3IHVzZXJzKGhlbHBlci5fYm9keS5yZXNwb25zZVtpXS5pZCwgaGVscGVyLl9ib2R5LnJlc3BvbnNlW2ldLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWxwZXIuX2JvZHkucmVzcG9uc2VbaV0udXJkdV9uYW1lLCBoZWxwZXIuX2JvZHkucmVzcG9uc2VbaV0ucHJvZmVzc2lvbiwgXCJcIiwgXCJcIiwgXCJjaGVja2VtcHR5XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaGVscGVyLl9ib2R5LnJlc3BvbnNlW2ldLnN0YXR1cz09XCJ3b3JraW5nXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhlbHBlci5fYm9keS5yZXNwb25zZVtpXS5zdXBlcnZpc29yX2lkID09IGdldFN0cmluZyhcImlkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXkucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteS5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8vLy9jaGVja2luZyBpZiBhbHJlYWR5IGF0dGVuZGVuY2UgYWRkZWRcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPGhlbHBlci5fYm9keS5wcmV2aW91cy5sZW5ndGg7aSsrKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBrPTA7azx0aGlzLmZhdm91cml0X2VteS5sZW5ndGg7aysrKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZmF2b3VyaXRfZW15W2tdLmlkPT1oZWxwZXIuX2JvZHkucHJldmlvdXNbaV0uaWQpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhdm91cml0X2VteS5zcGxpY2UoaywxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBsPTA7bDx0aGlzLm90aGVyX2VteS5sZW5ndGg7bCsrKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm90aGVyX2VteVtsXS5pZD09aGVscGVyLl9ib2R5LnByZXZpb3VzW2ldLmlkKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXkuc3BsaWNlKGwsMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tZmZmZi0tLS0tLS0tLVwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5mYXZvdXJpdF9lbXkpKTtcclxuICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLW90aGVycy0tLS0tLS0tLVwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5vdGhlcl9lbXkpKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0cmluZ19yZXNwb25zZSA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9hbGVydChcInVzZXIgbm90IGV4c2lzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChKU09OLnN0cmluZ2lmeShlcnJvci5fYm9keS5tZXNzYWdlKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL2ZvciB0YWJ2aWV3XHJcbiAgICBvbkluZGV4Q2hhbmdlZChhcmdzKSB7XHJcblxyXG4gICAgICAgIC8vICBhbGVydChhcmdzLm9iamVjdCthcmdzLm9iamVjdC5pbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ290b2F0dGVuZGVuY2UoKSB7XHJcblxyXG5cclxuICAgICAgICBsZXQgYWJsYXlvdXQ6IFN0YWNrTGF5b3V0ID0gPFN0YWNrTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInByZXNlbnRsYXlvdXRcIik7XHJcbiAgICAgICAgYWJsYXlvdXQudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdvdG9hYnNlbnQoKSB7XHJcblxyXG5cclxuICAgICAgICBsZXQgYWJsYXlvdXQ6IFN0YWNrTGF5b3V0ID0gPFN0YWNrTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcImFiZXNudGxheW91dFwiKTtcclxuICAgICAgICBhYmxheW91dC52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIG9uVXNlckxpc3RJdGVtVGFwKGFyZ3MsIHN0YXR1cykge1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5saXN0X2luZGV4ID0gYXJncy5pbmRleDtcclxuICAgICAgICB0aGlzLnVzZXJfbGlzdF90eXBlID0gc3RhdHVzO1xyXG5cclxuICAgICAgICBsZXQgYWIgIDogQWJzb2x1dGVMYXlvdXQgPSA8QWJzb2x1dGVMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic2VsZWN0d29ya2Vkc2lkZVwiKTtcclxuXHJcbiAgICAgICAgaWYoYWIudmlzaWJpbGl0eSA9PSBcInZpc2libGVcIil7XHJcblxyXG4gICAgICAgICAgICBhYi52aXNpYmlsaXR5PVwiY29sbGFwc2VcIjtcclxuICAgICAgICB9ZWxzZXtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PSAxKSB7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZmF2b3VyaXRfZW15W2FyZ3MuaW5kZXhdLnNyYyA9PSBcImNoZWNrZWRcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbYXJncy5pbmRleF0uc3JjID0gXCJjaGVja2VtcHR5XCI7XHJcbiAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuYXR0ZW5kZW5jZS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5hdHRlbmRlbmNlW2ldLmlkK1wiLS0tLS0tLS0tLS0tLS0tLS1cIit0aGlzLmZhdm91cml0X2VteVt0aGlzLmxpc3RfaW5kZXhdLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmF0dGVuZGVuY2VbaV0uaWQ9PXRoaXMuZmF2b3VyaXRfZW15W2FyZ3MuaW5kZXhdLmlkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRlbmRlbmNlLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBhYmxheW91dDogQWJzb2x1dGVMYXlvdXQgPSA8QWJzb2x1dGVMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic2VsZWN0d29ya2Vkc2lkZVwiKTtcclxuICAgICAgICAgICAgICAgIGFibGF5b3V0LnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcclxuICAgICAgICAgICAgICAgIGxldCBhYmxheW91dDE6IEdyaWRMYXlvdXQgPSA8R3JpZExheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJwcmVzZW50bGF5b3V0XCIpO1xyXG4gICAgICAgICAgICAgICAgYWJsYXlvdXQxLm9wYWNpdHkgPSAxO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3RoZXJfZW15W2FyZ3MuaW5kZXhdLnNyYyA9PSBcImNoZWNrZWRcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXlbYXJncy5pbmRleF0uc3JjID0gXCJjaGVja2VtcHR5XCI7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuYXR0ZW5kZW5jZS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmF0dGVuZGVuY2VbaV0uaWQrXCItLS0tLS0tLS0tLS0tLS0tLVwiK3RoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYXR0ZW5kZW5jZVtpXS5pZD09dGhpcy5vdGhlcl9lbXlbYXJncy5pbmRleF0uaWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGVuZGVuY2Uuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGFibGF5b3V0OiBBYnNvbHV0ZUxheW91dCA9IDxBYnNvbHV0ZUxheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3R3b3JrZWRzaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgYWJsYXlvdXQudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFibGF5b3V0MTogR3JpZExheW91dCA9IDxHcmlkTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInByZXNlbnRsYXlvdXRcIik7XHJcbiAgICAgICAgICAgICAgICBhYmxheW91dDEub3BhY2l0eSA9IDE7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgb25BYnNlbnRMaXN0SXRlbVRhcChhcmdzLCBzdGF0dXMpIHtcclxuXHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PSAxKSB7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmZhdm91cml0X2VteVthcmdzLmluZGV4XS5zcmMgPT0gXCJjaGVja2VkXCIpe1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15W2FyZ3MuaW5kZXhdLnNyYyA9IFwiY2hlY2tlbXB0eVwiO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5hYnNlbnRzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYWJzZW50c1tpXS5pZD09dGhpcy5mYXZvdXJpdF9lbXlbYXJncy5pbmRleF0uaWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFic2VudHMuc3BsaWNlKGksMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgbGV0IGJ0bjogQnV0dG9uID0gPEJ1dHRvbj50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzdWJtaXRfYXR0ZW5kZW5jZWJ0blwiKTtcclxuICAgICAgICAgICAgICAgIGJ0bi52aXNpYmlsaXR5PVwidmlzaWJsZVwiO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15W2FyZ3MuaW5kZXhdLnNyYyA9IFwiY2hlY2tlZFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlYz1uZXcgQXR0ZW5kZW5jZSh0aGlzLmZhdm91cml0X2VteVthcmdzLmluZGV4XS5pZCx0aGlzLmZhdm91cml0X2VteVthcmdzLmluZGV4XS5uYW1lLFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJcIixcIkFcIixnZXRTdHJpbmcoXCJuYW1lXCIpLGdldFN0cmluZyhcImRhdGVcIikpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hYnNlbnRzLnB1c2gocmVjKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuXHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLm90aGVyX2VteVthcmdzLmluZGV4XS5zcmMgPT0gXCJjaGVja2VkXCIpe1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub3RoZXJfZW15W2FyZ3MuaW5kZXhdLnNyYyA9IFwiY2hlY2tlbXB0eVwiO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmFic2VudHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5hYnNlbnRzW2ldLmlkPT10aGlzLm90aGVyX2VteVthcmdzLmluZGV4XS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWJzZW50cy5zcGxpY2UoaSwxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJ0bjogQnV0dG9uID0gPEJ1dHRvbj50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzdWJtaXRfYXR0ZW5kZW5jZWJ0blwiKTtcclxuICAgICAgICAgICAgICAgIGJ0bi52aXNpYmlsaXR5PVwidmlzaWJsZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXlbYXJncy5pbmRleF0uc3JjID0gXCJjaGVja2VkXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVjPW5ldyBBdHRlbmRlbmNlKHRoaXMub3RoZXJfZW15W2FyZ3MuaW5kZXhdLmlkLHRoaXMub3RoZXJfZW15W2FyZ3MuaW5kZXhdLm5hbWUsXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlwiLFwiQVwiLGdldFN0cmluZyhcIm5hbWVcIiksZ2V0U3RyaW5nKFwiZGF0ZVwiKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFic2VudHMucHVzaChyZWMpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMuYWJzZW50cykpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGVtcHR5KCkge1xyXG4gICAgICAgIGxldCBhYmxheW91dDogQWJzb2x1dGVMYXlvdXQgPSA8QWJzb2x1dGVMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic2VsZWN0d29ya2Vkc2lkZVwiKTtcclxuICAgICAgICBpZiAoYWJsYXlvdXQudmlzaWJpbGl0eSA9PSBcInZpc2libGVcIikge1xyXG5cclxuICAgICAgICAgICAgYWJsYXlvdXQudmlzaWJpbGl0eSA9IFwiY29sbGFwc2VcIjtcclxuICAgICAgICAgICAgbGV0IGFibGF5b3V0MTogR3JpZExheW91dCA9IDxHcmlkTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInByZXNlbnRsYXlvdXRcIik7XHJcbiAgICAgICAgICAgIGFibGF5b3V0MS5vcGFjaXR5ID0gMTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZW1wdHkxKCkge1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0c2lkZSgpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjYWxsZWRcIik7XHJcbiAgICAgICAgbGV0IGFibGF5b3V0OiBBYnNvbHV0ZUxheW91dCA9IDxBYnNvbHV0ZUxheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3RzaWRlZGV0YWlsXCIpO1xyXG4gICAgICAgIGFibGF5b3V0LnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uc2VsZWNzaWRlZGV0YWlsKGFyZ3MpIHtcclxuXHJcblxyXG4gICAgICAgIGxldCBhYmxheW91dDogQWJzb2x1dGVMYXlvdXQgPSA8QWJzb2x1dGVMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic2VsZWN0c2lkZWRldGFpbFwiKTtcclxuICAgICAgICBhYmxheW91dC52aXNpYmlsaXR5ID0gXCJjb2xsYXBzZVwiO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdF9zaWRlID0gdGhpcy5zaWRlc1thcmdzLmluZGV4XS5pZDtcclxuICAgICAgICB0aGlzLmluZm8gPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZWxlY3RvdmVydGltZSgpIHtcclxuXHJcbiAgICAgICAgbGV0IGFibGF5b3V0OiBBYnNvbHV0ZUxheW91dCA9IDxBYnNvbHV0ZUxheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3RvdmVydGltZVwiKTtcclxuICAgICAgICBhYmxheW91dC52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgb25PdmVydGltZURldGFpbChhcmdzKSB7XHJcblxyXG5cclxuICAgICAgICBsZXQgYWJsYXlvdXQ6IEFic29sdXRlTGF5b3V0ID0gPEFic29sdXRlTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInNlbGVjdG92ZXJ0aW1lXCIpO1xyXG4gICAgICAgIGFibGF5b3V0LnZpc2liaWxpdHkgPSBcImNvbGxhcHNlXCI7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0X292ZXJ0aW1lID0gdGhpcy5vdmVydGltZVthcmdzLmluZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNhbmNlbGRldGFpbCgpIHtcclxuXHJcblxyXG4gICAgICAgIGxldCBhYmxheW91dDogQWJzb2x1dGVMYXlvdXQgPSA8QWJzb2x1dGVMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic2VsZWN0d29ya2Vkc2lkZVwiKTtcclxuICAgICAgICBhYmxheW91dC52aXNpYmlsaXR5ID0gXCJjb2xsYXBzZVwiO1xyXG4gICAgICAgIGxldCBhYmxheW91dDE6IEdyaWRMYXlvdXQgPSA8R3JpZExheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJwcmVzZW50bGF5b3V0XCIpO1xyXG4gICAgICAgIGFibGF5b3V0MS5vcGFjaXR5ID0gMTtcclxuICAgICAgICB0aGlzLmluZm8gPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU3VibWl0ZGV0YWlsKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rfc2lkZSA9PSBcIlNlbGVjdCBTaWRlIE5hbWVcIikge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pbmZvID0gXCJQbGVhc2UgYWRkIHNpZGUgZGV0YWlsXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcl9saXN0X3R5cGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0X292ZXJ0aW1lID09IFwiQWRkIG92ZXJ0aW1lXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhdm91cml0X2VteVt0aGlzLmxpc3RfaW5kZXhdLnNyYyA9IFwiY2hlY2tlZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0uc2lkZW5hbWUgPSB0aGlzLnNlbGVjdF9zaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0ub3ZlcnRpbWUgPSB0aGlzLnNlbGVjdF9vdmVydGltZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dCA9IG5ldyBBdHRlbmRlbmNlKHRoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0uaWQsIHRoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5zaWRlbmFtZSwgXCIwXCIsIFwiUFwiLGdldFN0cmluZyhcIm5hbWVcIiksZ2V0U3RyaW5nKFwiZGF0ZVwiKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW5kZW5jZS5wdXNoKGF0dCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0uc3JjID0gXCJjaGVja2VkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5zaWRlbmFtZSA9IHRoaXMuc2VsZWN0X3NpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5vdmVydGltZSA9IHRoaXMuc2VsZWN0X292ZXJ0aW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0ID0gbmV3IEF0dGVuZGVuY2UodGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5pZCwgdGhpcy5mYXZvdXJpdF9lbXlbdGhpcy5saXN0X2luZGV4XS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhdm91cml0X2VteVt0aGlzLmxpc3RfaW5kZXhdLnNpZGVuYW1lLCB0aGlzLmZhdm91cml0X2VteVt0aGlzLmxpc3RfaW5kZXhdLm92ZXJ0aW1lLCBcIlBcIixnZXRTdHJpbmcoXCJuYW1lXCIpLGdldFN0cmluZyhcImRhdGVcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGVuZGVuY2UucHVzaChhdHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0X292ZXJ0aW1lID09IFwiQWRkIG92ZXJ0aW1lXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteVt0aGlzLmxpc3RfaW5kZXhdLnNyYyA9IFwiY2hlY2tlZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0uc2lkZW5hbWUgPSB0aGlzLnNlbGVjdF9zaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0ub3ZlcnRpbWUgPSB0aGlzLnNlbGVjdF9vdmVydGltZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dCA9IG5ldyBBdHRlbmRlbmNlKHRoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0uaWQsIHRoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5zaWRlbmFtZSwgXCIwXCIsIFwiUFwiLGdldFN0cmluZyhcIm5hbWVcIiksZ2V0U3RyaW5nKFwiZGF0ZVwiKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW5kZW5jZS5wdXNoKGF0dCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJfZW15W3RoaXMubGlzdF9pbmRleF0uc3JjID0gXCJjaGVja2VkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5zaWRlbmFtZSA9IHRoaXMuc2VsZWN0X3NpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5vdmVydGltZSA9IHRoaXMuc2VsZWN0X292ZXJ0aW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0ID0gbmV3IEF0dGVuZGVuY2UodGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5pZCwgdGhpcy5vdGhlcl9lbXlbdGhpcy5saXN0X2luZGV4XS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteVt0aGlzLmxpc3RfaW5kZXhdLnNpZGVuYW1lLCB0aGlzLm90aGVyX2VteVt0aGlzLmxpc3RfaW5kZXhdLm92ZXJ0aW1lLCBcIlBcIixnZXRTdHJpbmcoXCJuYW1lXCIpLGdldFN0cmluZyhcImRhdGVcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGVuZGVuY2UucHVzaChhdHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBidG46IEJ1dHRvbiA9IDxCdXR0b24+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic3VibWl0YXR0ZW5jZV9idG5cIik7XHJcbiAgICAgICAgICAgIGJ0bi52aXNpYmlsaXR5PVwidmlzaWJsZVwiO1xyXG4gICAgICAgICAgICBsZXQgYWJsYXlvdXQ6IEFic29sdXRlTGF5b3V0ID0gPEFic29sdXRlTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInNlbGVjdHdvcmtlZHNpZGVcIik7XHJcbiAgICAgICAgICAgIGFibGF5b3V0LnZpc2liaWxpdHkgPSBcImNvbGxhcHNlXCI7XHJcbiAgICAgICAgICAgIGxldCBhYmxheW91dDE6IEdyaWRMYXlvdXQgPSA8R3JpZExheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJwcmVzZW50bGF5b3V0XCIpO1xyXG4gICAgICAgICAgICBhYmxheW91dDEub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mbyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0X3NpZGUgPSBcIlNlbGVjdCBTaWRlIE5hbWVcIjtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rfb3ZlcnRpbWUgPSBcIkFkZCBvdmVydGltZVwiO1xyXG4gICAgICAgICAgICB0aGlzLm90aGVyX2VteVt0aGlzLmxpc3RfaW5kZXhdLm92ZXJ0aW1lID0gXCIwXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15W3RoaXMubGlzdF9pbmRleF0ub3ZlcnRpbWUgPSBcIjBcIjtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ29CYWNrKCl7XHJcblxyXG5cclxuICAgICAgICBsZXQgYWJsYXlvdXQ6IFN0YWNrTGF5b3V0ID0gPFN0YWNrTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcImFiZXNudGxheW91dFwiKTtcclxuICAgICAgICBhYmxheW91dC52aXNpYmlsaXR5ID0gXCJjb2xsYXBzZVwiO1xyXG5cclxuICAgICAgICBsZXQgYWJsYXlvdXQxOiBTdGFja0xheW91dCA9IDxTdGFja0xheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJwcmVzZW50bGF5b3V0XCIpO1xyXG4gICAgICAgIGFibGF5b3V0MS52aXNpYmlsaXR5ID0gXCJjb2xsYXBzZVwiO1xyXG4gICAgICAgIGxldCBhYmxheW91dDI6IFN0YWNrTGF5b3V0ID0gPFN0YWNrTGF5b3V0PnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInNlbGVjdHdvcmtlZHNpZGVcIik7XHJcbiAgICAgICAgYWJsYXlvdXQyLnZpc2liaWxpdHkgPSBcImNvbGxhcHNlXCI7XHJcbiAgICAgICAgbGV0IGFibGF5b3V0MzogU3RhY2tMYXlvdXQgPSA8U3RhY2tMYXlvdXQ+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic2VsZWN0c2lkZWRldGFpbFwiKTtcclxuICAgICAgICBhYmxheW91dDMudmlzaWJpbGl0eSA9IFwiY29sbGFwc2VcIjtcclxuICAgICAgICBsZXQgYWJsYXlvdXQ0OiBTdGFja0xheW91dCA9IDxTdGFja0xheW91dD50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzZWxlY3RvdmVydGltZVwiKTtcclxuICAgICAgICBhYmxheW91dDQudmlzaWJpbGl0eSA9IFwiY29sbGFwc2VcIjtcclxuICAgIH1cclxuXHJcbiAgICBTdWJtaXRfYWJzZW50cygpe1xyXG5cclxuICAgICAgICBpZih0aGlzLmFic2VudHMubGVuZ3RoPT0wKXtcclxuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgbWFyayBhdGxlYXN0IG9uZSBhYnNlbnQgYmVmb3JlIHN1Ym1pdC5cIik7XHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMuYXR0ZW5kZW5jZSkpO1xyXG4gICAgICAgICAgICB0aGlzLnNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5zdWJtaXRfYXR0ZW5kZW5jZV9hcGkoe2RhdGE6dGhpcy5hYnNlbnRzfSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXMgYXR0ZW5kZW5jZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdfcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaGVscGVyID0gSlNPTi5wYXJzZShzdHJpbmdfcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoaGVscGVyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGhlbHBlci5zdGF0dXM9PTIwMCl7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuYWJzZW50cy5sZW5ndGg7aSsrKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vLy8vbWF0Y2ggcmVjb3JkIGluIGZhdm91cml0IGVtcGxveWVlIGFycmV5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqPTA7ajx0aGlzLmZhdm91cml0X2VteS5sZW5ndGg7aisrKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYWJzZW50c1tpXS5pZD09dGhpcy5mYXZvdXJpdF9lbXlbal0uaWQpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15LnNwbGljZShqLDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmFic2VudHMubGVuZ3RoO2krKykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vbWF0Y2ggcmVjb3JkIGZyb20gb3RoZXJzIGVtcGxveWVlIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLm90aGVyX2VteS5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMuYWJzZW50c1tpXS5pZD09dGhpcy5vdGhlcl9lbXlba10uaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteS5zcGxpY2UoaywgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBidG46IEJ1dHRvbiA9IDxCdXR0b24+dGhpcy5wYWdlLmdldFZpZXdCeUlkKFwic3VibWl0X2F0dGVuZGVuY2VidG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidG4udmlzaWJpbGl0eT1cImNvbGxhcHNlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIk9wZXJ0YXRpb24gc3VjY2VlZGVkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwicHJvYmxlbSBvY2N1cnJlZCB3aGlsZSBzdWJtaXR0aW5nIHRoZSBhdHRlbmRlbmNlLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5nX3Jlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hbGVydChcInVzZXIgbm90IGV4c2lzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkoZXJyb3IuX2JvZHkubWVzc2FnZSkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBTdWJtaXRfQXR0ZW5kZW5jZSgpe1xyXG5cclxuICAgICAgICBpZih0aGlzLmF0dGVuZGVuY2UubGVuZ3RoPT0wKXtcclxuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgbWFyayBhdGxlYXN0IG9uZSBhdHRlbmRlbmNlIGJlZm9yZSBzdWJtaXQuXCIpO1xyXG4gICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLmF0dGVuZGVuY2UpKTtcclxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuc3VibWl0X2F0dGVuZGVuY2VfYXBpKHtkYXRhOnRoaXMuYXR0ZW5kZW5jZX0pXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzIGF0dGVuZGVuY2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5nX3Jlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhlbHBlciA9IEpTT04ucGFyc2Uoc3RyaW5nX3Jlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoaGVscGVyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaGVscGVyLnN0YXR1cz09MjAwKXtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmF0dGVuZGVuY2UubGVuZ3RoO2krKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vLy8vbWF0Y2ggcmVjb3JkIGluIGZhdm91cml0IGVtcGxveWVlIGFycmV5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGo9MDtqPHRoaXMuZmF2b3VyaXRfZW15Lmxlbmd0aDtqKyspe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmF0dGVuZGVuY2VbaV0uaWQ9PXRoaXMuZmF2b3VyaXRfZW15W2pdLmlkKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmF2b3VyaXRfZW15LnNwbGljZShqLDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5hdHRlbmRlbmNlLmxlbmd0aDtpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vbWF0Y2ggcmVjb3JkIGZyb20gb3RoZXJzIGVtcGxveWVlIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMub3RoZXJfZW15Lmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLmF0dGVuZGVuY2VbaV0uaWQ9PXRoaXMub3RoZXJfZW15W2tdLmlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyX2VteS5zcGxpY2UoaywgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ0bjogQnV0dG9uID0gPEJ1dHRvbj50aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJzdWJtaXRhdHRlbmNlX2J0blwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnRuLnZpc2liaWxpdHk9XCJjb2xsYXBzZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIk9wZXJ0YXRpb24gc3VjY2VlZGVkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcInByb2JsZW0gb2NjdXJyZWQgd2hpbGUgc3VibWl0dGluZyB0aGUgYXR0ZW5kZW5jZS5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5nX3Jlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hbGVydChcInVzZXIgbm90IGV4c2lzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkoZXJyb3IuX2JvZHkubWVzc2FnZSkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdmlld19hdHRlbmRlbmNlKCl7XHJcblxyXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi92aWV3LWF0dGVuZGVuY2VcIl0pO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxufSJdfQ==