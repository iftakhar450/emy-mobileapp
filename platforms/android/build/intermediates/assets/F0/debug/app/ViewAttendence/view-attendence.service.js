"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
var application_settings_1 = require("tns-core-modules/application-settings");
var viewAttendenceService = (function () {
    function viewAttendenceService(http) {
        this.http = http;
        this.serverUrl = "https://emy-uae.herokuapp.com";
    }
    viewAttendenceService.prototype.get_today_all_user_attendence_api = function (data) {
        // console.log("data"+JSON.stringify(data));
        var options = this.createRequestOptions();
        return this.http.post(this.serverUrl + "/today/alluser/attendence", { data: data }, { headers: options })
            .map(function (res) { return res; });
    };
    viewAttendenceService.prototype.createRequestOptions = function () {
        var headers = new http_1.Headers();
        var token = application_settings_1.getString("token");
        //   alert(token);
        headers.set("Content-Type", "application/json");
        headers.set("token", token);
        return headers;
    };
    viewAttendenceService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], viewAttendenceService);
    return viewAttendenceService;
}());
exports.viewAttendenceService = viewAttendenceService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1hdHRlbmRlbmNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2aWV3LWF0dGVuZGVuY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUczQyxzQ0FBOEM7QUFDOUMsaUNBQStCO0FBQy9CLGdDQUE4QjtBQUM5Qiw4RUFBZ0U7QUFJaEU7SUFJSSwrQkFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFGdEIsY0FBUyxHQUFHLCtCQUErQixDQUFDO0lBRWxCLENBQUM7SUFFbkMsaUVBQWlDLEdBQWpDLFVBQWtDLElBQVM7UUFFdkMsNENBQTRDO1FBQzVDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFDLDJCQUEyQixFQUFFLEVBQUUsSUFBSSxNQUFBLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQzthQUM1RixHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLEVBQUgsQ0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVPLG9EQUFvQixHQUE1QjtRQUNJLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDNUIsSUFBSSxLQUFLLEdBQUMsZ0NBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixrQkFBa0I7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBQyxLQUFLLENBQUUsQ0FBQztRQUU1QixNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUF0QlEscUJBQXFCO1FBRGpDLGlCQUFVLEVBQUU7eUNBS2lCLFdBQUk7T0FKckIscUJBQXFCLENBeUJqQztJQUFELDRCQUFDO0NBQUEsQUF6QkQsSUF5QkM7QUF6Qlksc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgYXMgUnhPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anMvT2JzZXJ2YWJsZVwiO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycywgSHR0cFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9odHRwXCI7XHJcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9tYXBcIjtcclxuaW1wb3J0IFwicnhqcy9hZGQvb3BlcmF0b3IvZG9cIjtcclxuaW1wb3J0IHtnZXRTdHJpbmd9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcblxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3Mgdmlld0F0dGVuZGVuY2VTZXJ2aWNlIHtcclxuXHJcbiAgICBwcml2YXRlIHNlcnZlclVybCA9IFwiaHR0cHM6Ly9lbXktdWFlLmhlcm9rdWFwcC5jb21cIjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHsgfVxyXG5cclxuICAgIGdldF90b2RheV9hbGxfdXNlcl9hdHRlbmRlbmNlX2FwaShkYXRhOiBhbnkpIHtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJkYXRhXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgIGxldCBvcHRpb25zID0gdGhpcy5jcmVhdGVSZXF1ZXN0T3B0aW9ucygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLnNlcnZlclVybCtcIi90b2RheS9hbGx1c2VyL2F0dGVuZGVuY2VcIiwgeyBkYXRhIH0sIHsgaGVhZGVyczogb3B0aW9ucyB9KVxyXG4gICAgICAgICAgICAubWFwKHJlcyA9PiByZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlUmVxdWVzdE9wdGlvbnMoKSB7XHJcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGxldCB0b2tlbj1nZXRTdHJpbmcoXCJ0b2tlblwiKTtcclxuICAgICAgICAvLyAgIGFsZXJ0KHRva2VuKTtcclxuICAgICAgICBoZWFkZXJzLnNldChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICAgICAgaGVhZGVycy5zZXQoXCJ0b2tlblwiLHRva2VuICk7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXJzO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIl19