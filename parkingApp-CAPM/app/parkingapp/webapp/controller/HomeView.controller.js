sap.ui.define([
    "./basecontroller",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"

],
    function (Controller, JSONModel, Fragment, Filter, FilterOperator, MessageToast, MessageBox) {
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

                var oViewModel = new JSONModel({
                    editable: false
                });
                this.getView().setModel(oViewModel, "view");
            },
            onEditPress: function () {
                debugger
                var oTable = this.byId("idAssignedTable");
                var aSelectedItem = oTable.getSelectedItem()

                if (!aSelectedItem) {
                    MessageToast.show("Please select record to edit.");
                    return;
                }
                const oObject = aSelectedItem.getBindingContext().getObject(),
                    oOldSlotNum = oObject.slotNumber.slotNumbers
                aSelectedItem.getCells()[5].getItems()[0].setVisible(false)
                aSelectedItem.getCells()[5].getItems()[1].setVisible(true)

                this.byId("idBtnEdit").setVisible(false);
                this.byId("idBtnSave").setVisible(true);
                this.byId("idBtnCancel").setVisible(true);
                this.byId("idBtUnassign").setVisible(false);



            },
            onSavePress: function () {
                debugger
                const oThis = this
                var oTable = this.byId("idAssignedTable");
                var oSelectedItem = oTable.getSelectedItem(),
                    oObject = oSelectedItem.getBindingContext().getObject()

                var oModel = this.getView().getModel()

                oSelectedItem.getCells()[5].getItems()[0].setVisible(true)
                oSelectedItem.getCells()[5].getItems()[1].setVisible(false)
                var oOldSlotNumer = oSelectedItem.getCells()[5].getItems()[0].getText()
                var oNewSlotNumer_ID = oSelectedItem.getCells()[5].getItems()[1].getSelectedKey()

                var oAssignedSlotBinding = oModel.bindList("/assignedSlots");

                oAssignedSlotBinding.filter([
                    new Filter("slotNumber/slotNumbers", FilterOperator.EQ, oOldSlotNumer)
                ]);

                const SlotUpdate = oAssignedSlotBinding.requestContexts().then(function (aAssignedContext) {
                    if (aAssignedContext.length > 0) {
                        var oAssignedContext = aAssignedContext[0];
                        var oAssignedData = oAssignedContext.getObject();
                        // Update 
                        oAssignedData.slotNumber = oNewSlotNumer_ID
                        oAssignedContext.setProperty("slotNumber_ID", oAssignedData.slotNumber);
                        oModel.submitBatch("updateGroup");
                        oModel.refresh(); // Refresh the model to get the latest data

                    }
                })

//  
                var oParkingSlotBinding = oModel.bindList("/parkingSlots")

                oParkingSlotBinding.filter([
                    new Filter("ID", FilterOperator.EQ, oNewSlotNumer_ID)
                ]);

                const oNewStatusUpdate = oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
                    if (aParkingContexts.length > 0) {
                        var oParkingContext = aParkingContexts[0];
                        var oParkingData = oParkingContext.getObject();
                        // Update 
                        oParkingData.status = "Not Available"
                        oParkingContext.setProperty("status", oParkingData.status);
                        oModel.submitBatch("updateGroup");
                        oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                        oModel.refresh(); // Refresh the model to get the latest data

                    } else {
                        MessageToast.show("Something went wrong")
                    }
                })

                var oParkingSlotBinding = oModel.bindList("/parkingSlots");

                oParkingSlotBinding.filter([
                    new Filter("slotNumbers", FilterOperator.EQ, oOldSlotNumer)
                ]);

                const oOldStatusUpdate = oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
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
                        MessageToast.show("Something went wrong")
                    }
                })

                this.byId("idBtnSave").setVisible(false);
                this.byId("idBtnEdit").setVisible(true);
                this.byId("idBtnCancel").setVisible(false);
                this.byId("idBtUnassign").setVisible(true);
            },

            onCanclePress: function () {
                var oTable = this.byId("idAssignedTable");
                var aSelectedItem = oTable.getSelectedItems();

                aSelectedItem.forEach(function (oItem) {
                    var aCells = oItem.getCells();
                    aCells.forEach(function (oCell) {
                        if (oCell.getId().includes("idinTablevbox")) {
                            var aVBoxItems = oCell.getItems();
                            aVBoxItems[0].setVisible(true); // Hide Text
                            aVBoxItems[1].setVisible(false); // Show 
                        }
                    });
                });

                this.byId("idBtnEdit").setVisible(true);
                this.byId("idBtnSave").setVisible(false);
                this.byId("idBtnCancel").setVisible(false);
                this.byId("idBtUnassign").setVisible(true);

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
                    var filterSlot = new Filter("slotNumber/slotNumbers", FilterOperator.Contains, sQuery)

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
                // 
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

                var oSelect = this.byId("parkingLotSelect");
                var oSelectedItem = oSelect.getSelectedItem();

                if (oSelectedItem) {
                    var sSlotNumber = oSelectedItem.getText();

                }

                const newAssign = {
                    driverName: oDriverName,
                    driverMobile: oDriverMobile,
                    vehicleNumber: oVehicleNumber,
                    deliveryType: odeliveryType,
                    vendor_Name: oVendorName,
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
                if (!odeliveryType || odeliveryType === "Select") {
                    oUserView.byId("idTypeOfDelivery").setValueState("Error");
                    oUserView.byId("idTypeOfDelivery").setValueStateText("Please select atleast one option below");

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
                if (!oVendorName || oVendorName.length < 3) {
                    oUserView.byId("idVendorName___").setValueState("Error");
                    oUserView.byId("idVendorName___").setValueStateText("Vendor Name Must Contain 3 Characters");
                    bValid = false;
                } else {
                    oUserView.byId("idVendorName___").setValueState("None");
                }

                if (!bValid) {
                    MessageToast.show("Please enter correct data");
                    return; // Prevent further execution

                }
                else {
                    var oAssignedSlotBinding = oModel.bindList("/assignedSlots");

                    oAssignedSlotBinding.filter([
                        new Filter("vehicleNumber", FilterOperator.EQ, oVehicleNumber)
                    ]);

                    oAssignedSlotBinding.requestContexts().then(function (aAssignedContext) {
                        if (aAssignedContext.length > 0) {
                            MessageBox.warning("You can not Assign.A Slot for Vehicle number " + oVehicleNumber + " already assigned")

                        } else {

                            const newSlotAssign = oBindList.create(newAssign)
                            if (newSlotAssign) {
                                // Test

                        // Add sms code here

                                // Function to make an announcement
                                function makeAnnouncement(message, lang = 'en-US') {
                                    // Check if the browser supports the Web Speech API
                                    if ('speechSynthesis' in window) {
                                        // Create a new instance of SpeechSynthesisUtterance
                                        var utterance = new SpeechSynthesisUtterance(message);

                                        // Set properties (optional)
                                        utterance.pitch = 1; // Range between 0 (lowest) and 2 (highest)
                                        utterance.rate = 0.77;  // Range between 0.1 (lowest) and 10 (highest)
                                        utterance.volume = 1; // Range between 0 (lowest) and 1 (highest)
                                        utterance.lang = lang; // Set the language

                                        // Speak the utterance
                                        window.speechSynthesis.speak(utterance);
                                    } else {
                                        console.log('Sorry, your browser does not support the Web Speech API.');
                                    }
                                }

                                // Example usage
                                makeAnnouncement(`कृपया ध्यान दें। वाहन नंबर ${oVehicleNumber} को स्लॉट नंबर ${sSlotNumber} द्वारा आवंटित किया गया है।`, 'hi-IN');


                                // Lorry Animation
                                var oImage = oThis.byId("movingImage");
                                oImage.setVisible(true);
                                oImage.addStyleClass("animate");
                                setTimeout(function () {
                                    oImage.setVisible(false);
                                }, 7000);

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
                                        oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                                        oModel.refresh(); // Refresh the model to get the latest data

                                        oThis.getView().byId("idDriverName").setValue("")
                                        oThis.getView().byId("idDriverMobile").setValue("")
                                        oThis.getView().byId("idVehicleNUmber").setValue("")
                                        oThis.getView().byId("idTypeOfDelivery").setValue("Select")
                                        oThis.getView().byId("idVendorName___").setValue("")

                                        // add validation for existing vehicle



                                    } else {
                                        MessageToast.show("Slot Unavailable")
                                    }
                                })

                            }
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
                        vendor_Name: oVendorName,
                        checkOutTime: oCheckOutTime
                    }
                    const oBindlist = oModel.bindList("/history")

                    oSelected.getBindingContext().delete("$auto").then(function () {

                        // Add sms code here

                        var oImage = oThis.byId("movingImage2");
                        oImage.setVisible(true);
                        oImage.addStyleClass("animate");
                        setTimeout(function () {
                            oImage.setVisible(false);
                        }, 7000);

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
                                oModel.refresh(); // Refresh the model to get the latest 


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
                debugger
                if (!this.confirmDialog) {
                    this.confirmDialog = await this.loadFragment("confirmBookings")
                }
                const oSelected = this.getView().byId("idReservationsTable").getSelectedItem()
                if (oSelected) {

                    const oSelectedObject = oSelected.getBindingContext().getObject(),
                        oDriverName = oSelectedObject.driverName,
                        oDriverMobile = oSelectedObject.driverMobile,
                        oVehicleNumber = oSelectedObject.vehicleNumber,
                        // oDeliveryType = oSelectedObject.deliveryType,
                        oVendorName = oSelectedObject.vendorName;
                    this.confirmDialog.open()
                    this.byId("_IDGendfgdInput1").setValue(oDriverName)
                    this.byId("_IDGexgrgnInput2").setValue(oDriverMobile)
                    this.byId("idasgredhmeInput").setValue(oVehicleNumber)
                    // this.byId("_IDGewertnSelect1").setValue(oDeliveryType)
                    this.byId("idasgredhmeIn0075put").setValue(oVendorName)

                } else {
                    MessageToast.show("Select a record to accept reservations")
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
                    oReservedSlot = this.getView().byId("idSlotReserve").getSelectedKey()

                var oSelect = this.byId("idSlotReserve");
                var oSelectedItem = oSelect.getSelectedItem();

                if (oSelectedItem) {
                    var sSlotNumber = oSelectedItem.getText();

                }

                const NewReservedRecord = {

                    driverName: oDriverName,
                    driverMobile: oDriverMobile,
                    vehicleNumber: oVehicleNumber,
                    vendor_Name: oVendorName,
                    // deliveryType: oDeliveryType,
                    reservedSlot_ID: oReservedSlot

                }
                const oModel = this.getView().getModel(),
                    oUserView = this.getView()
                const oBinding = oModel.bindList("/reserved")

                var bValid = true;
                if (!oDriverName || oDriverName.length < 3) {
                    oUserView.byId("_IDGendfgdInput1").setValueState("Error");
                    oUserView.byId("_IDGendfgdInput1").setValueStateText("Name Must Contain 3 Characters");
                    bValid = false;
                } else {
                    oUserView.byId("_IDGendfgdInput1").setValueState("None");
                }
                if (!oDriverMobile || oDriverMobile.length !== 10 || !/^\d+$/.test(oDriverMobile)) {
                    oUserView.byId("_IDGexgrgnInput2").setValueState("Error");
                    oUserView.byId("_IDGexgrgnInput2").setValueStateText("Mobile number must be a 10-digit numeric value");

                    bValid = false;
                } else {
                    oUserView.byId("_IDGexgrgnInput2").setValueState("None");
                }
                if (!oVehicleNumber || !/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(oVehicleNumber)) {
                    oUserView.byId("idasgredhmeInput").setValueState("Error");
                    oUserView.byId("idasgredhmeInput").setValueStateText("Vehicle number should follow this pattern AP12BG1234");

                    bValid = false;
                } else {
                    oUserView.byId("idasgredhmeInput").setValueState("None");
                }
                if (!oVendorName || oVendorName.length < 3) {
                    oUserView.byId("idasgredhmeIn0075put").setValueState("Error");
                    oUserView.byId("idasgredhmeIn0075put").setValueStateText("Vendor Name Must Contain 3 Characters");
                    bValid = false;
                } else {
                    oUserView.byId("idasgredhmeIn0075put").setValueState("None");
                }

                if (!bValid) {
                    MessageToast.show("Please enter correct data");
                    return; // Prevent further execution

                }


                const newReservation = oBinding.create(NewReservedRecord)
                if (newReservation) {
                    // sms code strts here

                    var oSelected = this.byId("idReservationsTable").getSelectedItem();
                    oSelected.getBindingContext().delete("$auto")

                    this.byId("_IDGendfgdInput1").setValue("")
                    this.byId("_IDGexgrgnInput2").setValue("")
                    this.byId("idasgredhmeInput").setValue("")
                    //  this.byId("_IDGewertnSelect1").setValue(oDeliveryType)
                    this.byId("idasgredhmeIn0075put").setValue("")

                    this.confirmDialog.close()

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
                const oBindingContext = this.getView().byId("idReservedTable__").getSelectedItem().getBindingContext()

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
                    oUserView.byId("_IDGen__dfgdInput1").setValueState("None");
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
                if (!oVendorName || oVendorName.length < 3) {
                    oUserView.byId("idss__n0075put").setValueState("Error");
                    oUserView.byId("idss__n0075put").setValueStateText("Vendor Name Must Contain 3 Characters");
                    bValid = false;
                } else {
                    oUserView.byId("idss__n0075put").setValueState("None");
                }
                if (!odeliveryType || odeliveryType === "Select") {
                    ;
                    oUserView.byId("_IDGewertnSelect1").setValueState("Error")
                    oUserView.byId("_IDGewertnSelect1").setValueStateText("Please select atleast one option");

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
                        this.ConfirmAssignDialog.close()

                        // Remove current record from the current table
                        oBindingContext.delete("$auto").then(function () {

                            // Update Parking Slot Status
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
                        })
                    }
                }

            },
            onRejectPress: async function () {
                const oSelected = this.getView().byId("idReservationsTable").getSelectedItem()

                if (oSelected) {
                    if (!this.confirmRejectDialog) {
                        this.confirmRejectDialog = await this.loadFragment("RejectConfirmation")
                    }
                    this.confirmRejectDialog.open()

                } else {
                    MessageBox.information("Select one record to continue")
                }

            },
            onRejectCloseConfirmDialog: function () {

                if (this.confirmRejectDialog.isOpen()) {
                    this.confirmRejectDialog.close()
                }
            },
            onRejectReservePress: function () {
                debugger
                const oSelected = this.getView().byId("idReservationsTable").getSelectedItem()
                oSelected.getBindingContext().delete("$auto").then(function () {
                    MessageToast.show("Rejected")


                })
                this.confirmRejectDialog.close()


            },



        })
    });

    // last push