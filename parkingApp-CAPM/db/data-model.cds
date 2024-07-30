namespace my.parking;

using {cuid} from '@sap/cds/common';

entity parkingSlots : cuid {

  slotNumbers : String;
  status : String;
// editable: Boolean;

}

entity assignedSlots : cuid {
  driverName    : String;
  driverMobile  : String;
  vehicleNumber : String;
  deliveryType  : String;
  checkInTime   : String;
  slotNumber    : Association to parkingSlots;
  vendor_Name   : String;
// editable: Boolean;

}

entity reservations : cuid {

  driverName    : String;
  driverMobile  : String;
  vehicleNumber : String;
  vendorName    : String;

}

entity reserved : cuid {

  driverName    : String;
  driverMobile  : String;
  vehicleNumber : String;
  // deliveryType  : String;
  vendor_Name    : String;
  reservedSlot : Association to parkingSlots;
  reservedDate:String;

}

entity history : cuid {

  driverName        : String;
  driverMobile      : String;
  vehicleNumber     : String;
  deliveryType      : String;
  checkInTime       : String;
  vendor_Name       : String;
  historySlotNumber : Association to parkingSlots;
  checkOutTime      : String;

}
