

export class ViewAttendence {
    public id: string;
    public name: string;
    public sidename: string;
    public attendent: string;

    public overtime: string;
    public status: string;



    constructor(id: string, n: string,sn:string,ot:string,at:string,ss:string){
        this.id=id;
        this.name=n;

        this.sidename=sn;
        this.overtime=ot;
        this.attendent=at;
        this.status=ss;



    }



}
