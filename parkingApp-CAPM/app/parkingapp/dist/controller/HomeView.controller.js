sap.ui.define(["./basecontroller","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(e,t,s,i,n,a,r){"use strict";return e.extend("com.app.parkingapp.controller.HomeView",{onInit:function(){const e=new t({driverName:"",driverMobile:"",vehicleNumber:"",deliveryType:"",checkInTime:"",slotNumber:{slotNumbers:""}});this.getView().setModel(e,"newAssign");var s=new t({editable:false});this.getView().setModel(s,"view")},onEditPress:function(){debugger;var e=this.byId("idAssignedTable");var t=e.getSelectedItem();if(!t){a.show("Please select an item to edit.");return}const s=t.getBindingContext().getObject(),i=s.slotNumber.slotNumbers;t.getCells()[5].getItems()[0].setVisible(false);t.getCells()[5].getItems()[1].setVisible(true);this.byId("idBtnEdit").setVisible(false);this.byId("idBtnSave").setVisible(true);this.byId("idBtnCancel").setVisible(true);this.byId("idBtUnassign").setVisible(false)},onSavePress:function(){debugger;const e=this;var t=this.byId("idAssignedTable");var s=t.getSelectedItem(),r=s.getBindingContext().getObject();var l=this.getView().getModel();s.getCells()[5].getItems()[0].setVisible(true);s.getCells()[5].getItems()[1].setVisible(false);var o=s.getCells()[5].getItems()[0].getText();var d=s.getCells()[5].getItems()[1].getSelectedKey();var g=l.bindList("/assignedSlots");g.filter([new i("slotNumber/slotNumbers",n.EQ,o)]);const u=g.requestContexts().then(function(e){if(e.length>0){var t=e[0];var s=t.getObject();s.slotNumber=d;t.setProperty("slotNumber_ID",s.slotNumber);l.submitBatch("updateGroup");l.refresh()}});var b=l.bindList("/parkingSlots");b.filter([new i("ID",n.EQ,d)]);const c=b.requestContexts().then(function(t){if(t.length>0){var s=t[0];var i=s.getObject();i.status="Not Available";s.setProperty("status",i.status);l.submitBatch("updateGroup");e.getView().byId("idAllSlots").getBinding("items").refresh();l.refresh()}else{a.show("Something went wrong")}});var b=l.bindList("/parkingSlots");b.filter([new i("slotNumbers",n.EQ,o)]);const h=b.requestContexts().then(function(t){if(t.length>0){var s=t[0];var i=s.getObject();i.status="Available";s.setProperty("status",i.status);l.submitBatch("updateGroup");e.getView().byId("idAllSlots").getBinding("items").refresh();l.refresh()}else{a.show("Something went wrong")}});this.byId("idBtnSave").setVisible(false);this.byId("idBtnEdit").setVisible(true);this.byId("idBtnCancel").setVisible(false);this.byId("idBtUnassign").setVisible(true)},onCanclePress:function(){var e=this.byId("idAssignedTable");var t=e.getSelectedItems();t.forEach(function(e){var t=e.getCells();t.forEach(function(e){if(e.getId().includes("idinTablevbox")){var t=e.getItems();t[0].setVisible(true);t[1].setVisible(false)}})});this.byId("idBtnEdit").setVisible(true);this.byId("idBtnSave").setVisible(false);this.byId("idBtnCancel").setVisible(false);this.byId("idBtUnassign").setVisible(true)},onReservationsPress:async function(){debugger;if(!this.Reservationspopup){this.Reservationspopup=await this.loadFragment("Reservations")}this.Reservationspopup.open()},onCloseReservations:function(){if(this.Reservationspopup.isOpen()){this.Reservationspopup.close()}},onSearch:function(e){debugger;var t=[];var s=e.getSource().getValue();if(s&&s.length>0){var a=new i("vehicleNumber",n.Contains,s);var r=new i("slotNumber/slotNumbers",n.Contains,s);var l=new i("driverName",n.Contains,s);var o=new i("driverMobile",n.Contains,s);var d=new i("deliveryType",n.Contains,s);var g=new i([a,r,l,o,d])}var u=this.byId("idAssignedTable");var b=u.getBinding("items");b.filter(g)},onSearchHistory:function(e){debugger;var t=e.getSource().getValue();if(t&&t.length>0){var s=new i("vehicleNumber",n.Contains,t);var a=new i("historySlotNumber/slotNumbers",n.Contains,t);var r=new i("driverName",n.Contains,t);var l=new i("driverMobile",n.Contains,t);var o=new i("deliveryType",n.Contains,t);var d=new i([s,a,r,l,o])}var g=this.byId("idHistoryTable");var u=g.getBinding("items");u.filter(d)},onAssignPress:function(e){debugger;var t=this;var s=new Date;var l=s.getFullYear();var o=s.getMonth()+1;var d=s.getDate();var g=s.getHours();var u=s.getMinutes();var b=s.getSeconds();var c=`${l}-${o}-${d} TIME ${g}:${u}:${b}`;const h=this.getView(),I=h.byId("idDriverName").getValue(),f=h.byId("idDriverMobile").getValue(),m=h.byId("idVehicleNUmber").getValue(),v=h.byId("idVendorName___").getValue(),y=h.byId("idTypeOfDelivery").getSelectedKey(),V=h.byId("parkingLotSelect").getSelectedKey(),p=c;var S=this.byId("parkingLotSelect");var _=S.getSelectedItem();if(_){var w=_.getText()}const N={driverName:I,driverMobile:f,vehicleNumber:m,deliveryType:y,vendor_Name:v,slotNumber_ID:V,checkInTime:p};var D=this.getView().getModel(),C=D.bindList("/assignedSlots");var T=true;if(!I||I.length<3){h.byId("idDriverName").setValueState("Error");h.byId("idDriverName").setValueStateText("Name Must Contain 3 Characters");T=false}else{h.byId("idDriverName").setValueState("None")}if(!f||f.length!==10||!/^\d+$/.test(f)){h.byId("idDriverMobile").setValueState("Error");h.byId("idDriverMobile").setValueStateText("Mobile number must be a 10-digit numeric value");T=false}else{h.byId("idDriverMobile").setValueState("None")}if(!m||!/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(m)){h.byId("idVehicleNUmber").setValueState("Error");h.byId("idVehicleNUmber").setValueStateText("Vehicle number should follow this pattern AP12BG1234");T=false}else{h.byId("idVehicleNUmber").setValueState("None")}if(!y||y==="Select"){h.byId("idTypeOfDelivery").setValueState("Error");h.byId("idTypeOfDelivery").setValueStateText("Please select atleast one option below");T=false}else{h.byId("idTypeOfDelivery").setValueState("None")}if(!V){h.byId("parkingLotSelect").setValueState("Error");T=false}else{h.byId("parkingLotSelect").setValueState("None")}if(!v||v.length<3){h.byId("idVendorName___").setValueState("Error");h.byId("idVendorName___").setValueStateText("Vendor Name Must Contain 3 Characters");T=false}else{h.byId("idVendorName___").setValueState("None")}if(!T){a.show("Please enter correct data");return}else{var x=D.bindList("/assignedSlots");x.filter([new i("vehicleNumber",n.EQ,m)]);x.requestContexts().then(function(e){if(e.length>0){r.warning("You can not Assign.A Slot for Vehicle number "+m+" already assigned")}else{const g=C.create(N);if(g){var s="+918886725925";var l="Hi subhash from subhash";$.ajax({url:"/send-sms",method:"POST",contentType:"application/json",data:JSON.stringify({to:s,message:l}),success:function(e){a.show("SMS sent successfully! Message SID: "+e.sid)},error:function(e){a.show("Failed to send SMS")}});function u(e,t="en-US"){if("speechSynthesis"in window){var s=new SpeechSynthesisUtterance(e);s.pitch=1;s.rate=.77;s.volume=1;s.lang=t;window.speechSynthesis.speak(s)}else{console.log("Sorry, your browser does not support the Web Speech API.")}}u(`कृपया ध्यान दें। वाहन नंबर ${m} को स्लॉट नंबर ${w} द्वारा आवंटित किया गया है।`,"hi-IN");var o=t.byId("movingImage");o.setVisible(true);o.addStyleClass("animate");setTimeout(function(){o.setVisible(false)},7e3);var d=D.bindList("/parkingSlots");d.filter([new i("ID",n.EQ,V)]);d.requestContexts().then(function(e){if(e.length>0){var s=e[0];var i=s.getObject();i.status="Not Available";s.setProperty("status",i.status);D.submitBatch("updateGroup");t.getView().byId("idAllSlots").getBinding("items").refresh();D.refresh();t.getView().byId("idDriverName").setValue("");t.getView().byId("idDriverMobile").setValue("");t.getView().byId("idVehicleNUmber").setValue("");t.getView().byId("idTypeOfDelivery").setValue("Select");t.getView().byId("idVendorName___").setValue("")}else{a.show("Slot Unavailable")}})}}})}},onUnassignPress:function(e){debugger;const t=this;const s=this.getView().getModel();var r=this.byId("idAssignedTable").getSelectedItem();if(r){var l=r.getBindingContext().getObject().vehicleNumber;var o=r.getBindingContext().getObject().slotNumber.slotNumbers;var d=r.getBindingContext().getObject().driverName;var g=r.getBindingContext().getObject().deliveryType;var u=r.getBindingContext().getObject().driverMobile;var b=r.getBindingContext().getObject().checkInTime;var c=r.getBindingContext().getObject().slotNumber_ID;var h=r.getBindingContext().getObject().vendor_Name;var I=new Date;var f=I.getFullYear();var m=I.getMonth()+1;var v=I.getDate();var y=I.getHours();var V=I.getMinutes();var p=I.getSeconds();var S=`${f}-${m}-${v} TIME ${y}:${V}:${p}`;var _=S;const e={driverName:d,driverMobile:u,vehicleNumber:l,deliveryType:g,checkInTime:b,historySlotNumber_ID:c,vendor_Name:h,checkOutTime:_};const w=s.bindList("/history");r.getBindingContext().delete("$auto").then(function(){var r=t.byId("movingImage2");r.setVisible(true);r.addStyleClass("animate");setTimeout(function(){r.setVisible(false)},7e3);w.create(e);t.getView().byId("idHistoryTable").getBinding("items").refresh();var d=s.bindList("/parkingSlots");d.filter([new i("slotNumbers",n.EQ,o)]);d.requestContexts().then(function(e){if(e.length>0){var i=e[0];var n=i.getObject();n.status="Available";i.setProperty("status",n.status);s.submitBatch("updateGroup");t.getView().byId("idAllSlots").getBinding("items").refresh();s.refresh()}else{a.show("Slot Unavailable")}});a.show("Vechicle "+l+" Unassigned Successfully")},function(e){a.show("Technical Issue Cannot Unassign",e)});this.getView().byId("idAssignedTable").getBinding("items").refresh()}else{a.show("Please Select a record")}},onConfirmReservePress:async function(){debugger;if(!this.confirmDialog){this.confirmDialog=await this.loadFragment("confirmBookings")}const e=this.getView().byId("idReservationsTable").getSelectedItem();if(e){const t=e.getBindingContext().getObject(),s=t.driverName,i=t.driverMobile,n=t.vehicleNumber,a=t.vendorName;this.confirmDialog.open();this.byId("_IDGendfgdInput1").setValue(s);this.byId("_IDGexgrgnInput2").setValue(i);this.byId("idasgredhmeInput").setValue(n);this.byId("idasgredhmeIn0075put").setValue(a)}else{a.show("Select a record to accept reservations")}},onCloseConfirmDialog:function(){if(this.confirmDialog.isOpen()){this.confirmDialog.close()}},onConfirmBookSlotPress:function(){debugger;const e=this;const t=this.getView().byId("_IDGendfgdInput1").getValue(),s=this.getView().byId("_IDGexgrgnInput2").getValue(),r=this.getView().byId("idasgredhmeInput").getValue(),l=this.getView().byId("idasgredhmeIn0075put").getValue(),o=this.getView().byId("id123edsqa").getSelectedKey();const d={driverName:t,driverMobile:s,vehicleNumber:r,vendor_Name:l,reservedSlot_ID:o};const g=this.getView().getModel(),u=this.getView();const b=g.bindList("/reserved");var c=true;if(!t||t.length<3){u.byId("_IDGendfgdInput1").setValueState("Error");u.byId("_IDGendfgdInput1").setValueStateText("Name Must Contain 3 Characters");c=false}else{u.byId("_IDGendfgdInput1").setValueState("None")}if(!s||s.length!==10||!/^\d+$/.test(s)){u.byId("_IDGexgrgnInput2").setValueState("Error");u.byId("_IDGexgrgnInput2").setValueStateText("Mobile number must be a 10-digit numeric value");c=false}else{u.byId("_IDGexgrgnInput2").setValueState("None")}if(!r||!/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(r)){u.byId("idasgredhmeInput").setValueState("Error");u.byId("idasgredhmeInput").setValueStateText("Vehicle number should follow this pattern AP12BG1234");c=false}else{u.byId("idasgredhmeInput").setValueState("None")}if(!l||l.length<3){u.byId("idasgredhmeIn0075put").setValueState("Error");u.byId("idasgredhmeIn0075put").setValueStateText("Vendor Name Must Contain 3 Characters");c=false}else{u.byId("idasgredhmeIn0075put").setValueState("None")}if(!c){a.show("Please enter correct data");return}const h=b.create(d);if(h){var I=this.byId("idReservationsTable").getSelectedItem();I.getBindingContext().delete("$auto");this.byId("_IDGendfgdInput1").setValue("");this.byId("_IDGexgrgnInput2").setValue("");this.byId("idasgredhmeInput").setValue("");this.byId("idasgredhmeIn0075put").setValue("");this.confirmDialog.close();var f=g.bindList("/parkingSlots");f.filter([new i("ID",n.EQ,o)]);f.requestContexts().then(function(t){if(t.length>0){var s=t[0];var i=s.getObject();i.status="Reserved";s.setProperty("status",i.status);g.submitBatch("updateGroup");e.getView().byId("idAllSlots").getBinding("items").refresh();g.refresh()}else{a.show("Slot Unavailable")}})}},onAssignfromReservations:async function(){debugger;if(!this.ConfirmAssignDialog){this.ConfirmAssignDialog=await this.loadFragment("ConfirmAssign")}const e=this.getView().byId("idReservedTable__").getSelectedItem(),t=e.getBindingContext().getObject(),s=t.driverName,i=t.driverMobile,n=t.vehicleNumber,a=t.vendor_Name,r=t.reservedSlot.slotNumbers;if(e){this.ConfirmAssignDialog.open();this.getView().byId("_IDGen__dfgdInput1").setValue(s);this.getView().byId("_IDGexgrsdfgnIn__put2").setValue(i);this.getView().byId("afidasgredhmeI__nput").setValue(n);this.getView().byId("idss__n0075put").setValue(a);this.getView().byId("_dhmeI__nput").setValue(r)}},onCloseAssignConfirmDialog:function(){if(this.ConfirmAssignDialog.isOpen()){this.ConfirmAssignDialog.close()}},onConfirmAssignSlotPress:function(){debugger;var e=this;const t=this.getView().byId("idReservedTable__").getSelectedItem().getBindingContext().getObject();const s=this.getView().byId("idReservedTable__").getSelectedItem().getBindingContext();var r=new Date;var l=r.getFullYear();var o=r.getMonth()+1;var d=r.getDate();var g=r.getHours();var u=r.getMinutes();var b=r.getSeconds();var c=`${l}-${o}-${d} TIME ${g}:${u}:${b}`;const h=this.getView(),I=h.byId("_IDGen__dfgdInput1").getValue(),f=h.byId("_IDGexgrsdfgnIn__put2").getValue(),m=h.byId("afidasgredhmeI__nput").getValue(),v=h.byId("idss__n0075put").getValue(),y=h.byId("_IDGewertnSelect1").getSelectedKey(),V=h.byId("_dhmeI__nput").getValue(),p=c;const S={driverName:I,driverMobile:f,vehicleNumber:m,deliveryType:y,vendor_Name:v,slotNumber_ID:t.reservedSlot.ID,checkInTime:p};var _=this.getView().getModel(),w=_.bindList("/assignedSlots");var N=true;if(!I||I.length<3){h.byId("_IDGen__dfgdInput1").setValueState("Error");h.byId("_IDGen__dfgdInput1").setValueStateText("Name Must Contain 3 Characters");N=false}else{h.byId("_IDGen__dfgdInput1").setValueState("None")}if(!f||f.length!==10||!/^\d+$/.test(f)){h.byId("_IDGexgrsdfgnIn__put2").setValueState("Error");h.byId("_IDGexgrsdfgnIn__put2").setValueStateText("Mobile number must be a 10-digit numeric value");N=false}else{h.byId("_IDGexgrsdfgnIn__put2").setValueState("None")}if(!m||!/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(m)){h.byId("afidasgredhmeI__nput").setValueState("Error");h.byId("afidasgredhmeI__nput").setValueStateText("Vehicle number should follow this pattern AP12BG1234");N=false}else{h.byId("afidasgredhmeI__nput").setValueState("None")}if(!v||v.length<3){h.byId("idss__n0075put").setValueState("Error");h.byId("idss__n0075put").setValueStateText("Vendor Name Must Contain 3 Characters");N=false}else{h.byId("idss__n0075put").setValueState("None")}if(!y||y==="Select"){h.byId("_IDGewertnSelect1").setValueState("Error");h.byId("_IDGewertnSelect1").setValueStateText("Please select atleast one option");N=false}else{h.byId("_IDGewertnSelect1").setValueState("None")}if(!V){h.byId("_dhmeI__nput").setValueState("Error");N=false}else{h.byId("_dhmeI__nput").setValueState("None")}if(!N){a.show("Please enter correct data");return}else{const e=w.create(S);if(e){a.show("allotment successful");this.getView().byId("idAssignedTable").getBinding("items").refresh();this.getView().byId("_IDGen__dfgdInput1").setValue("");this.getView().byId("_IDGexgrsdfgnIn__put2").setValue("");this.getView().byId("afidasgredhmeI__nput").setValue("");this.getView().byId("_dhmeI__nput").setValue("");this.getView().byId("idss__n0075put").setValue("");this.ConfirmAssignDialog.close();s.delete("$auto").then(function(){var e=_.bindList("/parkingSlots");e.filter([new i("slotNumbers",n.EQ,V)]);e.requestContexts().then(function(e){if(e.length>0){var t=e[0];var s=t.getObject();s.status="Not Available";t.setProperty("status",s.status);_.submitBatch("updateGroup");_.refresh()}else{a.show("Slot Unavailable")}})})}}},onRejectPress:async function(){const e=this.getView().byId("idReservationsTable").getSelectedItem();if(e){if(!this.confirmRejectDialog){this.confirmRejectDialog=await this.loadFragment("RejectConfirmation")}this.confirmRejectDialog.open()}else{r.information("Select one record to continue")}},onRejectCloseConfirmDialog:function(){if(this.confirmRejectDialog.isOpen()){this.confirmRejectDialog.close()}},onRejectReservePress:function(){debugger;const e=this.getView().byId("idReservationsTable").getSelectedItem();e.getBindingContext().delete("$auto").then(function(){a.show("Rejected")});this.confirmRejectDialog.close()}})});
//# sourceMappingURL=HomeView.controller.js.map