"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_client_1 = require("nativescript-angular/http-client");
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var app_routing_1 = require("./app.routing");
var app_component_1 = require("./app.component");
var forms_1 = require("nativescript-angular/forms");
var item_service_1 = require("./item/item.service");
var items_component_1 = require("./item/items.component");
var item_detail_component_1 = require("./item/item-detail.component");
var login_component_1 = require("./Login/login.component");
var supervisor_component_1 = require("./supervisor/supervisor.component");
var angular_1 = require("nativescript-localize/angular");
var login_service_1 = require("./Login/login.service");
var http_1 = require("nativescript-angular/http");
var supervisor_service_1 = require("./supervisor/supervisor.service");
var view_attendence_component_1 = require("./ViewAttendence/view-attendence.component");
var view_attendence_service_1 = require("./ViewAttendence/view-attendence.service");
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";
// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from "nativescript-angular/http";
var AppModule = (function () {
    /*
    Pass your application module to the bootstrapModule function located in main.ts to start your app
    */
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [
                app_component_1.AppComponent
            ],
            imports: [
                nativescript_module_1.NativeScriptModule,
                app_routing_1.AppRoutingModule,
                forms_1.NativeScriptFormsModule,
                angular_1.NativeScriptLocalizeModule,
                http_client_1.NativeScriptHttpClientModule,
                http_1.NativeScriptHttpModule,
            ],
            declarations: [
                app_component_1.AppComponent,
                items_component_1.ItemsComponent,
                item_detail_component_1.ItemDetailComponent,
                login_component_1.LoginComponent,
                supervisor_component_1.SupervisorComponent,
                view_attendence_component_1.ViewAttendenceComponent
            ],
            providers: [
                http_client_1.NativeScriptHttpClientModule,
                item_service_1.ItemService,
                login_service_1.LoginService,
                supervisor_service_1.SupervisorService,
                view_attendence_service_1.viewAttendenceService
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
        /*
        Pass your application module to the bootstrapModule function located in main.ts to start your app
        */
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnRUFBOEU7QUFDOUUsc0NBQTJEO0FBQzNELGdGQUE4RTtBQUM5RSw2Q0FBaUQ7QUFDakQsaURBQStDO0FBQy9DLG9EQUFrRTtBQUNsRSxvREFBa0Q7QUFDbEQsMERBQXdEO0FBQ3hELHNFQUFtRTtBQUNuRSwyREFBdUQ7QUFDdkQsMEVBQXNFO0FBQ3RFLHlEQUEyRTtBQUMzRSx1REFBbUQ7QUFDbkQsa0RBQW1FO0FBQ25FLHNFQUFrRTtBQUNsRSx3RkFBbUY7QUFDbkYsb0ZBQStFO0FBQy9FLDJFQUEyRTtBQUMzRSx3RUFBd0U7QUFFeEUsNkVBQTZFO0FBQzdFLHNFQUFzRTtBQW1DdEU7SUFIQTs7TUFFRTtJQUNGO0lBQXlCLENBQUM7SUFBYixTQUFTO1FBbENyQixlQUFRLENBQUM7WUFDTixTQUFTLEVBQUU7Z0JBQ1AsNEJBQVk7YUFDZjtZQUNELE9BQU8sRUFBRTtnQkFDTCx3Q0FBa0I7Z0JBQ2xCLDhCQUFnQjtnQkFDaEIsK0JBQXVCO2dCQUN2QixvQ0FBMEI7Z0JBQzFCLDBDQUE0QjtnQkFDNUIsNkJBQXNCO2FBQ3pCO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLDRCQUFZO2dCQUNaLGdDQUFjO2dCQUNkLDJDQUFtQjtnQkFDbkIsZ0NBQWM7Z0JBQ2QsMENBQW1CO2dCQUNuQixtREFBdUI7YUFDMUI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsMENBQTRCO2dCQUM1QiwwQkFBVztnQkFDWCw0QkFBWTtnQkFDWixzQ0FBaUI7Z0JBQ2pCLCtDQUFxQjthQUN4QjtZQUNELE9BQU8sRUFBRTtnQkFDTCx1QkFBZ0I7YUFDbkI7U0FDSixDQUFDO1FBQ0Y7O1VBRUU7T0FDVyxTQUFTLENBQUk7SUFBRCxnQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05hdGl2ZVNjcmlwdEh0dHBDbGllbnRNb2R1bGV9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9odHRwLWNsaWVudFwiO1xuaW1wb3J0IHsgTmdNb2R1bGUsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IEFwcFJvdXRpbmdNb2R1bGUgfSBmcm9tIFwiLi9hcHAucm91dGluZ1wiO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xuaW1wb3J0IHtOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZX0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCJcbmltcG9ydCB7IEl0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4vaXRlbS9pdGVtLnNlcnZpY2VcIjtcbmltcG9ydCB7IEl0ZW1zQ29tcG9uZW50IH0gZnJvbSBcIi4vaXRlbS9pdGVtcy5jb21wb25lbnRcIjtcbmltcG9ydCB7IEl0ZW1EZXRhaWxDb21wb25lbnQgfSBmcm9tIFwiLi9pdGVtL2l0ZW0tZGV0YWlsLmNvbXBvbmVudFwiO1xuaW1wb3J0IHtMb2dpbkNvbXBvbmVudH0gZnJvbSBcIi4vTG9naW4vbG9naW4uY29tcG9uZW50XCI7XG5pbXBvcnQge1N1cGVydmlzb3JDb21wb25lbnR9IGZyb20gXCIuL3N1cGVydmlzb3Ivc3VwZXJ2aXNvci5jb21wb25lbnRcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdExvY2FsaXplTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1sb2NhbGl6ZS9hbmd1bGFyXCI7XG5pbXBvcnQge0xvZ2luU2VydmljZX0gZnJvbSBcIi4vTG9naW4vbG9naW4uc2VydmljZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9odHRwXCI7XG5pbXBvcnQge1N1cGVydmlzb3JTZXJ2aWNlfSBmcm9tIFwiLi9zdXBlcnZpc29yL3N1cGVydmlzb3Iuc2VydmljZVwiO1xuaW1wb3J0IHtWaWV3QXR0ZW5kZW5jZUNvbXBvbmVudH0gZnJvbSBcIi4vVmlld0F0dGVuZGVuY2Uvdmlldy1hdHRlbmRlbmNlLmNvbXBvbmVudFwiO1xuaW1wb3J0IHt2aWV3QXR0ZW5kZW5jZVNlcnZpY2V9IGZyb20gXCIuL1ZpZXdBdHRlbmRlbmNlL3ZpZXctYXR0ZW5kZW5jZS5zZXJ2aWNlXCI7XG4vLyBVbmNvbW1lbnQgYW5kIGFkZCB0byBOZ01vZHVsZSBpbXBvcnRzIGlmIHlvdSBuZWVkIHRvIHVzZSB0d28td2F5IGJpbmRpbmdcbi8vIGltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5cbi8vIFVuY29tbWVudCBhbmQgYWRkIHRvIE5nTW9kdWxlIGltcG9ydHMgIGlmIHlvdSBuZWVkIHRvIHVzZSB0aGUgSFRUUCB3cmFwcGVyXG4vLyBpbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcbkBOZ01vZHVsZSh7XG4gICAgYm9vdHN0cmFwOiBbXG4gICAgICAgIEFwcENvbXBvbmVudFxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgICAgIEFwcFJvdXRpbmdNb2R1bGUsXG4gICAgICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgICAgICBOYXRpdmVTY3JpcHRMb2NhbGl6ZU1vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0SHR0cENsaWVudE1vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSxcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBBcHBDb21wb25lbnQsXG4gICAgICAgIEl0ZW1zQ29tcG9uZW50LFxuICAgICAgICBJdGVtRGV0YWlsQ29tcG9uZW50LFxuICAgICAgICBMb2dpbkNvbXBvbmVudCxcbiAgICAgICAgU3VwZXJ2aXNvckNvbXBvbmVudCxcbiAgICAgICAgVmlld0F0dGVuZGVuY2VDb21wb25lbnRcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBOYXRpdmVTY3JpcHRIdHRwQ2xpZW50TW9kdWxlLFxuICAgICAgICBJdGVtU2VydmljZSxcbiAgICAgICAgTG9naW5TZXJ2aWNlLFxuICAgICAgICBTdXBlcnZpc29yU2VydmljZSxcbiAgICAgICAgdmlld0F0dGVuZGVuY2VTZXJ2aWNlXG4gICAgXSxcbiAgICBzY2hlbWFzOiBbXG4gICAgICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgICBdXG59KVxuLypcblBhc3MgeW91ciBhcHBsaWNhdGlvbiBtb2R1bGUgdG8gdGhlIGJvb3RzdHJhcE1vZHVsZSBmdW5jdGlvbiBsb2NhdGVkIGluIG1haW4udHMgdG8gc3RhcnQgeW91ciBhcHBcbiovXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuIl19