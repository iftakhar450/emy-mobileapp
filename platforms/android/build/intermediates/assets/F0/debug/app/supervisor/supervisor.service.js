"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
var application_settings_1 = require("tns-core-modules/application-settings");
var SupervisorService = (function () {
    function SupervisorService(http) {
        this.http = http;
        this.serverUrl = "https://emy-uae.herokuapp.com";
    }
    SupervisorService.prototype.get_supervisor_users = function () {
        // console.log("data"+JSON.stringify(data));
        var options = this.createRequestOptions();
        return this.http.post(this.serverUrl + "/get/supervisor/user", {}, { headers: options })
            .map(function (res) { return res; });
    };
    SupervisorService.prototype.get_supervisor_sides = function (data) {
        // console.log("data"+JSON.stringify(data));
        var options = this.createRequestOptions();
        return this.http.post(this.serverUrl + "/sides", { data: data }, { headers: options })
            .map(function (res) { return res; });
    };
    SupervisorService.prototype.submit_attendence_api = function (data) {
        // console.log("data"+JSON.stringify(data));
        var options = this.createRequestOptions();
        return this.http.post(this.serverUrl + "/post/attendence", { data: data }, { headers: options })
            .map(function (res) { return res; });
    };
    SupervisorService.prototype.createRequestOptions = function () {
        var headers = new http_1.Headers();
        var token = application_settings_1.getString("token");
        //   alert(token);
        headers.set("Content-Type", "application/json");
        headers.set("token", token);
        return headers;
    };
    SupervisorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], SupervisorService);
    return SupervisorService;
}());
exports.SupervisorService = SupervisorService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJ2aXNvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3VwZXJ2aXNvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBRzNDLHNDQUE4QztBQUM5QyxpQ0FBK0I7QUFDL0IsZ0NBQThCO0FBQzlCLDhFQUFvSDtBQUdwSDtJQUtJLDJCQUFvQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUh0QixjQUFTLEdBQUcsK0JBQStCLENBQUM7SUFHbEIsQ0FBQztJQUVuQyxnREFBb0IsR0FBcEI7UUFFSSw0Q0FBNEM7UUFDNUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUMsc0JBQXNCLEVBQUUsRUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQ25GLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsRUFBSCxDQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBQ0QsZ0RBQW9CLEdBQXBCLFVBQXFCLElBQUk7UUFFckIsNENBQTRDO1FBQzVDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksTUFBQSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUM7YUFDeEUsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxFQUFILENBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFDRCxpREFBcUIsR0FBckIsVUFBc0IsSUFBSTtRQUV2Qiw0Q0FBNEM7UUFDM0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUMsa0JBQWtCLEVBQUUsRUFBQyxJQUFJLE1BQUEsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQ2xGLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsRUFBSCxDQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBQ08sZ0RBQW9CLEdBQTVCO1FBQ0ksSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixJQUFJLEtBQUssR0FBQyxnQ0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLGtCQUFrQjtRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUMsS0FBSyxDQUFFLENBQUM7UUFFNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBcENRLGlCQUFpQjtRQUQ3QixpQkFBVSxFQUFFO3lDQU1pQixXQUFJO09BTHJCLGlCQUFpQixDQXNDN0I7SUFBRCx3QkFBQztDQUFBLEFBdENELElBc0NDO0FBdENZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIGFzIFJ4T2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIjtcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb24vaHR0cFwiO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcclxuaW1wb3J0IFwicnhqcy9hZGQvb3BlcmF0b3IvbWFwXCI7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL2RvXCI7XHJcbmltcG9ydCB7c2V0U3RyaW5nLGdldFN0cmluZyxzZXROdW1iZXIsZ2V0TnVtYmVyLHNldEJvb2xlYW4sZ2V0Qm9vbGVhbn0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFN1cGVydmlzb3JTZXJ2aWNlIHtcclxuXHJcbiAgICBwcml2YXRlIHNlcnZlclVybCA9IFwiaHR0cHM6Ly9lbXktdWFlLmhlcm9rdWFwcC5jb21cIjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7IH1cclxuXHJcbiAgICBnZXRfc3VwZXJ2aXNvcl91c2VycygpIHtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJkYXRhXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgIGxldCBvcHRpb25zID0gdGhpcy5jcmVhdGVSZXF1ZXN0T3B0aW9ucygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLnNlcnZlclVybCtcIi9nZXQvc3VwZXJ2aXNvci91c2VyXCIsIHsgIH0sIHsgaGVhZGVyczogb3B0aW9ucyB9KVxyXG4gICAgICAgICAgICAubWFwKHJlcyA9PiByZXMpO1xyXG4gICAgfVxyXG4gICAgZ2V0X3N1cGVydmlzb3Jfc2lkZXMoZGF0YSkge1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRhdGFcIitKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB0aGlzLmNyZWF0ZVJlcXVlc3RPcHRpb25zKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMuc2VydmVyVXJsK1wiL3NpZGVzXCIsIHtkYXRhIH0sIHsgaGVhZGVyczogb3B0aW9ucyB9KVxyXG4gICAgICAgICAgICAubWFwKHJlcyA9PiByZXMpO1xyXG4gICAgfVxyXG4gICAgc3VibWl0X2F0dGVuZGVuY2VfYXBpKGRhdGEpIHtcclxuXHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcImRhdGFcIitKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB0aGlzLmNyZWF0ZVJlcXVlc3RPcHRpb25zKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMuc2VydmVyVXJsK1wiL3Bvc3QvYXR0ZW5kZW5jZVwiLCB7ZGF0YSB9LCB7IGhlYWRlcnM6IG9wdGlvbnMgfSlcclxuICAgICAgICAgICAgLm1hcChyZXMgPT4gcmVzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlUmVxdWVzdE9wdGlvbnMoKSB7XHJcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gICAgICAgIGxldCB0b2tlbj1nZXRTdHJpbmcoXCJ0b2tlblwiKTtcclxuICAgICAvLyAgIGFsZXJ0KHRva2VuKTtcclxuICAgICAgICBoZWFkZXJzLnNldChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICAgICAgaGVhZGVycy5zZXQoXCJ0b2tlblwiLHRva2VuICk7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXJzO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=