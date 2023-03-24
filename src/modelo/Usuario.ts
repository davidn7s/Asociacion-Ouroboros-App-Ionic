export  class Usuario{

    id:any=null
    nombre:string='';
    apellidos:string='';
    email:string='';
    cargo:string='';
    estado:boolean=true;
    gestor:boolean=false;

    
    constructor() {
    }

    public static createFromJsonObject(jsonObject: any): Usuario {
        let usuario: Usuario = new Usuario();
        usuario.id = jsonObject['id'];
        usuario.nombre = jsonObject['nombre'];
        usuario.apellidos = jsonObject['apellidos'];
        usuario.email=jsonObject['email'];
        usuario.cargo=jsonObject['cargo'];
        usuario.estado=jsonObject['estado'];
        usuario.gestor=jsonObject['gestor'];
       
    
       
        return usuario;
    }

}