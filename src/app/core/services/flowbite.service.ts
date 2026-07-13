import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlowbiteService {
  loadFlowbite(_callback: (flowbite: any) => void) {}
}
