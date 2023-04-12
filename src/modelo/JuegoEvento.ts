import { Juego } from "./Juego";

export class JuegoEvento{
    id:any=null;
    juego!:Juego;
    vecesPrestado:number=0;
    estado:string='para prestar';


    public static createFromJsonObject(jsonObject: any): JuegoEvento {
        let juegoEvento: JuegoEvento = new JuegoEvento();
        
        juegoEvento.id=jsonObject['id'];
        juegoEvento.juego=Juego.createFromJsonObject(jsonObject['juego']);
        juegoEvento.vecesPrestado=jsonObject['vecesPrestado'];
        juegoEvento.estado=jsonObject['estado'];


        return juegoEvento;
    }

}