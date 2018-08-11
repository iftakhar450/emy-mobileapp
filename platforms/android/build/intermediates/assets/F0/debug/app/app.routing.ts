import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import {LoginComponent} from "./Login/login.component";
import {SupervisorComponent} from "./supervisor/supervisor.component";
import {ViewAttendenceComponent} from "./ViewAttendence/view-attendence.component";

const routes: Routes = [
    { path: "", redirectTo: "/supervisor", pathMatch: "full" },
    { path: "items", component: ItemsComponent },
    { path: "item/:id", component: ItemDetailComponent },
    { path: "login", component: LoginComponent },
    { path: "supervisor", component: SupervisorComponent },
    { path: "view-attendence", component: ViewAttendenceComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }