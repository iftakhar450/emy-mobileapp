import { Component } from "@angular/core";
const application = require("application");
const localize = require("nativescript-localize");
application.setResources({ L: localize });
@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent { }
