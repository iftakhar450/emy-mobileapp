import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Http, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import {setString,getString,setNumber,getNumber,setBoolean,getBoolean} from "tns-core-modules/application-settings";

@Injectable()
export class SupervisorService {

    private serverUrl = "https://emy-uae.herokuapp.com";


    constructor(private http: Http) { }

    get_supervisor_users() {

        // console.log("data"+JSON.stringify(data));
        let options = this.createRequestOptions();
        return this.http.post(this.serverUrl+"/get/supervisor/user", {  }, { headers: options })
            .map(res => res);
    }
    get_supervisor_sides(data) {

        // console.log("data"+JSON.stringify(data));
        let options = this.createRequestOptions();
        return this.http.post(this.serverUrl+"/sides", {data }, { headers: options })
            .map(res => res);
    }
    submit_attendence_api(data) {

       // console.log("data"+JSON.stringify(data));
        let options = this.createRequestOptions();
        return this.http.post(this.serverUrl+"/post/attendence", {data }, { headers: options })
            .map(res => res);
    }
    private createRequestOptions() {
        let headers = new Headers();
        let token=getString("token");
     //   alert(token);
        headers.set("Content-Type", "application/json");
        headers.set("token",token );

        return headers;
    }

}
