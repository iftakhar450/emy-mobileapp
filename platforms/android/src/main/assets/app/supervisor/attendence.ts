

export class Attendence {
    public id: string;
    public name: string;
    public sidename: string;
    public overtime: string;
    public status: string;
    public attendent: string;
    public date: string;




    constructor(id: string, n: string,sn:string,ot:string,s:string,att:string,d:string){

        this.id=id;
        this.name=n;
        this.sidename=sn;
        this.overtime=ot;
        this.status=s;
        this.attendent=att;
        this.date=d;

    }



}
