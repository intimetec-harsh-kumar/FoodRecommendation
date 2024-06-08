export class Users {
    public name:string
    public age:number 

    constructor(name:string,age:number){
        this.name=name;
        this.age=age;
    }
    public getDetails(){
        console.log('Name : ',this.name);
        console.log('Age : ',this.age);
    }
}