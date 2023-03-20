export class Participante {
    id: any = null;
    nombre: string = '';
    apellidos: string = '';
    puntos:number=1;

    constructor() { }

    public static createFromJsonObject(jsonObject: any): Participante {
        let participante: Participante = new Participante();
        participante.id = jsonObject['id'];
        participante.nombre = jsonObject['nombre'];
        participante.apellidos = jsonObject['apellidos'];
        participante.puntos=jsonObject['puntos'];

        return participante;
    }
}
