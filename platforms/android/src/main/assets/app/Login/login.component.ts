import { Component, OnInit } from "@angular/core";
import {TextField} from "tns-core-modules/ui/text-field";
import {Page} from "tns-core-modules/ui/page";
import {Router} from "@angular/router";
import {LoginService} from "./login.service";
import {setString,getString,setNumber,getNumber,setBoolean,getBoolean} from "tns-core-modules/application-settings";
import {RouterExtensions} from "nativescript-angular";
const localize = require("nativescript-localize");

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ["login.css"]
})
export class LoginComponent implements OnInit {

        public id:string="";
        public password:string="";
        public isBusy:boolean=false;
    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    constructor(private page:Page,private router:Router,private myloginservice:LoginService,private routerExtensions: RouterExtensions) {

    }

    ngOnInit(): void {

        console.log(localize('Login'));
    }
    togglepassowrd() {

        let tfield: TextField = <TextField>this.page.getViewById("password");
        tfield.secure = !tfield.secure;
    }
    login(){
        if(this.id!="" && this.password!=""){

            let that=this;
            that.myloginservice
                .user_login_api_call({ id: that.id, password: that.password })
                .subscribe(res => {
                        this.isBusy=true;

                       that.onSuccess(res);
                    },
                    (error) => {
                        this.isBusy=false;
                        let string_response = JSON.stringify(error);

                        //alert("user not exsist");
                        alert(JSON.stringify(error._body.message));


                    });

        }else{

            alert("Email or Password required");
        }

        //alert(this.id+this.password);
      //  this.router.navigate(["/supervisor"]);
    }


    onSuccess(res){

        let string_response = JSON.stringify(res);
        let helper = JSON.parse(string_response);
        setString("token",JSON.stringify(helper._body.user.token));
        setString("id",JSON.stringify(helper._body.user.id));
        setString("name",helper._body.user.name);
        this.isBusy=false;

        this.routerExtensions.navigate(["/supervisor"], {
            clearHistory: true
        });


    }
}