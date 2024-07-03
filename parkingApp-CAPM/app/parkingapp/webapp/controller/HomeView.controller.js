sap.ui.define([
    "./basecontroller",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    function (Controller, JSONModel, Fragment, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.app.parkingapp.controller.HomeView", {
            onInit: function () {
                // var oData = {
                //     driverName: "",
                //     driverMobile: "",
                //     vehicleNumber: "",
                //     deliveryType: "",
                //     checkInTime: "",
                //     slotNumber: "",
                //     editable:false
                // };
                // var oModel = new JSONModel(oData);
                // this.getView().setModel(oModel, "oModel");
            },
            onEditPress: function () {
                debugger
                // var oSelected = this.getView().byId("idAssignedTable").getSelectedItem()
                // var oViewModel = oSelected.getModel("oModel");
                // oViewModel.setProperty("/editable", "true");
                // this.getView().byId("idAssignedTable").getBinding("items").refresh()
                // var oModel = this.getView().getModel("oModel");
                // oModel.setProperty("/editable", true);
                // Backup original data for cancel functionality
                // var aProducts = oModel.getProperty("/products");
                // var aBackup = JSON.parse(JSON.stringify(aProducts));
                // oModel.setProperty("/backup", aBackup);
            },
            onReservationsPress: async function () {

                debugger
                if (!this.Reservationspopup) {
                    this.Reservationspopup = await this.loadFragment("Reservations")
                }
                this.Reservationspopup.open()

            },
            onCloseReservations: function () {
                if (this.Reservationspopup.isOpen()) {
                    this.Reservationspopup.close()
                }

            },
            onSearch: function (oEvent) {
                debugger
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filterVehicle = new Filter("vehicleNumber", FilterOperator.Contains, sQuery);
                    var filterSlot = new Filter("slotNumber/slotNumbers", FilterOperator.Contains, sQuery);
                    var filterName = new Filter("driverName", FilterOperator.Contains, sQuery);
                    var filterMobile = new Filter("driverMobile", FilterOperator.Contains, sQuery);
                    var filterDelivery = new Filter("deliveryType", FilterOperator.Contains, sQuery);
                    // var filterCheckIn = new Filter("checkInTime", FilterOperator.Contains, sQuery);

                    var allFilter = new Filter([filterVehicle, filterSlot, filterName, filterMobile, filterDelivery]);
                }

                // update list binding
                var oList = this.byId("idAssignedTable");
                var oBinding = oList.getBinding("items");
                oBinding.filter(allFilter);
            },


        });
    });
