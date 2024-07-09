sap.ui.define([
    "./baseController",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
],
    function (Controller, Fragment, MessageToast) {
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
            onBookSlotPress: function(){
                const oModel = this.getView().getModel()
                var sDriverName = this.getView().byId("idkdjgbrrddrivername").getValue()
                var sDriverMobile = this.getView().byId("iddrivrtmobilwInput").getValue()
                var sVehicle = this.getView().byId("idameInput").getValue()
                // var sTypeofdelivery = this.getView().byId("idTypeOfDelivery").getSelectedKey()
                var sVendorName = this.getView().byId("idvendordadNameInput").getValue()

                const newReserveModel = {

                    driverName: sDriverName,
                    driverMobile:sDriverMobile,
                    vehicleNumber: sVehicle,
                    // deliveryType: sTypeofdelivery,
                    vendorName: sVendorName

                }

                const oBinding = oModel.bindList("/reservations")
                const Reservation = oBinding.create(newReserveModel)
                if(Reservation){
                    MessageToast.show("Reservation Sent")

                }
            }
        });
    });
