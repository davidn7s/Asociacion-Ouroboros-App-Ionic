import { Juego } from "./Juego"

export class Almacenamiento{
    
    id:string= ''
    ubicacion:string=''
    juegos:Juego[]=[]

    constructor(){}

    public static createFromJsonObject(jsonObject: any): Almacenamiento {
        
        let almacenamiento: Almacenamiento = new Almacenamiento();
        almacenamiento.id = jsonObject['id'];
        almacenamiento.ubicacion = jsonObject['ubicacion'];
        jsonObject.juegos.forEach((juegoJson: any) => {
            almacenamiento.juegos.push(Juego.createFromJsonObject(juegoJson));
        });
        
        return almacenamiento;
    }
}