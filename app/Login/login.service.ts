import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Http, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";


@Injectable()
export class LoginService {

    private serverUrl = "https://emy-uae.herokuapp.com";

    constructor(private http: Http) { }

    user_login_api_call(data: any) {

        // console.log("data"+JSON.stringify(data));
        let options = this.createRequestOptions();
        return this.http.post(this.serverUrl+"/superuser/login", { data }, { headers: options })
            .map(res => res);
    }

    private createRequestOptions() {
        let headers = new Headers();

        headers.set("Content-Type", "application/json");

        return headers;
    }

}
