namespace my.parking;
using { cuid } from '@sap/cds/common';


entity parkingSlots :cuid {

  slotNumbers : String;
  slotType : String;
  isAvailable : Boolean;

}
entity assignedSlots : cuid {
  driverName : String;
  driverMobile : String;
  vehicleNumber : String;
  deliveryType : String;
  checkInTime : DateTime;
  slotNumber: Association to parkingSlots;
  
}
entity history : cuid {
  checkInHistory  : Association to assignedSlots;
  checkOutTime : DateTime;
}

