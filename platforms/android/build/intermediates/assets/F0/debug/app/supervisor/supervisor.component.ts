import {Component, OnInit} from "@angular/core";
import {TextField} from "tns-core-modules/ui/text-field";
import {Page} from "tns-core-modules/ui/page";
import {StackLayout} from "tns-core-modules/ui/layouts/stack-layout";
import {Image} from "tns-core-modules/ui/image";
import {AbsoluteLayout} from "tns-core-modules/ui/layouts/absolute-layout";
import {FontWeight, KeyboardType} from "tns-core-modules/ui/enums";
import black = FontWeight.black;
import {TabView} from "tns-core-modules/ui/tab-view";
import {GridLayout} from "tns-core-modules/ui/layouts/grid-layout";
import {SelectedIndexChangedEventData} from "nativescript-drop-down";
import {DropDown} from "nativescript-drop-down";
import {
    setString,
    getString,
    setNumber,
    getNumber,
    setBoolean,
    getBoolean
} from "tns-core-modules/application-settings";
import {SupervisorService} from "./supervisor.service";
import {users} from "./supervisor";
import {Sides} from "./sides";
import number = KeyboardType.number;
import {Attendence} from "./attendence";
import {Button} from "tns-core-modules/ui/button";
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular";
const connectivityModule = require("tns-core-modules/connectivity");
@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./supervisor.component.html",
    styleUrls: ["supervisor.css"]
})
export class SupervisorComponent implements OnInit {

    public id: string;
    public password: string;

    //public users:string[]=["Ali","Amir","Zubair"];
    public favourit_emy: users [] = [];
    public other_emy: users [] = [];
    public attendence: Attendence [] = [];
    public absents: Attendence [] = [];

    public sides: Sides[] = [];
    public overtime: string[] = ["1", "2", "3"];
    public select_side: string = "Select Side Name";
    public select_overtime: string = "Add overtime";
    public info: string;
    public today: any;

    public list_index: any;
    public user_list_type: any;
    public internet: boolean;
    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    constructor(private page: Page, private service: SupervisorService,private  router:Router,private routerExtensions: RouterExtensions) {
    }

    ngOnInit(): void {

        const connectionType = connectivityModule.getConnectionType();

        switch (connectionType) {
            case connectivityModule.connectionType.none:
                // Denotes no Internet connection.
                console.log("No connection");
                this.internet=false;
                break;
            case connectivityModule.connectionType.wifi:
                // Denotes a WiFi connection.
                console.log("WiFi connection");
                this.internet=true;
                break;
            case connectivityModule.connectionType.mobile:
                // Denotes a mobile connection, i.e. cellular network or WAN.
                console.log("Mobile connection");
                this.internet=true;
                break;
            default:
                break;
        }

            if(getString("token")==undefined || getString("token")=="")
            {

               // this.router.navigate(["/login"]);


                this.routerExtensions.navigate(["/login"], {
                    clearHistory: true
                });
            }else{
                if(this.internet==true){
                    this.get_Supervisor_user_from_api();
                    this.get_Supervisor_sides_from_api();
                }


            }


    }

    get_Supervisor_sides_from_api() {

        this.service
            .get_supervisor_sides({id: getString("id")})
            .subscribe(res => {
                    console.log("sides");

                    let string_response = JSON.stringify(res);
                    let helper = JSON.parse(string_response);
                    console.log(JSON.stringify(helper));

                    for (let i = 0; i < helper._body.projects.length; i++) {

                        let side = new Sides(helper._body.projects[i].id, helper._body.projects[i].urduname);


                        this.sides.push(side);

                    }


                },
                (error) => {

                    let string_response = JSON.stringify(error);

                    //alert("user not exsist");
                    alert(JSON.stringify(error._body.message));


                });


    }

    get_Supervisor_user_from_api() {

        this.service
            .get_supervisor_users()
            .subscribe(res => {
                    console.log("succes");

                    let string_response = JSON.stringify(res);
                    let helper = JSON.parse(string_response);
                   /* console.log("-------------------------------------------");
                            console.log(JSON.stringify(helper._body.previous));
                    console.log("------------------------------------");*/

                    let d = new Date(helper._body.date);
                    this.today = d.getDate() + "-" + Number(d.getMonth()+1) + "-" + d.getFullYear();
                    setString("date",d.getFullYear()+"-"+Number(d.getMonth()+1)+"-"+d.getDate());
                   // console.log(this.today);

                    for (let i = 0; i < helper._body.response.length; i++) {

                        /*    console.log("--------------------------");
                            console.log(JSON.stringify(helper._body.response[i].id));
                            console.log(JSON.stringify(helper._body.response[i].name));
                            console.log(JSON.stringify(helper._body.response[i].urdu_name));
                            console.log(JSON.stringify(helper._body.response[i].profession));
                            console.log("------------------------------");*/


                        let user = new users(helper._body.response[i].id, helper._body.response[i].name,
                            helper._body.response[i].urdu_name, helper._body.response[i].profession, "", "", "checkempty");

                        if(helper._body.response[i].status=="working"){
                            if (helper._body.response[i].supervisor_id == getString("id")) {
                                this.favourit_emy.push(user);
                            }
                            else {

                                this.other_emy.push(user);
                            }

                        }







                    }
                    /////checking if already attendence added
                    for(let i=0;i<helper._body.previous.length;i++){

                       for(let k=0;k<this.favourit_emy.length;k++){

                           if(this.favourit_emy[k].id==helper._body.previous[i].id){

                                this.favourit_emy.splice(k,1);

                           }


                       }
                        for(let l=0;l<this.other_emy.length;l++){

                            if(this.other_emy[l].id==helper._body.previous[i].id){

                                this.other_emy.splice(l,1);

                            }


                        }




                    }
                //    console.log("----------ffff---------" + JSON.stringify(this.favourit_emy));
                 //   console.log("----------others---------" + JSON.stringify(this.other_emy));
                },
                (error) => {

                    let string_response = JSON.stringify(error);

                    //alert("user not exsist");
                    alert(JSON.stringify(error._body.message));


                });


    }

////////////////////for tabview
    onIndexChanged(args) {

        //  alert(args.object+args.object.index);
    }

    gotoattendence() {


        let ablayout: StackLayout = <StackLayout>this.page.getViewById("presentlayout");
        ablayout.visibility = "visible";


    }


    gotoabsent() {


        let ablayout: StackLayout = <StackLayout>this.page.getViewById("abesntlayout");
        ablayout.visibility = "visible";


    }



    onUserListItemTap(args, status) {


        this.list_index = args.index;
        this.user_list_type = status;

        let ab  : AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectworkedside");

        if(ab.visibility == "visible"){

            ab.visibility="collapse";
        }else{




        if (status == 1) {


            if (this.favourit_emy[args.index].src == "checked") {
                this.favourit_emy[args.index].src = "checkempty";
                   for(let i=0;i<this.attendence.length;i++){
                        console.log(this.attendence[i].id+"-----------------"+this.favourit_emy[this.list_index].id);
                       if(this.attendence[i].id==this.favourit_emy[args.index].id){
                           this.attendence.splice(i,1);
                       }
                   }

            } else {


                let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectworkedside");
                ablayout.visibility = "visible";
                let ablayout1: GridLayout = <GridLayout>this.page.getViewById("presentlayout");
                ablayout1.opacity = 1;

            }


        } else {
            if (this.other_emy[args.index].src == "checked") {
                this.other_emy[args.index].src = "checkempty";
                for(let i=0;i<this.attendence.length;i++){
                    console.log(this.attendence[i].id+"-----------------"+this.other_emy[this.list_index].id);
                    if(this.attendence[i].id==this.other_emy[args.index].id){
                        this.attendence.splice(i,1);
                    }
                }

            } else {


                let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectworkedside");
                ablayout.visibility = "visible";
                let ablayout1: GridLayout = <GridLayout>this.page.getViewById("presentlayout");
                ablayout1.opacity = 1;

            }

        }

        }


    }

    onAbsentListItemTap(args, status) {

        if (status == 1) {

            if(this.favourit_emy[args.index].src == "checked"){

                this.favourit_emy[args.index].src = "checkempty";

                for(let i=0;i<this.absents.length;i++){
                    if(this.absents[i].id==this.favourit_emy[args.index].id){
                        this.absents.splice(i,1);

                    }

                }
            }else{
                let btn: Button = <Button>this.page.getViewById("submit_attendencebtn");
                btn.visibility="visible";

                this.favourit_emy[args.index].src = "checked";
                let rec=new Attendence(this.favourit_emy[args.index].id,this.favourit_emy[args.index].name,"",
                    "","A",getString("name"),getString("date"));
                this.absents.push(rec);

            }


        }
        else {


            if(this.other_emy[args.index].src == "checked"){

                this.other_emy[args.index].src = "checkempty";
                for(let i=0;i<this.absents.length;i++){
                    if(this.absents[i].id==this.other_emy[args.index].id){
                        this.absents.splice(i,1);

                    }

                }
            }else{

                let btn: Button = <Button>this.page.getViewById("submit_attendencebtn");
                btn.visibility="visible";
                this.other_emy[args.index].src = "checked";
                let rec=new Attendence(this.other_emy[args.index].id,this.other_emy[args.index].name,"",
                    "","A",getString("name"),getString("date"));
                this.absents.push(rec);

            }


        }
        console.log(JSON.stringify(this.absents));


    }


    empty() {
        let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectworkedside");
        if (ablayout.visibility == "visible") {

            ablayout.visibility = "collapse";
            let ablayout1: GridLayout = <GridLayout>this.page.getViewById("presentlayout");
            ablayout1.opacity = 1;

        }


    }

    empty1() {


    }

    selectside() {

        console.log("called");
        let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectsidedetail");
        ablayout.visibility = "visible";


    }

    onselecsidedetail(args) {


        let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectsidedetail");
        ablayout.visibility = "collapse";

        this.select_side = this.sides[args.index].id;
        this.info = "";
    }


    selectovertime() {

        let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectovertime");
        ablayout.visibility = "visible";
    }

    onOvertimeDetail(args) {


        let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectovertime");
        ablayout.visibility = "collapse";

        this.select_overtime = this.overtime[args.index];
    }

    onCanceldetail() {


        let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectworkedside");
        ablayout.visibility = "collapse";
        let ablayout1: GridLayout = <GridLayout>this.page.getViewById("presentlayout");
        ablayout1.opacity = 1;
        this.info = "";
    }

    onSubmitdetail() {

        if (this.select_side == "Select Side Name") {

            this.info = "Please add side detail";
        } else {
            if (this.user_list_type == 1) {
                if (this.select_overtime == "Add overtime") {
                    this.favourit_emy[this.list_index].src = "checked";
                    this.favourit_emy[this.list_index].sidename = this.select_side;
                    this.favourit_emy[this.list_index].overtime = this.select_overtime;

                    let att = new Attendence(this.favourit_emy[this.list_index].id, this.favourit_emy[this.list_index].name,
                        this.favourit_emy[this.list_index].sidename, "0", "P",getString("name"),getString("date"));

                    this.attendence.push(att);
                } else {
                    this.favourit_emy[this.list_index].src = "checked";
                    this.favourit_emy[this.list_index].sidename = this.select_side;
                    this.favourit_emy[this.list_index].overtime = this.select_overtime;

                    let att = new Attendence(this.favourit_emy[this.list_index].id, this.favourit_emy[this.list_index].name,
                        this.favourit_emy[this.list_index].sidename, this.favourit_emy[this.list_index].overtime, "P",getString("name"),getString("date"));

                    this.attendence.push(att);

                }


            } else {
                if (this.select_overtime == "Add overtime") {
                    this.other_emy[this.list_index].src = "checked";
                    this.other_emy[this.list_index].sidename = this.select_side;
                    this.other_emy[this.list_index].overtime = this.select_overtime;

                    let att = new Attendence(this.other_emy[this.list_index].id, this.other_emy[this.list_index].name,
                        this.other_emy[this.list_index].sidename, "0", "P",getString("name"),getString("date"));

                    this.attendence.push(att);
                } else {
                    this.other_emy[this.list_index].src = "checked";
                    this.other_emy[this.list_index].sidename = this.select_side;
                    this.other_emy[this.list_index].overtime = this.select_overtime;

                    let att = new Attendence(this.other_emy[this.list_index].id, this.other_emy[this.list_index].name,
                        this.other_emy[this.list_index].sidename, this.other_emy[this.list_index].overtime, "P",getString("name"),getString("date"));

                    this.attendence.push(att);

                }

            }

            let btn: Button = <Button>this.page.getViewById("submitattence_btn");
            btn.visibility="visible";
            let ablayout: AbsoluteLayout = <AbsoluteLayout>this.page.getViewById("selectworkedside");
            ablayout.visibility = "collapse";
            let ablayout1: GridLayout = <GridLayout>this.page.getViewById("presentlayout");
            ablayout1.opacity = 1;
            this.info = "";
            this.select_side = "Select Side Name";
            this.select_overtime = "Add overtime";
            this.other_emy[this.list_index].overtime = "0";
            this.favourit_emy[this.list_index].overtime = "0";
        }






    }

    goBack(){


        let ablayout: StackLayout = <StackLayout>this.page.getViewById("abesntlayout");
        ablayout.visibility = "collapse";

        let ablayout1: StackLayout = <StackLayout>this.page.getViewById("presentlayout");
        ablayout1.visibility = "collapse";
        let ablayout2: StackLayout = <StackLayout>this.page.getViewById("selectworkedside");
        ablayout2.visibility = "collapse";
        let ablayout3: StackLayout = <StackLayout>this.page.getViewById("selectsidedetail");
        ablayout3.visibility = "collapse";
        let ablayout4: StackLayout = <StackLayout>this.page.getViewById("selectovertime");
        ablayout4.visibility = "collapse";
    }

    Submit_absents(){

        if(this.absents.length==0){
            alert("Please mark atleast one absent before submit.");
        }else{

            //console.log(JSON.stringify(this.attendence));
            this.service
                .submit_attendence_api({data:this.absents})
                .subscribe(res => {
                        console.log("succes attendence");

                        let string_response = JSON.stringify(res);
                        let helper = JSON.parse(string_response);

                        // console.log(JSON.stringify(helper));
                        if(helper.status==200){



                            for(let i=0;i<this.absents.length;i++){

                                //////match record in favourit employee arrey
                                for(let j=0;j<this.favourit_emy.length;j++){

                                    if(this.absents[i].id==this.favourit_emy[j].id){

                                        this.favourit_emy.splice(j,1);

                                    }

                                }


                            }


                            for(let i=0;i<this.absents.length;i++) {

                                ////match record from others employee array
                                for (let k = 0; k < this.other_emy.length; k++) {
                                    if ( this.absents[i].id==this.other_emy[k].id) {

                                        this.other_emy.splice(k, 1);

                                    }

                                }
                            }
                            let btn: Button = <Button>this.page.getViewById("submit_attendencebtn");
                            btn.visibility="collapse";
                            alert("Opertation succeeded");

                        }else{


                            alert("problem occurred while submitting the attendence.");
                        }
                    },
                    (error) => {

                        let string_response = JSON.stringify(error);

                        //alert("user not exsist");
                        alert(JSON.stringify(error._body.message));


                    });
        }


    }
    Submit_Attendence(){

        if(this.attendence.length==0){
            alert("Please mark atleast one attendence before submit.");
        }else{

            //console.log(JSON.stringify(this.attendence));
            this.service
                .submit_attendence_api({data:this.attendence})
                .subscribe(res => {
                        console.log("succes attendence");

                        let string_response = JSON.stringify(res);
                        let helper = JSON.parse(string_response);

                       // console.log(JSON.stringify(helper));
                    if(helper.status==200){



                        for(let i=0;i<this.attendence.length;i++){

                            //////match record in favourit employee arrey
                            for(let j=0;j<this.favourit_emy.length;j++){

                                if(this.attendence[i].id==this.favourit_emy[j].id){

                                    this.favourit_emy.splice(j,1);

                                }

                            }


                        }


                       for(let i=0;i<this.attendence.length;i++) {

                            ////match record from others employee array
                            for (let k = 0; k < this.other_emy.length; k++) {
                                if ( this.attendence[i].id==this.other_emy[k].id) {

                                    this.other_emy.splice(k, 1);

                                }

                            }
                        }
                        let btn: Button = <Button>this.page.getViewById("submitattence_btn");
                        btn.visibility="collapse";
                        alert("Opertation succeeded");

                    }else{


                        alert("problem occurred while submitting the attendence.");
                    }
                    },
                    (error) => {

                        let string_response = JSON.stringify(error);

                        //alert("user not exsist");
                        alert(JSON.stringify(error._body.message));


                    });
        }


    }

    view_attendence(){

        this.router.navigate(["/view-attendence"]);


    }


}