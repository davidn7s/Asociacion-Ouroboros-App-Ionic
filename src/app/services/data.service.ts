import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'
import { BehaviorSubject, from, of } from 'rxjs';
import { switchMap,filter } from 'rxjs/operators';

const STORAGE_KEY='mylist';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private storageReady= new BehaviorSubject(false);
  
  constructor(private storage:Storage) {
   }//end constructor

  async init(){
    await this.storage.defineDriver(CordovaSQLiteDriver);
     await this.storage.create();
     this.storageReady.next(true)
  }//end init

  getData(){
    return this.storageReady.pipe(
      filter(ready=>ready),
      switchMap(()=>{
        return from(this.storage.get(STORAGE_KEY)) ||of([])
      })
    )
  }//end getData

  async addData(item:any){
    const storedData=await this.storage.get(STORAGE_KEY) || [];
    storedData.push(item);
    return this.storage.set(STORAGE_KEY,storedData)
  }//end addData

  async removeItem(){
    const storedData=await this.storage.get(STORAGE_KEY) || [];
    storedData.pop()
    storedData.pop()
    storedData.pop()
    return this.storage.set(STORAGE_KEY,storedData)
  }//end removeItem
  
}
