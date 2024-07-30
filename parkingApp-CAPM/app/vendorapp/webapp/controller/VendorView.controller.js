sap.ui.define([
    "./baseController",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller, Fragment, MessageToast, MessageBox, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.app.vendorapp.controller.VendorView", {
            onInit: async function () {
                if (!this.oReserve) {
                    this.oReserve = await this.loadFragment("reserveSlot")
                }
                this.oReserve.open();

                const newReserveModel = new JSONModel({
                    driverName: "",
                    driverMobile: "",
                    vehicleNumber: "",
                    deliveryType: "",
                    vendorName: ""
                });
                this.getView().setModel(newReserveModel, "newReserveModel");


            },
            onCloseDialog: function () {
                if (this.oReserve.isOpen()) {
                    this.oReserve.close()
                }

            },
            onBookPress: async function () {
                if (!this.oReserve) {
                    this.oReserve = await this.loadFragment("reserveSlot")
                }
                this.oReserve.open()
            },
            onBookSlotPress: function () {
                debugger
                const oModel = this.getView().getModel(),
                    oUserView = this.getView(),
                    oThis = this
                var sDriverName = this.getView().byId("idkdjgbrrddrivername").getValue()
                var sDriverMobile = this.getView().byId("iddrivrtmobilwInput").getValue()
                var sVehicle = this.getView().byId("idameInput").getValue()
                // var sTypeofdelivery = this.getView().byId("idTypeOfDelivery").getSelectedKey()
                var sVendorName = this.getView().byId("idvendordadNameInput").getValue()


                const newReserveModel = {

                    driverName: sDriverName,
                    driverMobile: sDriverMobile,
                    vehicleNumber: sVehicle,
                    // deliveryType: sTypeofdelivery,
                    vendorName: sVendorName

                }
                const oBinding = oModel.bindList("/reservations")

                var bValid = true;
                if (!sDriverName || sDriverName.length < 3) {
                    oUserView.byId("idkdjgbrrddrivername").setValueState("Error");
                    oUserView.byId("idkdjgbrrddrivername").setValueStateText("Name Must Contain 3 Characters");
                    bValid = false;
                } else {
                    oUserView.byId("idkdjgbrrddrivername").setValueState("None");
                }
                if (!sDriverMobile || sDriverMobile.length !== 10 || !/^\d+$/.test(sDriverMobile)) {
                    oUserView.byId("iddrivrtmobilwInput").setValueState("Error");
                    oUserView.byId("iddrivrtmobilwInput").setValueStateText("Mobile number must be a 10-digit numeric value");

                    bValid = false;
                } else {
                    oUserView.byId("iddrivrtmobilwInput").setValueState("None");
                }
                if (!sVehicle || !/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(sVehicle)) {
                    oUserView.byId("idameInput").setValueState("Error");
                    oUserView.byId("idameInput").setValueStateText("Vehicle number should follow this pattern AP12BG1234");

                    bValid = false;
                } else {
                    oUserView.byId("idameInput").setValueState("None");
                }
                if (!sVendorName || sVendorName.length < 3) {
                    oUserView.byId("idvendordadNameInput").setValueState("Error");
                    oUserView.byId("idvendordadNameInput").setValueStateText("Vendor Name Must Contain 3 Characters");
                    bValid = false;
                } else {
                    oUserView.byId("idvendordadNameInput").setValueState("None");
                }
                if (!bValid) {
                    MessageToast.show("Please enter correct data");
                    return; // Prevent further execution

                }

                var oReadReservedSlots = oModel.bindList("/reservations");

                oReadReservedSlots.filter([
                    new Filter("vehicleNumber", FilterOperator.EQ, sVehicle)
                ]);

                oReadReservedSlots.requestContexts().then(function (aReservedContext) {
                    if (aReservedContext.length > 0) {
                        MessageBox.warning("You can not reserve.vehicle number " + sVehicle + " already reserved")
                    } else {

                        const Reservation = oBinding.create(newReserveModel)
                        if (Reservation) {
                            oModel.refresh()
                            oThis.getView().byId("idkdjgbrrddrivername").setValue("")
                            oThis.getView().byId("iddrivrtmobilwInput").setValue("")
                            oThis.getView().byId("idameInput").setValue("")
                            oThis.getView().byId("idvendordadNameInput").setValue("")
                            MessageBox.success("Reservation Sent.Slot allotment will be sent to your mobile number")

                        }
                    }
                })
            }
        });
    });
