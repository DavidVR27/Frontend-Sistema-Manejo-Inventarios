import { EventEmitter, Injectable } from '@angular/core';
import CryptoJs from "crypto-js";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static BASE_URL = 'http://localhost:8080/api';
  private static ENCRYPTION_KEY = 'encryptionKey';

  authStatusChanged = new EventEmitter<void>();

  constructor(private http: HttpClient) { }

  encryptAndSaveToStorage(key: string, value: String):void {
    const encryptedValue = CryptoJs.AES.encrypt(value, Api.ENCRYPTION_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  }

  private getFromStorageAndDecrypt(key:string) :string | null {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return CryptoJs.AES.decrypt(encryptedValue, Api.ENCRYPTION_KEY).toString(CryptoJs.enc.Utf8);
    } catch (error) {
      return null;
    }
  }

  private clearAuth(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  private getHeader(): HttpHeaders {
    const token = this.getFromStorageAndDecrypt('token');
    return new HttpHeaders ({
      Authorization: `Bearer ${token}`
    })
  }


  // Auth Verifier
  logout():void{
    this.clearAuth();
  }
  isAuthenticated():boolean{
    const token = this.getFromStorageAndDecrypt('token');
    return !!token;
  }

  isAdmin():boolean{
    const token = this.getFromStorageAndDecrypt('role');
    return role === "ADMIN";
  }


}
