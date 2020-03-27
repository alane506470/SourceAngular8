import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  // private _commProfile = new BehaviorSubject<commProfile>({});
  constructor() { }
}

interface commProfile {
  // form 1
  comm_id: string;
  comm_name: string;
  comm_add1: string;
  comm_add2: string;
  comm_add3: string;
  site_in_charge: string;
  user_in_charge: string;
  num_house: string;
  chief_staff_name: string;
  chief_staff_tel: string;
  chief_staff_mobile: string;
  chairman_name: string;
  chairman_tel: string;
  chairman_mobile: string;
  // form 2
  build_company: string;
  build_date: string;
  comm_type: string;
  comm_pattern: string;
  interior_type: string;
  build_exterior: string;
  remark1: string;
  
  //form3
  org_type: string;
  household_type: string;
  org_fee: string;
  house_price: string;

  //form 4
  gas_type: string;
  voltage: string;
  Cpipe_type: string;
  Hpipe_type: string;
  remark2: string;

  //form5
  ac_type: string;
  window_type: string;
  separate_type: string;
  indoor_type: string;
  sun_type: string;

  // form6
  bath_type: string;
  bath_wall: string;
  toilet_pipe: string;
  bath_brand: string;
  sink_in: string;
  sink_out: string;
  balcony: string;
  remark3: string;
  // form7
  market_type: string;
  DM_method: string;
}
