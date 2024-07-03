namespace my.parking;

using {cuid} from '@sap/cds/common';

entity parkingSlots : cuid {

  slotNumbers : String;
  isAvailable : Boolean;
  editable: Boolean;

}

entity assignedSlots : cuid {
  driverName    : String;
  driverMobile  : String;
  vehicleNumber : String;
  deliveryType  : String;
  checkInTime   : DateTime;
  slotNumber    : Association to parkingSlots;
  editable: Boolean;

}


entity reservations : cuid {

  vendorName : String;
  vendorMobile  : String;
  dateReservedOn  : Date;

}
entity history : cuid {

  checkInHistory : Association to assignedSlots;
  checkOutTime   : DateTime;

}