import { Injectable } from '@angular/core';
import { Usuario } from 'src/modelo/Usuario';

@Injectable({
  providedIn: 'root'
})
export class GlobalMethodsService {


  public usuGlobal: Usuario = new Usuario();


  constructor() { }


}
