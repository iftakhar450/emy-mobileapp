"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page");
var router_1 = require("@angular/router");
var login_service_1 = require("./login.service");
var application_settings_1 = require("tns-core-modules/application-settings");
var nativescript_angular_1 = require("nativescript-angular");
var localize = require("nativescript-localize");
var LoginComponent = (function () {
    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    function LoginComponent(page, router, myloginservice, routerExtensions) {
        this.page = page;
        this.router = router;
        this.myloginservice = myloginservice;
        this.routerExtensions = routerExtensions;
        this.id = "";
        this.password = "";
        this.isBusy = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        console.log(localize('Login'));
    };
    LoginComponent.prototype.togglepassowrd = function () {
        var tfield = this.page.getViewById("password");
        tfield.secure = !tfield.secure;
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        if (this.id != "" && this.password != "") {
            var that_1 = this;
            that_1.myloginservice
                .user_login_api_call({ id: that_1.id, password: that_1.password })
                .subscribe(function (res) {
                _this.isBusy = true;
                that_1.onSuccess(res);
            }, function (error) {
                _this.isBusy = false;
                var string_response = JSON.stringify(error);
                //alert("user not exsist");
                alert(JSON.stringify(error._body.message));
            });
        }
        else {
            alert("Email or Password required");
        }
        //alert(this.id+this.password);
        //  this.router.navigate(["/supervisor"]);
    };
    LoginComponent.prototype.onSuccess = function (res) {
        var string_response = JSON.stringify(res);
        var helper = JSON.parse(string_response);
        application_settings_1.setString("token", JSON.stringify(helper._body.user.token));
        application_settings_1.setString("id", JSON.stringify(helper._body.user.id));
        application_settings_1.setString("name", helper._body.user.name);
        this.isBusy = false;
        this.routerExtensions.navigate(["/supervisor"], {
            clearHistory: true
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: "ns-items",
            moduleId: module.id,
            templateUrl: "./login.component.html",
            styleUrls: ["login.css"]
        }),
        __metadata("design:paramtypes", [page_1.Page, router_1.Router, login_service_1.LoginService, nativescript_angular_1.RouterExtensions])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBRWxELGlEQUE4QztBQUM5QywwQ0FBdUM7QUFDdkMsaURBQTZDO0FBQzdDLDhFQUFvSDtBQUNwSCw2REFBc0Q7QUFDdEQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFRbEQ7SUFLSSw0SUFBNEk7SUFDNUksaUhBQWlIO0lBQ2pILHdCQUFvQixJQUFTLEVBQVMsTUFBYSxFQUFTLGNBQTJCLEVBQVMsZ0JBQWtDO1FBQTlHLFNBQUksR0FBSixJQUFJLENBQUs7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFPO1FBQVMsbUJBQWMsR0FBZCxjQUFjLENBQWE7UUFBUyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBTHZILE9BQUUsR0FBUSxFQUFFLENBQUM7UUFDYixhQUFRLEdBQVEsRUFBRSxDQUFDO1FBQ25CLFdBQU0sR0FBUyxLQUFLLENBQUM7SUFLaEMsQ0FBQztJQUVELGlDQUFRLEdBQVI7UUFFSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDRCx1Q0FBYyxHQUFkO1FBRUksSUFBSSxNQUFNLEdBQXlCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ25DLENBQUM7SUFDRCw4QkFBSyxHQUFMO1FBQUEsaUJBNEJDO1FBM0JHLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUUsRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUUsRUFBRSxDQUFDLENBQUEsQ0FBQztZQUVqQyxJQUFJLE1BQUksR0FBQyxJQUFJLENBQUM7WUFDZCxNQUFJLENBQUMsY0FBYztpQkFDZCxtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQzdELFNBQVMsQ0FBQyxVQUFBLEdBQUc7Z0JBQ04sS0FBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUM7Z0JBRWxCLE1BQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxFQUNELFVBQUMsS0FBSztnQkFDRixLQUFJLENBQUMsTUFBTSxHQUFDLEtBQUssQ0FBQztnQkFDbEIsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFNUMsMkJBQTJCO2dCQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFHL0MsQ0FBQyxDQUFDLENBQUM7UUFFZixDQUFDO1FBQUEsSUFBSSxDQUFBLENBQUM7WUFFRixLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsK0JBQStCO1FBQ2pDLDBDQUEwQztJQUM1QyxDQUFDO0lBR0Qsa0NBQVMsR0FBVCxVQUFVLEdBQUc7UUFFVCxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekMsZ0NBQVMsQ0FBQyxPQUFPLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzNELGdDQUFTLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRCxnQ0FBUyxDQUFDLE1BQU0sRUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFDLEtBQUssQ0FBQztRQUVsQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDNUMsWUFBWSxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO0lBR1AsQ0FBQztJQWpFUSxjQUFjO1FBTjFCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHdCQUF3QjtZQUNyQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUM7U0FDM0IsQ0FBQzt5Q0FRMkIsV0FBSSxFQUFnQixlQUFNLEVBQXdCLDRCQUFZLEVBQTJCLHVDQUFnQjtPQVB6SCxjQUFjLENBa0UxQjtJQUFELHFCQUFDO0NBQUEsQUFsRUQsSUFrRUM7QUFsRVksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7VGV4dEZpZWxkfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS90ZXh0LWZpZWxkXCI7XHJcbmltcG9ydCB7UGFnZX0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvcGFnZVwiO1xyXG5pbXBvcnQge1JvdXRlcn0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQge0xvZ2luU2VydmljZX0gZnJvbSBcIi4vbG9naW4uc2VydmljZVwiO1xyXG5pbXBvcnQge3NldFN0cmluZyxnZXRTdHJpbmcsc2V0TnVtYmVyLGdldE51bWJlcixzZXRCb29sZWFuLGdldEJvb2xlYW59IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCB7Um91dGVyRXh0ZW5zaW9uc30gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyXCI7XHJcbmNvbnN0IGxvY2FsaXplID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1sb2NhbGl6ZVwiKTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwibnMtaXRlbXNcIixcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2xvZ2luLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgICBzdHlsZVVybHM6IFtcImxvZ2luLmNzc1wiXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9naW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAgICAgICBwdWJsaWMgaWQ6c3RyaW5nPVwiXCI7XHJcbiAgICAgICAgcHVibGljIHBhc3N3b3JkOnN0cmluZz1cIlwiO1xyXG4gICAgICAgIHB1YmxpYyBpc0J1c3k6Ym9vbGVhbj1mYWxzZTtcclxuICAgIC8vIFRoaXMgcGF0dGVybiBtYWtlcyB1c2Ugb2YgQW5ndWxhcuKAmXMgZGVwZW5kZW5jeSBpbmplY3Rpb24gaW1wbGVtZW50YXRpb24gdG8gaW5qZWN0IGFuIGluc3RhbmNlIG9mIHRoZSBJdGVtU2VydmljZSBzZXJ2aWNlIGludG8gdGhpcyBjbGFzcy5cclxuICAgIC8vIEFuZ3VsYXIga25vd3MgYWJvdXQgdGhpcyBzZXJ2aWNlIGJlY2F1c2UgaXQgaXMgaW5jbHVkZWQgaW4geW91ciBhcHDigJlzIG1haW4gTmdNb2R1bGUsIGRlZmluZWQgaW4gYXBwLm1vZHVsZS50cy5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFnZTpQYWdlLHByaXZhdGUgcm91dGVyOlJvdXRlcixwcml2YXRlIG15bG9naW5zZXJ2aWNlOkxvZ2luU2VydmljZSxwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGxvY2FsaXplKCdMb2dpbicpKTtcclxuICAgIH1cclxuICAgIHRvZ2dsZXBhc3Nvd3JkKCkge1xyXG5cclxuICAgICAgICBsZXQgdGZpZWxkOiBUZXh0RmllbGQgPSA8VGV4dEZpZWxkPnRoaXMucGFnZS5nZXRWaWV3QnlJZChcInBhc3N3b3JkXCIpO1xyXG4gICAgICAgIHRmaWVsZC5zZWN1cmUgPSAhdGZpZWxkLnNlY3VyZTtcclxuICAgIH1cclxuICAgIGxvZ2luKCl7XHJcbiAgICAgICAgaWYodGhpcy5pZCE9XCJcIiAmJiB0aGlzLnBhc3N3b3JkIT1cIlwiKXtcclxuXHJcbiAgICAgICAgICAgIGxldCB0aGF0PXRoaXM7XHJcbiAgICAgICAgICAgIHRoYXQubXlsb2dpbnNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC51c2VyX2xvZ2luX2FwaV9jYWxsKHsgaWQ6IHRoYXQuaWQsIHBhc3N3b3JkOiB0aGF0LnBhc3N3b3JkIH0pXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXN5PXRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoYXQub25TdWNjZXNzKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1c3k9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdfcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KFwidXNlciBub3QgZXhzaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChKU09OLnN0cmluZ2lmeShlcnJvci5fYm9keS5tZXNzYWdlKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICBhbGVydChcIkVtYWlsIG9yIFBhc3N3b3JkIHJlcXVpcmVkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hbGVydCh0aGlzLmlkK3RoaXMucGFzc3dvcmQpO1xyXG4gICAgICAvLyAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL3N1cGVydmlzb3JcIl0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblN1Y2Nlc3MocmVzKXtcclxuXHJcbiAgICAgICAgbGV0IHN0cmluZ19yZXNwb25zZSA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcbiAgICAgICAgbGV0IGhlbHBlciA9IEpTT04ucGFyc2Uoc3RyaW5nX3Jlc3BvbnNlKTtcclxuICAgICAgICBzZXRTdHJpbmcoXCJ0b2tlblwiLEpTT04uc3RyaW5naWZ5KGhlbHBlci5fYm9keS51c2VyLnRva2VuKSk7XHJcbiAgICAgICAgc2V0U3RyaW5nKFwiaWRcIixKU09OLnN0cmluZ2lmeShoZWxwZXIuX2JvZHkudXNlci5pZCkpO1xyXG4gICAgICAgIHNldFN0cmluZyhcIm5hbWVcIixoZWxwZXIuX2JvZHkudXNlci5uYW1lKTtcclxuICAgICAgICB0aGlzLmlzQnVzeT1mYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIi9zdXBlcnZpc29yXCJdLCB7XHJcbiAgICAgICAgICAgIGNsZWFySGlzdG9yeTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbn0iXX0=