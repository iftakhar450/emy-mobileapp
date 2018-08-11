"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
var LoginService = (function () {
    function LoginService(http) {
        this.http = http;
        this.serverUrl = "https://emy-uae.herokuapp.com";
    }
    LoginService.prototype.user_login_api_call = function (data) {
        // console.log("data"+JSON.stringify(data));
        var options = this.createRequestOptions();
        return this.http.post(this.serverUrl + "/superuser/login", { data: data }, { headers: options })
            .map(function (res) { return res; });
    };
    LoginService.prototype.createRequestOptions = function () {
        var headers = new http_1.Headers();
        headers.set("Content-Type", "application/json");
        return headers;
    };
    LoginService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFHM0Msc0NBQThDO0FBQzlDLGlDQUErQjtBQUMvQixnQ0FBOEI7QUFJOUI7SUFJSSxzQkFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFGdEIsY0FBUyxHQUFHLCtCQUErQixDQUFDO0lBRWxCLENBQUM7SUFFbkMsMENBQW1CLEdBQW5CLFVBQW9CLElBQVM7UUFFekIsNENBQTRDO1FBQzVDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxNQUFBLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQzthQUNuRixHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLEVBQUgsQ0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVPLDJDQUFvQixHQUE1QjtRQUNJLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFFNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUVoRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFwQlEsWUFBWTtRQUR4QixpQkFBVSxFQUFFO3lDQUtpQixXQUFJO09BSnJCLFlBQVksQ0FzQnhCO0lBQUQsbUJBQUM7Q0FBQSxBQXRCRCxJQXNCQztBQXRCWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIGFzIFJ4T2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzL09ic2VydmFibGVcIjtcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb24vaHR0cFwiO1xyXG5pbXBvcnQgeyBIdHRwLCBIZWFkZXJzIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcclxuaW1wb3J0IFwicnhqcy9hZGQvb3BlcmF0b3IvbWFwXCI7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL2RvXCI7XHJcblxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTG9naW5TZXJ2aWNlIHtcclxuXHJcbiAgICBwcml2YXRlIHNlcnZlclVybCA9IFwiaHR0cHM6Ly9lbXktdWFlLmhlcm9rdWFwcC5jb21cIjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHsgfVxyXG5cclxuICAgIHVzZXJfbG9naW5fYXBpX2NhbGwoZGF0YTogYW55KSB7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0YVwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuY3JlYXRlUmVxdWVzdE9wdGlvbnMoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5zZXJ2ZXJVcmwrXCIvc3VwZXJ1c2VyL2xvZ2luXCIsIHsgZGF0YSB9LCB7IGhlYWRlcnM6IG9wdGlvbnMgfSlcclxuICAgICAgICAgICAgLm1hcChyZXMgPT4gcmVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVJlcXVlc3RPcHRpb25zKCkge1xyXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuXHJcbiAgICAgICAgaGVhZGVycy5zZXQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVycztcclxuICAgIH1cclxuXHJcbn1cclxuIl19