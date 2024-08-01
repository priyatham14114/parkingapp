sap.ui.define([
    "./basecontroller",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../Secrets/Config",
    "sap/ndc/BarcodeScanner",
    "sap/ui/model/odata/v4/ODataModel"

],
    function (Controller, JSONModel, Fragment, Filter, FilterOperator, MessageToast, MessageBox, Config, BarcodeScanner, ODataModel) {
        "use strict";

        return Controller.extend("com.app.parkingapp.controller.HomeView", {
            onInit: function () {

                // var oModel = new ODataModel({
                //     serviceUrl: "/ParkingSrv/",
                //     synchronizationMode: "None"
                // });
                // this.getView().setModel(oModel);

                // // by date slot status updation
                // this.updateSoltsStatusbyDate();


                // // brcode
                // var obj = { name: "subhash", age: 24 };
                // var jsonString = JSON.stringify(obj);
                // this._generateBarcode(jsonString)
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

                // Data Analysis
                // this._setHistoryModel();
                // this._setParkingLotModel();

            },
            onBeforeRendering: function () {
                debugger
                this.updateSoltsStatusbyDate();

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
                    const oModel = this.getView().getModel()
                    oModel.refresh()

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
                    var filterVendor = new Filter("vendor_Name", FilterOperator.Contains, sQuery);

                    var allFilter = new Filter([filterVehicle, filterSlot, filterName, filterMobile, filterDelivery, filterVendor]);
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
                    var filterVendor = new Filter("vendor_Name", FilterOperator.Contains, sQuery);

                    var allFilter = new Filter([filterVehicle, filterSlot, filterName, filterMobile, filterDelivery, filterVendor]);
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
            onAssignPress: async function (oEvent) {
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

                    oAssignedSlotBinding.requestContexts().then(async function (aAssignedContext) {
                        if (aAssignedContext.length > 0) {
                            MessageBox.warning("You can not Assign.A Slot for Vehicle number " + oVehicleNumber + " already assigned")

                        } else {

                            const newSlotAssign = oBindList.create(newAssign)
                            if (newSlotAssign) {
                                // Test

                                const accountSid = Config.twilio.accountSid;
                                const authToken = Config.twilio.authToken;

                                // debugger
                                const toNumber = `+91${oDriverMobile}`
                                const fromNumber = '+15856485867';
                                const messageBody = `Hi ${oDriverName} a Slot number ${sSlotNumber} is alloted to you vehicle number ${oVehicleNumber} \nVendor name: ${oVendorName}. \nThank You,\nVishal Parking Management.`; // Message content

                                // Twilio API endpoint for sending messages
                                const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                                // Send POST request to Twilio API using jQuery.ajax
                                $.ajax({
                                    url: url,
                                    type: 'POST',
                                    async: true,
                                    headers: {
                                        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                                    },
                                    data: {
                                        To: toNumber,
                                        From: fromNumber,
                                        Body: messageBody
                                    },
                                    success: function (data) {
                                        // console.log('SMS sent successfully:', data);
                                        // Handle success, e.g., show a success message
                                        MessageToast.show('if number exists SMS will be sent!');
                                    },
                                    error: function (error) {
                                        // console.error('Error sending SMS:', error);
                                        // Handle error, e.g., show an error message
                                        MessageToast.show('Failed to send SMS: ' + error);
                                    }
                                });

                                // SMS END

                                // Function to make an announcement
                                function makeAnnouncement(message, lang = 'en-US') {
                                    // Check if the browser supports the Web Speech API
                                    if ('speechSynthesis' in window) {
                                        // Create a new instance of SpeechSynthesisUtterance
                                        var utterance = new SpeechSynthesisUtterance(message);

                                        // Set properties (optional)
                                        utterance.pitch = 1; // Range between 0 (lowest) and 2 (highest)
                                        utterance.rate = 0.75;  // Range between 0.1 (lowest) and 10 (highest)
                                        utterance.volume = 1; // Range between 0 (lowest) and 1 (highest)
                                        utterance.lang = lang; // Set the language

                                        // Speak the utterance
                                        debugger
                                        window.speechSynthesis.speak(utterance);
                                    } else {
                                        console.log('Sorry, your browser does not support the Web Speech API.');
                                    }
                                }

                                // Example usage
                                makeAnnouncement(`कृपया ध्यान दें। वाहन नंबर ${oVehicleNumber} को स्लॉट नंबर ${sSlotNumber} द्वारा आवंटित किया गया है।`, 'hi-IN');
                                // makeAnnouncement(`దయచేసి వినండి. వాహనం నంబర్ ${oVehicleNumber} కు స్లాట్ నంబర్ ${sSlotNumber} కేటాయించబడింది.`, 'te-IN');

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
                                // open receipt    
                                // test
                                if (!oThis.ReceiptDailog) {
                                    oThis.ReceiptDailog = await oThis.loadFragment("Receipt")
                                }
                                oThis.ReceiptDailog.open();
                                // barcode generations with value
                                var obj = oVehicleNumber
                                oThis._generateBarcode(obj)
                                oThis.byId("textprint1").setText(oVehicleNumber)
                                oThis.byId("textprint5").setText(sSlotNumber)
                                oThis.byId("textprint2").setText(oDriverName)
                                oThis.byId("textprint3").setText(oDriverMobile)
                                oThis.byId("textprint4").setText(odeliveryType)
                                oThis.byId("dfvtextprint1").setText(`Date: ${year}-${month}-${day} \nTIME: ${hours}:${minutes}:${seconds}`)

                            }
                        }
                    })
                }
            },
            closeReceiptDailog: function () {
                if (this.ReceiptDailog.isOpen()) {
                    this.ReceiptDailog.close()
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

                        // Unassign SMS

                        const accountSid = Config.twilio.accountSid;
                        const authToken = Config.twilio.authToken;

                        // debugger
                        const toNumber = `+91${sDriverMobile}` // Replace with recipient's phone number
                        const fromNumber = '+15856485867'; // Replace with your Twilio phone number
                        const messageBody = `Hi ${sDriverName} please move the vehicle from the parking yard.\nIgnore if already left from the yard.\nThank you,\nVishal Parking Management`; // Message content

                        // Twilio API endpoint for sending messages
                        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                        // Send POST request to Twilio API using jQuery.ajax
                        $.ajax({
                            url: url,
                            type: 'POST',
                            headers: {
                                'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                            },
                            data: {
                                To: toNumber,
                                From: fromNumber,
                                Body: messageBody
                            },
                            success: function (data) {
                                console.log('SMS sent successfully:', data);
                                // Handle success, e.g., show a success message
                                sap.m.MessageToast.show('SMS sent successfully!');
                            },
                            error: function (error) {
                                console.error('Error sending SMS:', error);
                                // Handle error, e.g., show an error message
                                sap.m.MessageToast.show('Failed to send SMS: ' + error);
                            }
                        });

                        // SMS END

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
                                MessageToast.show("Something went wrong")
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

                    // Restrict date
                    debugger
                    var oDatePicker = this.getView().byId("idDatePicker");
                    var oCurrentDate = new Date();
                    oDatePicker.setMinDate(oCurrentDate);

                    var oMaxDate = new Date();
                    oMaxDate.setDate(oMaxDate.getDate() + 7);

                    oDatePicker.setMaxDate(oMaxDate);

                    this.getView().getModel().refresh()

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
                let currentDate = new Date();
                let year = currentDate.getFullYear();
                let month = String(currentDate.getMonth() + 1).padStart(2, '0');
                let day = String(currentDate.getDate()).padStart(2, '0');
                const currentDay = `${year}-${month}-${day}`

                const oThis = this
                const oDriverName = this.getView().byId("_IDGendfgdInput1").getValue(),
                    oDriverMobile = this.getView().byId("_IDGexgrgnInput2").getValue(),
                    oVehicleNumber = this.getView().byId("idasgredhmeInput").getValue(),
                    oVendorName = this.getView().byId("idasgredhmeIn0075put").getValue(),
                    // oDeliveryType = this.getView().byId("_IDGewertnSelect1").getSelectedKey(),
                    oReservedSlot = this.getView().byId("idSlotReserve").getSelectedKey(),
                    oBookedDate = this.getView().byId("idDatePicker").getValue()



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
                    reservedSlot_ID: oReservedSlot,
                    reservedDate: oBookedDate

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
                if (!oBookedDate) {
                    oUserView.byId("idDatePicker").setValueState("Error");
                    oUserView.byId("idDatePicker").setValueStateText("Select Date");
                    bValid = false;
                } else {
                    oUserView.byId("idDatePicker").setValueState("None");
                }

                if (!bValid) {
                    MessageToast.show("Please enter correct data");
                    return; // Prevent further execution

                }
                var oReservedSlotBinding = oModel.bindList("/reserved");

                oReservedSlotBinding.filter([
                    new Filter("reservedSlot_ID", FilterOperator.EQ, oReservedSlot),
                    new Filter("reservedDate", FilterOperator.EQ, oBookedDate)
                ]);

                oReservedSlotBinding.requestContexts().then(function (aReservedContexts) {
                    if (aReservedContexts.length === 0) {

                        const newReservation = oBinding.create(NewReservedRecord)
                        if (newReservation) {
                            // sms code starts here

                            // confirm reservations

                            // SMS 

                            const accountSid = Config.twilio.accountSid;
                            const authToken = Config.twilio.authToken;

                            // debugger
                            const toNumber = `+91${oDriverMobile}` // Replace with recipient's phone number
                            const fromNumber = '+15856485867'; // Replace with your Twilio phone number
                            const messageBody = `Hi ${oDriverName} a Slot number ${sSlotNumber} is reserved on your vehicle number ${oVehicleNumber} \nVendor name: ${oVendorName}. \nThank You,\nVishal Parking Management`; // Message content

                            // Twilio API endpoint for sending messages
                            const APIendpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                            // Send POST request to Twilio API using jQuery.ajax
                            $.ajax({
                                url: APIendpoint,
                                type: 'POST',
                                headers: {
                                    'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                                },
                                data: {
                                    To: toNumber,
                                    From: fromNumber,
                                    Body: messageBody
                                },
                                success: function (data) {
                                    // console.log('SMS sent successfully:', data);
                                    MessageToast.show('SMS sent successfully!');
                                },
                                error: function (error) {
                                    // console.error('Error sending SMS:', error);
                                    MessageToast.show('Failed to send SMS: ' + error);
                                }
                            });

                            // SMS END

                            var oSelected = oThis.byId("idReservationsTable").getSelectedItem();
                            oSelected.getBindingContext().delete("$auto")

                            oThis.byId("_IDGendfgdInput1").setValue("")
                            oThis.byId("_IDGexgrgnInput2").setValue("")
                            oThis.byId("idasgredhmeInput").setValue("")
                            //  this.byId("_IDGewertnSelect1").setValue(oDeliveryType)
                            oThis.byId("idasgredhmeIn0075put").setValue("")

                            oThis.confirmDialog.close()

                            var oParkingSlotBinding = oModel.bindList("/parkingSlots");

                            oParkingSlotBinding.filter([
                                new Filter("ID", FilterOperator.EQ, oReservedSlot)
                            ]);

                            oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
                                if (aParkingContexts.length > 0) {
                                    var oParkingContext = aParkingContexts[0];
                                    var oParkingData = oParkingContext.getObject();
                                    // Update 
                                    if (oBookedDate === currentDay) {
                                        oParkingData.status = "Reserved"
                                        oParkingContext.setProperty("status", oParkingData.status);
                                        oModel.submitBatch("updateGroup");
                                        oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                                        oModel.refresh(); // Refresh the model to get the latest data
                                    }

                                } else {
                                    MessageToast.show("Slot Unavailable")
                                }
                            })
                        }

                    } else {
                        MessageBox.information("Slot Unavailable on selected date")
                    }
                })

            },
            // Updation of slots status based on date
            updateSoltsStatusbyDate: function () {
                debugger
                const oThis = this;
                let currentDate = new Date();
                let year = currentDate.getFullYear();
                let month = String(currentDate.getMonth() + 1).padStart(2, '0');
                let day = String(currentDate.getDate()).padStart(2, '0');
                const currentDay = `${year}-${month}-${day}`;

                const oModel = this.getView().getModel();

                if (!oModel) {
                    MessageToast.show("Model is not defined");
                    return;
                }

                var oreservedSlotBinding = oModel.bindList("/reserved");

                oreservedSlotBinding.requestContexts().then(function (areservedContexts) {
                    debugger
                    if (areservedContexts.length > 0) {
                        areservedContexts.forEach((element) => {
                            var oReservedDate = element.getObject().reservedDate
                            if (oReservedDate === currentDay) {
                                var oReservedSlot = element.getObject().reservedSlot_ID
                                // update slot Status
                                var oreservedSlotBinding = oModel.bindList("/parkingSlots");

                                oreservedSlotBinding.filter([
                                    new Filter("ID", FilterOperator.EQ, oReservedSlot)
                                ]);

                                oreservedSlotBinding.requestContexts().then(function (aParkingContexts) {
                                    if (aParkingContexts.length > 0) {
                                        var oParkingContext = aParkingContexts[0];
                                        var oParkingData = oParkingContext.getObject();
                                        // Update 
                                        oParkingData.status = "Reserved"
                                        oParkingContext.setProperty("status", oParkingData.status);
                                        oModel.submitBatch("updateGroup");
                                        oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                                        MessageToast.show("Refresh Successful")
                                    }
                                })
                            }
                        });

                        this.getView().byId("idAllSlots").getBinding("items").refresh();
                    } else {
                        MessageBox.information("No reserved slots found today");
                    }
                }.bind(this)).catch(function (error) {
                    MessageToast.show("Error while fetching parking slots: " + error.message);
                });
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
                const oBindingContext = this.getView().byId("idReservedTable__").getSelectedItem().getBindingContext(),
                    oBookedDate = oSelected.reservedDate

                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var seconds = String(currentDate.getSeconds()).padStart(2, '0');
                var FinalDate = `${year}-${month}-${day} TIME ${hours}:${minutes}:${seconds}`;
                var currentDate = `${year}-${month}-${day}`

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
                    if (oBookedDate === currentDate) {
                        newAssignSuccess = oBindList.create(newAssign); 

                    } else {
                        MessageBox.information("You can assign current date reservations only");
                    }
                    if (newAssignSuccess) {
                        // function Next() {
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

                        // }
                        // Next() //calling 
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
                const oSelected = this.getView().byId("idReservationsTable").getSelectedItem(),
                    sDriverMobile = oSelected.getBindingContext().getObject().driverMobile,
                    sDriverName = oSelected.getBindingContext().getObject().driverName
                oSelected.getBindingContext().delete("$auto").then(function () {

                    MessageBox.information("Rejected and SMS will be sent")
                    // Unassign SMS

                    const accountSid = Config.twilio.accountSid;
                    const authToken = Config.twilio.authToken;

                    // debugger
                    const toNumber = `+91${sDriverMobile}`
                    const fromNumber = '+15856485867';
                    const messageBody = `Hi ${sDriverName} We regret to inform you that\nCurrently we can not proceed with your reservation.\nThank you,\nVishal Parking Management`; // Message content

                    // Twilio API endpoint for sending messages
                    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                    // Send POST request to Twilio API using jQuery.ajax
                    $.ajax({
                        url: url,
                        type: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                        },
                        data: {
                            To: toNumber,
                            From: fromNumber,
                            Body: messageBody
                        },
                        success: function (data) {
                            sap.m.MessageToast.show('SMS sent successfully!');
                        },
                        error: function (error) {
                            sap.m.MessageToast.show('Failed to send SMS: ' + error);
                        }
                    });
                    // SMS END
                })
                this.confirmRejectDialog.close()

            },
            oncloseDataonDataAnalysis: function () {
                if (this.oDataDialog.isOpen()) {
                    this.oDataDialog.close()
                }

            },


            //  Last change here

            onDataAnalysisPress: async function () {
                debugger
                if (!this.oDataDialog) {
                    this.oDataDialog = await this.loadFragment("DataAnalytics")
                }
                this.oDataDialog.open()
                var oModel = this.getOwnerComponent().getModel();
                var oThis = this;
                oModel.refresh()
                this._setHistoryModel();


                oModel.bindList("/parkingSlots").requestContexts().then(function (aContexts) {
                    var aItems = aContexts.map(function (oContext) {
                        return oContext.getObject();
                    });

                    var availableCount = aItems.filter((item) => item.status === "Available").length;
                    var occupiedCount = aItems.filter((item) => item.status === "Not Available").length;
                    var reservedCount = aItems.filter((item) => item.status === "Reserved").length;

                    var aChartData = {
                        Items: [
                            {
                                status: `Available-${availableCount}`,
                                Count: availableCount,
                            },
                            {
                                status: `Not Available-${occupiedCount}`,
                                Count: occupiedCount,

                            },
                            {
                                status: `Reserved-${reservedCount}`,
                                Count: reservedCount,

                            }
                        ]
                    };

                    var oParkingLotModel = new JSONModel();
                    oParkingLotModel.setData(aChartData);
                    oThis.getView().setModel(oParkingLotModel, "ParkingLotModel");

                }).catch(function (oError) {
                    console.error(oError);
                });
            },
            _setHistoryModel: function () {
                debugger
                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                // Bind the list and request contexts
                oModel.bindList("/history").requestContexts().then(function (aContexts) {
                    // Extract the data from the contexts
                    var aItems = aContexts.map(function (oContext) {
                        return oContext.getObject();
                    });

                    // Process the data
                    var oProcessedData = that._processHistoryData(aItems);

                    // Set the processed data to a JSON model and set it to the view
                    var oHistoryModel = new sap.ui.model.json.JSONModel();
                    oHistoryModel.setData(oProcessedData);
                    that.getView().setModel(oHistoryModel, "HistoryModel");
                }).catch(function (oError) {
                    console.error(oError);
                });
            },

            _processHistoryData: function (aItems) {
                var oData = {};

                aItems.forEach(function (item) {
                    var dateTimeParts = item.checkInTime.split(" TIME "); // Split the string to separate date and time
                    var date = new Date(dateTimeParts[0]);

                    // Extract date part in local time
                    var year = date.getFullYear();
                    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
                    var day = date.getDate().toString().padStart(2, '0');
                    var formattedDate = `${year}-${month}-${day}`;

                    if (!oData[formattedDate]) {
                        oData[formattedDate] = {
                            date: formattedDate,
                            inwardCount: 0,
                            outwardCount: 0,
                            totalEntries: 0
                        };
                    }

                    if (item.deliveryType === "InBound") {
                        oData[formattedDate].inwardCount += 1;
                    } else if (item.deliveryType === "OutBound") {
                        oData[formattedDate].outwardCount += 1;
                    }

                    oData[formattedDate].totalEntries = oData[formattedDate].inwardCount + oData[formattedDate].outwardCount;
                });

                return {
                    Items: Object.values(oData)
                };
            },
            _generateBarcode: function (barcodeValue) {
                // Get the HTML control where the barcode will be rendered
                var oHtmlControl = this.byId("barcodeContainer");

                if (oHtmlControl) {
                    // Set the HTML content to an SVG element
                    oHtmlControl.setContent('<svg id="barcode" ></svg>');

                    // Ensure the content is fully rendered before using JsBarcode
                    setTimeout(function () {
                        // Generate the barcode using JsBarcode
                        JsBarcode("#barcode", barcodeValue, {
                            // format: "EAN:", // Barcode format
                            // lineColor: "#0aa", // Line color
                            // width: 20, // Width of each bar
                            // height: 100, // Height of the barcode
                            displayValue: false // Hide the value
                        });
                    }, 0); // Delay to ensure the SVG element is rendered
                } else {
                    console.error("HTML control not found or not initialized.");
                }
            },
            onPrint: function () {
                var oView = this.getView();
                var oElement = oView.byId("idSimpleForm");

                var oDomRef = oElement.getDomRef();

                // Check if domtoimage is available
                if (typeof domtoimage === 'undefined') {
                    console.error('domtoimage library is not loaded.');
                    return;
                }

                // Convert the element to PNG image
                domtoimage.toPng(oDomRef).then(function (dataUrl) {
                    // Create a new PDF document
                    var doc = new jsPDF({
                        orientation: 'landscape',
                    });

                    // Add image to the PDF
                    doc.addImage(dataUrl, 'JPEG', 25, 25, 250, 150);

                    // Save the PDF to a Blob
                    var pdfBlob = doc.output('blob');

                    // Create an URL for the Blob
                    var pdfUrl = URL.createObjectURL(pdfBlob);

                    // Open the PDF in a new window for printing
                    var printWindow = window.open(pdfUrl, '_blank');

                    // Ensure the new window is loaded before calling print
                    printWindow.onload = function () {
                        printWindow.print();
                    };
                })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });
                // var oVBox = this.byId("idSimpleForm");
                // if (!oVBox) {
                //     console.error("VBox with ID 'idSimpleForm' not found.");
                //     return;
                // }

                // // Get the HTML content of the VBox
                // var sHtml = oVBox.getDomRef().innerHTML;

                // // Create a new window for print
                // var oPrintWindow = window.open('', '', 'height=600,width=800');
                // oPrintWindow.document.open();
                // oPrintWindow.document.write(`
                //     <html>
                //     <head>
                //         <title>Print</title>
                //         <style>
                //             body { font-family: Arial, sans-serif; }
                //             .print-container { width: 100%; margin: 0 auto; }
                //             /* Add any additional print styles here */
                //         </style>
                //     </head>
                //     <body>
                //         <div class="print-container">
                //             ${sHtml}
                //         </div>
                //     </body>
                //     </html>
                // `);
                // oPrintWindow.document.close();
                // oPrintWindow.focus();
                // oPrintWindow.print();

            },

            onScanPress: function (oEvent) {
                debugger
                const oThis = this;
                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = currentDate.getMonth() + 1; // Months are zero-based
                var day = currentDate.getDate();
                var hours = currentDate.getHours();
                var minutes = currentDate.getMinutes();
                var seconds = currentDate.getSeconds();
                var FinalDate = `${year}-${month}-${day} TIME ${hours}:${minutes}:${seconds}`
                var oCheckOutTime = FinalDate
                const oModel = this.getView().getModel()
                BarcodeScanner.scan(
                    function (mResult) {
                        if (mResult && mResult.text) {
                            var scannedText = mResult.text;

                            var oAssignedSlotsBinding = oModel.bindList("/assignedSlots");

                            oAssignedSlotsBinding.filter([
                                new Filter("vehicleNumber", FilterOperator.EQ, scannedText)
                            ]);

                            oAssignedSlotsBinding.requestContexts().then(function (aAssignedContexts) {
                                if (aAssignedContexts.length > 0) {
                                    var oAssignedContext = aAssignedContexts[0];
                                    var oAssignedDataObject = oAssignedContext.getObject(),
                                        sVehicle = oAssignedDataObject.vehicleNumber,
                                        sDriverName = oAssignedDataObject.driverName,
                                        sTypeofDelivery = oAssignedDataObject.deliveryType,
                                        sDriverMobile = oAssignedDataObject.driverMobile,
                                        dCheckInTime = oAssignedDataObject.checkInTime,
                                        oSlotId = oAssignedDataObject.slotNumber_ID,
                                        oVendorName = oAssignedDataObject.vendor_Name;
                                    //  payload for history
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
                                    // Remove the object
                                    oAssignedContext.delete().then(function () {
                                        MessageBox.success(`${sVehicle} UnAssigned successfully`);
                                        // send SMS
                                        // Unassign SMS

                                        const accountSid = Config.twilio.accountSid;
                                        const authToken = Config.twilio.authToken;

                                        // debugger
                                        const toNumber = `+91${sDriverMobile}`
                                        const fromNumber = '+15856485867';
                                        const messageBody = `Hi ${sDriverName} please move the vehicle from the parking yard.\nIgnore if already left from the yard.\nThank you,\nVishal Parking Management`; // Message content

                                        // Twilio API endpoint for sending messages
                                        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                                        // Send POST request to Twilio API using jQuery.ajax
                                        $.ajax({
                                            url: url,
                                            type: 'POST',
                                            headers: {
                                                'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                                            },
                                            data: {
                                                To: toNumber,
                                                From: fromNumber,
                                                Body: messageBody
                                            },
                                            success: function (data) {
                                                sap.m.MessageToast.show('SMS sent successfully!');
                                            },
                                            error: function (error) {
                                                sap.m.MessageToast.show('Failed to send SMS: ' + error);
                                            }
                                        });

                                        // SMS END
                                        // history creation..
                                        oBindlist.create(oNewHistory)
                                        // update slot
                                        var oParkingSlotBinding = oModel.bindList("/parkingSlots");

                                        oParkingSlotBinding.filter([
                                            new Filter("ID", FilterOperator.EQ, oSlotId)
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
                                                oModel.refresh();
                                            } else {
                                                MessageToast.show("Slot Unavailable")
                                            }
                                        })
                                    }).catch(function (oError) {
                                        MessageBox.error("Deletion failed: " + oError.message);
                                    });
                                } else {
                                    MessageBox.information(`Vehicle number ${scannedText} dose not exist in our records`)
                                }
                            })

                        } else {
                            MessageBox.error("Barcode scan failed or no result.");
                        }
                    }.bind(this), // Bind 'this' context to access the view
                    function (oError) {
                        MessageBox.error("Barcode scanning failed: " + oError);
                    }
                );
            },


        })
    });




// last push