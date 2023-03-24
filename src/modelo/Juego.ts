export class Juego{


    gameId: any = null;
    nombre: string = '';
    editorial: string = '';
    edadMinima!: number;
    cantidad!:number;
    jugadores:string='';
    tiempoJuegoMin:string='';
    imagen:string='';

    almacenamiento!:string;

    

    

    constructor() { }

    public static createFromJsonObject(jsonObject: any): Juego {
        let juego: Juego = new Juego();
        juego.gameId = jsonObject['gameId'];
        juego.nombre = jsonObject['nombre'];
        juego.editorial = jsonObject['editorial'];
        juego.edadMinima=jsonObject['edadMinima'];
        juego.cantidad=jsonObject['cantidad'];
        juego.jugadores=jsonObject['jugadores'];
        juego.tiempoJuegoMin=jsonObject['tiempoJuegoMin'];
        juego.imagen=jsonObject['imagen'];

        juego.almacenamiento=jsonObject['almacenamiento'];
        

        return juego;
    }


}