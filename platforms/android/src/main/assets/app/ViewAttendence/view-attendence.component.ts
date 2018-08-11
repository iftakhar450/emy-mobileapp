import {Component, OnInit} from "@angular/core";
import {TextField} from "tns-core-modules/ui/text-field";
import {Page} from "tns-core-modules/ui/page";
import {Router} from "@angular/router";

import {
    setString,
    getString,
    setNumber,
    getNumber,
    setBoolean,
    getBoolean
} from "tns-core-modules/application-settings";
import {viewAttendenceService} from "./view-attendence.service";
import {ViewAttendence} from "./viewAttendence";
import {StackLayout} from "tns-core-modules/ui/layouts/stack-layout";
import {AbsoluteLayout} from "tns-core-modules/ui/layouts/absolute-layout";
import {RouterExtensions} from "nativescript-angular";
import {GridLayout} from "tns-core-modules/ui/layouts/grid-layout";

const localize = require("nativescript-localize");

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./view-attendence.component.html",
    styleUrls: ["view.css"]
})
export class ViewAttendenceComponent implements OnInit {


    public today: any;
    public showdate: any;

    public today_attendence_status: ViewAttendence[];


    public date:Date;
    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    constructor(private page: Page, private router: Router, private myservice: viewAttendenceService, private routerExtensions: RouterExtensions) {

    }

    ngOnInit(): void {
        this.date=new Date();
        this.today = this.date.getFullYear() + "-" + Number(this.date.getMonth() + 1) + "-" + this.date.getDate();
        this.showdate=this.date.getDate()+"-"+Number(this.date.getMonth() + 1)+"-"+this.date.getFullYear();
        this.get_attendence_today(this.today);
    }


    previous_date() {
        this.date.setDate(this.date.getDate()-1);
        this.today = this.date.getFullYear() + "-" + Number(this.date.getMonth() + 1) + "-" + this.date.getDate();
        this.showdate=this.date.getDate()+"-"+Number(this.date.getMonth() + 1)+"-"+this.date.getFullYear();
        this.get_attendence_today(this.today);


    }

    next_date() {

        this.date.setDate(this.date.getDate()+1);
        this.today = this.date.getFullYear() + "-" + Number(this.date.getMonth() + 1) + "-" + this.date.getDate();
        this.showdate=this.date.getDate()+"-"+Number(this.date.getMonth() + 1)+"-"+this.date.getFullYear();
        this.get_attendence_today(this.today);

    }

    get_attendence_today(data) {


        this.myservice.get_today_all_user_attendence_api({search_date: data})
            .subscribe(res => {


                    this.onSuccess(res);
                },
                (error) => {

                    let string_response = JSON.stringify(error);

                    //alert("user not exsist");
                    alert(JSON.stringify(error._body.message));


                });


        //alert(this.id+this.password);
        //  this.router.navigate(["/supervisor"]);
    }

    onSuccess(res) {

        this.today_attendence_status = [];
        let string_response = JSON.stringify(res);
        let helper = JSON.parse(string_response);
        console.log(helper._body.records.length);
        // this.router.navigate(["/supervisor"]);

        for (let i = 0; i < helper._body.records.length; i++) {

            let att = new ViewAttendence(helper._body.records[i].id, helper._body.records[i].name,
                helper._body.records[i].sidename, helper._body.records[i].overtime, helper._body.records[i].attendent, helper._body.records[i].status);
            this.today_attendence_status.push(att);
        }

        if (this.today_attendence_status.length == 0) {

            let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("notattendencefound");
            ablayout.visibility = "visible";
        } else {

            let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("notattendencefound");
            ablayout.visibility = "collapse";
        }

        console.log(JSON.stringify(this.today_attendence_status));
    }


    onviewlisttap(args) {

        console.log(args.index);
        let id = this.today_attendence_status[args.index].id;
        console.log(id);
        let ablayout: GridLayout = <GridLayout>this.page.getViewById(id);

        if (ablayout.visibility == "visible") {
            ablayout.visibility = "collapse";
        } else {

            ablayout.visibility = "visible";
        }
    }

    public goBack() {
        this.routerExtensions.backToPreviousPage();
    }
}