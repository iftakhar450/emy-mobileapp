import {NativeScriptHttpClientModule} from "nativescript-angular/http-client";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import {NativeScriptFormsModule} from "nativescript-angular/forms"
import { ItemService } from "./item/item.service";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import {LoginComponent} from "./Login/login.component";
import {SupervisorComponent} from "./supervisor/supervisor.component";
import { NativeScriptLocalizeModule } from "nativescript-localize/angular";
import {LoginService} from "./Login/login.service";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import {SupervisorService} from "./supervisor/supervisor.service";
import {ViewAttendenceComponent} from "./ViewAttendence/view-attendence.component";
import {viewAttendenceService} from "./ViewAttendence/view-attendence.service";
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from "nativescript-angular/http";
@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptLocalizeModule,
        NativeScriptHttpClientModule,
        NativeScriptHttpModule,
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        ItemDetailComponent,
        LoginComponent,
        SupervisorComponent,
        ViewAttendenceComponent
    ],
    providers: [
        NativeScriptHttpClientModule,
        ItemService,
        LoginService,
        SupervisorService,
        viewAttendenceService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
