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
// editable: Boolean;

}

entity reservations : cuid {

  driverName    : String;
  driverMobile  : String;
  vehicleNumber : String;
  deliveryType  : String;

}

entity reserved : cuid {

  driverName    : String;
  driverMobile  : String;
  vehicleNumber : String;
  deliveryType  : String;
  reservedSlot : Association to parkingSlots;

}

entity history : cuid {

  driverName        : String;
  driverMobile      : String;
  vehicleNumber     : String;
  deliveryType      : String;
  checkInTime       : String;
  historySlotNumber : Association to parkingSlots;
  checkOutTime      : String;

}
