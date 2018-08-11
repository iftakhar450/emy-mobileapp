import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Http, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import {getString} from "tns-core-modules/application-settings";


@Injectable()
export class viewAttendenceService {

    private serverUrl = "https://emy-uae.herokuapp.com";

    constructor(private http: Http) { }

    get_today_all_user_attendence_api(data: any) {

        // console.log("data"+JSON.stringify(data));
        let options = this.createRequestOptions();
        return this.http.post(this.serverUrl+"/today/alluser/attendence", { data }, { headers: options })
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
