sap.ui.define([
    "./basecontroller",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
],
    function (Controller, JSONModel, Fragment, Filter, FilterOperator, MessageToast) {
        "use strict";

        return Controller.extend("com.app.parkingapp.controller.HomeView", {
            onInit: function () {
                const newAssign = new JSONModel({
                    driverName: "",
                    driverMobile: "",
                    vehicleNumber: "",
                    deliveryType: "",
                    checkInTime: "",
                    slotNumber: {
                        slotNumbers: ""
                    }
                });
                this.getView().setModel(newAssign, "newAssign");
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
            onSearchHistory: function (oEvent) {
                debugger
                // add filter for search
                // var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filterVehicle = new Filter("vehicleNumber", FilterOperator.Contains, sQuery);
                    var filterSlot = new Filter("historySlotNumber/slotNumbers", FilterOperator.Contains, sQuery);
                    var filterName = new Filter("driverName", FilterOperator.Contains, sQuery);
                    var filterMobile = new Filter("driverMobile", FilterOperator.Contains, sQuery);
                    var filterDelivery = new Filter("deliveryType", FilterOperator.Contains, sQuery);
                    // var filterCheckIn = new Filter("checkInTime", FilterOperator.Contains, sQuery);

                    var allFilter = new Filter([filterVehicle, filterSlot, filterName, filterMobile, filterDelivery]);
                }

                // update list binding
                var oList = this.byId("idHistoryTable");
                var oBinding = oList.getBinding("items");
                oBinding.filter(allFilter);

            },
            // refreshDropdown: function() {
            //     var oModel = this.getView().getModel();
            //     oModel.refresh(true); // Refresh the model to get the latest data
            // },
            onAssignPress: function (oEvent) {
                debugger
                var oThis = this
                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = currentDate.getMonth() + 1; // Months are zero-based
                var day = currentDate.getDate();
                var hours = currentDate.getHours();
                var minutes = currentDate.getMinutes();
                var seconds = currentDate.getSeconds();
                var FinalDate = `${year}-${month}-${day} TIME ${hours}:${minutes}:${seconds}`
                const oUserView = this.getView(),
                    oDriverName = oUserView.byId("idDriverName").getValue(),
                    oDriverMobile = oUserView.byId("idDriverMobile").getValue(),
                    oVehicleNumber = oUserView.byId("idVehicleNUmber").getValue(),
                    oVendorName = oUserView.byId("idVendorName___").getValue(),
                    odeliveryType = oUserView.byId("idTypeOfDelivery").getSelectedKey(),
                    oslotNumber = oUserView.byId("parkingLotSelect").getSelectedKey(),
                    oCheckInTime = FinalDate

                const newAssign = {
                    driverName: oDriverName,
                    driverMobile: oDriverMobile,
                    vehicleNumber: oVehicleNumber,
                    deliveryType: odeliveryType,
                    vendor_Name:oVendorName,
                    slotNumber_ID: oslotNumber,
                    checkInTime: oCheckInTime
                }
                var oModel = this.getView().getModel(),
                    oBindList = oModel.bindList("/assignedSlots");
                // if (!oDriverName || !oDriverMobile || !oVehicleNumber) {

                //     MessageToast.show("Please Enter All Required Fields")
                // } 
                var bValid = true;
                if (!oDriverName || oDriverName.length < 3) {
                    oUserView.byId("idDriverName").setValueState("Error");
                    oUserView.byId("idDriverName").setValueStateText("Name Must Contain 3 Characters");
                    bValid = false;
                } else {
                    oUserView.byId("idDriverName").setValueState("None");
                }
                if (!oDriverMobile || oDriverMobile.length !== 10 || !/^\d+$/.test(oDriverMobile)) {
                    oUserView.byId("idDriverMobile").setValueState("Error");
                    oUserView.byId("idDriverMobile").setValueStateText("Mobile number must be a 10-digit numeric value");

                    bValid = false;
                } else {
                    oUserView.byId("idDriverMobile").setValueState("None");
                }
                if (!oVehicleNumber || !/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(oVehicleNumber)) {
                    oUserView.byId("idVehicleNUmber").setValueState("Error");
                    oUserView.byId("idVehicleNUmber").setValueStateText("Vehicle number should follow this pattern AP12BG1234");

                    bValid = false;
                } else {
                    oUserView.byId("idVehicleNUmber").setValueState("None");
                }
                if (!odeliveryType) {
                    oUserView.byId("idTypeOfDelivery").setValueState("Error");
                    bValid = false;
                } else {
                    oUserView.byId("idTypeOfDelivery").setValueState("None");
                }
                if (!oslotNumber) {
                    oUserView.byId("parkingLotSelect").setValueState("Error");
                    bValid = false;
                } else {
                    oUserView.byId("parkingLotSelect").setValueState("None");
                }

                if (!bValid) {
                    MessageToast.show("Please enter correct data");
                    return; // Prevent further execution

                }
                else {
                    oBindList.create(newAssign);
                    MessageToast.show("allotment successful")
                    this.getView().byId("idAssignedTable").getBinding("items").refresh();
                    this.getView().byId("idDriverName").setValue("");
                    this.getView().byId("idDriverMobile").setValue("");
                    this.getView().byId("idVehicleNUmber").setValue("");
                    this.getView().byId("idVendorName___").setValue("");
                    // this.refreshEntity("/parkingSlots");
                    var oParkingSlotBinding = oModel.bindList("/parkingSlots");

                    oParkingSlotBinding.filter([
                        new Filter("ID", FilterOperator.EQ, oslotNumber)
                    ]);

                    oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
                        if (aParkingContexts.length > 0) {
                            var oParkingContext = aParkingContexts[0];
                            var oParkingData = oParkingContext.getObject();

                            // Update 
                            oParkingData.status = "Not Available"
                            oParkingContext.setProperty("status", oParkingData.status);
                            oModel.submitBatch("updateGroup");
                            // oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                            oModel.refresh(); // Refresh the model to get the latest data

                        } else {
                            MessageToast.show("Slot Unavailable")
                        }
                    })
                }
            },
            onUnassignPress: function (oEvent) {
                debugger;
                const oThis = this
                const oModel = this.getView().getModel()
                var oSelected = this.byId("idAssignedTable").getSelectedItem();
                if (oSelected) {
                    var sVehicle = oSelected.getBindingContext().getObject().vehicleNumber;
                    var sSlotNumber = oSelected.getBindingContext().getObject().slotNumber.slotNumbers;
                    var sDriverName = oSelected.getBindingContext().getObject().driverName
                    var sTypeofDelivery = oSelected.getBindingContext().getObject().deliveryType
                    var sDriverMobile = oSelected.getBindingContext().getObject().driverMobile
                    var dCheckInTime = oSelected.getBindingContext().getObject().checkInTime
                    var oSlotId = oSelected.getBindingContext().getObject().slotNumber_ID
                    var oVendorName = oSelected.getBindingContext().getObject().vendor_Name
                    var currentDate = new Date();
                    var year = currentDate.getFullYear();
                    var month = currentDate.getMonth() + 1; // Months are zero-based
                    var day = currentDate.getDate();
                    var hours = currentDate.getHours();
                    var minutes = currentDate.getMinutes();
                    var seconds = currentDate.getSeconds();
                    var FinalDate = `${year}-${month}-${day} TIME ${hours}:${minutes}:${seconds}`
                    var oCheckOutTime = FinalDate

                    // create a record in history
                    const oNewHistory = {
                        driverName: sDriverName,
                        driverMobile: sDriverMobile,
                        vehicleNumber: sVehicle,
                        deliveryType: sTypeofDelivery,
                        checkInTime: dCheckInTime,
                        historySlotNumber_ID: oSlotId,
                        vendor_Name:oVendorName,
                        checkOutTime: oCheckOutTime
                    }
                    const oBindlist = oModel.bindList("/history")

                    oSelected.getBindingContext().delete("$auto").then(function () {
                        oBindlist.create(oNewHistory)
                        oThis.getView().byId("idHistoryTable").getBinding("items").refresh();
                        var oParkingSlotBinding = oModel.bindList("/parkingSlots");

                        oParkingSlotBinding.filter([
                            new Filter("slotNumbers", FilterOperator.EQ, sSlotNumber)
                        ]);

                        oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
                            if (aParkingContexts.length > 0) {
                                var oParkingContext = aParkingContexts[0];
                                var oParkingData = oParkingContext.getObject();
                                // Update 
                                oParkingData.status = "Available"
                                oParkingContext.setProperty("status", oParkingData.status);
                                oModel.submitBatch("updateGroup");
                                oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                                oModel.refresh(); // Refresh the model to get the latest data


                            } else {
                                MessageToast.show("Slot Unavailable")
                            }
                        })

                        MessageToast.show("Vechicle " + sVehicle + " Unassigned Successfully");

                    },
                        function (oError) {
                            MessageToast.show("Technical Issue Cannot Unassign", oError);
                        });
                    this.getView().byId("idAssignedTable").getBinding("items").refresh();

                } else {
                    MessageToast.show("Please Select a record");
                }
            },
            onConfirmReservePress: async function () {
                if (!this.confirmDialog) {
                    this.confirmDialog = await this.loadFragment("confirmBookings")
                }
                const oSelected = this.getView().byId("idReservationsTable").getSelectedItem(),
                    oSelectedObject = oSelected.getBindingContext().getObject(),
                    oDriverName = oSelectedObject.driverName,
                    oDriverMobile = oSelectedObject.driverMobile,
                    oVehicleNumber = oSelectedObject.vehicleNumber,
                    // oDeliveryType = oSelectedObject.deliveryType,
                    oVendorName = oSelectedObject.vendorName;
                if (oSelected) {
                    this.confirmDialog.open()
                    this.byId("_IDGendfgdInput1").setValue(oDriverName)
                    this.byId("_IDGexgrgnInput2").setValue(oDriverMobile)
                    this.byId("idasgredhmeInput").setValue(oVehicleNumber)
                    // this.byId("_IDGewertnSelect1").setValue(oDeliveryType)
                    this.byId("idasgredhmeIn0075put").setValue(oVendorName)

                } else {
                    MessageToast.show("Select a record to accept bookings")
                }


            },
            onCloseConfirmDialog: function () {
                if (this.confirmDialog.isOpen()) {
                    this.confirmDialog.close()

                }

            },
            onConfirmBookSlotPress: function () {
                debugger
                const oThis = this
                const oDriverName = this.getView().byId("_IDGendfgdInput1").getValue(),
                    oDriverMobile = this.getView().byId("_IDGexgrgnInput2").getValue(),
                    oVehicleNumber = this.getView().byId("idasgredhmeInput").getValue(),
                    oVendorName = this.getView().byId("idasgredhmeIn0075put").getValue(),
                    // oDeliveryType = this.getView().byId("_IDGewertnSelect1").getSelectedKey(),
                    oReservedSlot = this.getView().byId("id123edsqa").getSelectedKey()

                const NewReservedRecord = {

                    driverName: oDriverName,
                    driverMobile: oDriverMobile,
                    vehicleNumber: oVehicleNumber,
                    vendor_Name: oVendorName,
                    // deliveryType: oDeliveryType,
                    reservedSlot_ID: oReservedSlot

                }
                const oModel = this.getView().getModel()
                const oBinding = oModel.bindList("/reserved")
                const newReservation = oBinding.create(NewReservedRecord)
                if (newReservation) {
                    var oSelected = this.byId("idReservationsTable").getSelectedItem();
                    oSelected.getBindingContext().delete("$auto")

                    var oParkingSlotBinding = oModel.bindList("/parkingSlots");

                    oParkingSlotBinding.filter([
                        new Filter("ID", FilterOperator.EQ, oReservedSlot)
                    ]);

                    oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
                        if (aParkingContexts.length > 0) {
                            var oParkingContext = aParkingContexts[0];
                            var oParkingData = oParkingContext.getObject();
                            // Update 
                            oParkingData.status = "Reserved"
                            oParkingContext.setProperty("status", oParkingData.status);
                            oModel.submitBatch("updateGroup");
                            oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                            oModel.refresh(); // Refresh the model to get the latest data

                        } else {
                            MessageToast.show("Slot Unavailable")
                        }
                    })
                }

            },
            onAssignfromReservations: async function () {
                debugger
                if (!this.ConfirmAssignDialog) {
                    this.ConfirmAssignDialog = await this.loadFragment("ConfirmAssign")
                }
                const oSelected = this.getView().byId("idReservedTable__").getSelectedItem(),
                    oObject = oSelected.getBindingContext().getObject(),
                    oDriverName = oObject.driverName,
                    oDriverMobile = oObject.driverMobile,
                    oVehicleNumber = oObject.vehicleNumber,
                    oVendorName = oObject.vendor_Name,
                    oSlot = oObject.reservedSlot.slotNumbers

                if (oSelected) {
                    this.ConfirmAssignDialog.open()
                    this.getView().byId("_IDGen__dfgdInput1").setValue(oDriverName)
                    this.getView().byId("_IDGexgrsdfgnIn__put2").setValue(oDriverMobile)
                    this.getView().byId("afidasgredhmeI__nput").setValue(oVehicleNumber)
                    this.getView().byId("idss__n0075put").setValue(oVendorName)
                    this.getView().byId("_dhmeI__nput").setValue(oSlot)

                }

            },
            onCloseAssignConfirmDialog: function () {
                if (this.ConfirmAssignDialog.isOpen()) {
                    this.ConfirmAssignDialog.close()
                }
            },
            onConfirmAssignSlotPress: function () {
                debugger
                var oThis = this
                const oSelected = this.getView().byId("idReservedTable__").getSelectedItem().getBindingContext().getObject()

                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = currentDate.getMonth() + 1; // Months are zero-based
                var day = currentDate.getDate();
                var hours = currentDate.getHours();
                var minutes = currentDate.getMinutes();
                var seconds = currentDate.getSeconds();
                var FinalDate = `${year}-${month}-${day} TIME ${hours}:${minutes}:${seconds}`
                const oUserView = this.getView(),
                    oDriverName = oUserView.byId("_IDGen__dfgdInput1").getValue(),
                    oDriverMobile = oUserView.byId("_IDGexgrsdfgnIn__put2").getValue(),
                    oVehicleNumber = oUserView.byId("afidasgredhmeI__nput").getValue(),
                    oVendorName = oUserView.byId("idss__n0075put").getValue(),
                    odeliveryType = oUserView.byId("_IDGewertnSelect1").getSelectedKey(),
                    oslotNumber = oUserView.byId("_dhmeI__nput").getValue(),
                    oCheckInTime = FinalDate

                const newAssign = {
                    driverName: oDriverName,
                    driverMobile: oDriverMobile,
                    vehicleNumber: oVehicleNumber,
                    deliveryType: odeliveryType,
                    vendor_Name: oVendorName,
                    slotNumber_ID: oSelected.reservedSlot.ID,
                    checkInTime: oCheckInTime
                }
                var oModel = this.getView().getModel(),
                    oBindList = oModel.bindList("/assignedSlots");
                // if (!oDriverName || !oDriverMobile || !oVehicleNumber) {

                //     MessageToast.show("Please Enter All Required Fields")
                // } 
                var bValid = true;
                if (!oDriverName || oDriverName.length < 3) {
                    oUserView.byId("_IDGen__dfgdInput1").setValueState("Error");
                    oUserView.byId("_IDGen__dfgdInput1").setValueStateText("Name Must Contain 3 Characters");
                    bValid = false;
                } else {
                    oUserView.byId("idDriverName").setValueState("None");
                }
                if (!oDriverMobile || oDriverMobile.length !== 10 || !/^\d+$/.test(oDriverMobile)) {
                    oUserView.byId("_IDGexgrsdfgnIn__put2").setValueState("Error");
                    oUserView.byId("_IDGexgrsdfgnIn__put2").setValueStateText("Mobile number must be a 10-digit numeric value");

                    bValid = false;
                } else {
                    oUserView.byId("_IDGexgrsdfgnIn__put2").setValueState("None");
                }
                if (!oVehicleNumber || !/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(oVehicleNumber)) {
                    oUserView.byId("afidasgredhmeI__nput").setValueState("Error");
                    oUserView.byId("afidasgredhmeI__nput").setValueStateText("Vehicle number should follow this pattern AP12BG1234");

                    bValid = false;
                } else {
                    oUserView.byId("afidasgredhmeI__nput").setValueState("None");
                }
                if (!odeliveryType) {
                    oUserView.byId("_IDGewertnSelect1").setValueState("Error");
                    bValid = false;
                } else {
                    oUserView.byId("_IDGewertnSelect1").setValueState("None");
                }
                if (!oslotNumber) {
                    oUserView.byId("_dhmeI__nput").setValueState("Error");
                    bValid = false;
                } else {
                    oUserView.byId("_dhmeI__nput").setValueState("None");
                }

                if (!bValid) {
                    MessageToast.show("Please enter correct data");
                    return; // Prevent further execution

                }
                else {
                    const newAssignSuccess = oBindList.create(newAssign);
                    if (newAssignSuccess) {
                        MessageToast.show("allotment successful")
                        this.getView().byId("idAssignedTable").getBinding("items").refresh();
                        this.getView().byId("_IDGen__dfgdInput1").setValue("");
                        this.getView().byId("_IDGexgrsdfgnIn__put2").setValue("");
                        this.getView().byId("afidasgredhmeI__nput").setValue("");
                        this.getView().byId("_dhmeI__nput").setValue("");
                        this.getView().byId("idss__n0075put").setValue("");
                        // this.refreshEntity("/parkingSlots");
                        var oParkingSlotBinding = oModel.bindList("/parkingSlots");

                        oParkingSlotBinding.filter([
                            new Filter("slotNumbers", FilterOperator.EQ, oslotNumber)
                        ]);

                        oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
                            if (aParkingContexts.length > 0) {
                                var oParkingContext = aParkingContexts[0];
                                var oParkingData = oParkingContext.getObject();

                                // Update 
                                oParkingData.status = "Not Available"
                                oParkingContext.setProperty("status", oParkingData.status);
                                oModel.submitBatch("updateGroup");
                                // oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                                oModel.refresh(); // Refresh the model to get the latest data

                            } else {
                                MessageToast.show("Slot Unavailable")
                            }
                        })
                    }
                }


            }


        })
    });
