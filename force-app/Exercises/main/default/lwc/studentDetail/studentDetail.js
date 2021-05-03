import { LightningElement, wire, track } from "lwc";
// import { getRecord, getFieldValue,getFieldDisplayValue } from 'lightning/uiRecordApi';
import { getRecord } from "lightning/uiRecordApi";
import FIELD_Description from "@salesforce/schema/Contact.Description";
import FIELD_Email from "@salesforce/schema/Contact.Email";
import FIELD_Phone from "@salesforce/schema/Contact.Phone";
import FIELD_Name from "@salesforce/schema/Contact.Name";
import { subscribe, unsubscribe, MessageContext } from "lightning/messageService";
import SELECTED_STUDENT_CHANNEL from "@salesforce/messageChannel/SelectedStudentChannel__c";
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";
import Utils from "c/utils";
import getCourses from "@salesforce/apex/StudentDetail.getCourses";
import { refreshApex } from '@salesforce/apex';
const fields = [FIELD_Name, FIELD_Description, FIELD_Email, FIELD_Phone];

export default class StudentDetail extends NavigationMixin(LightningElement) {
	studentId;
	subscription;
	@track courses = [];
	error;
	refresh_getCourses;

	@wire(getRecord, { recordId: "$studentId", fields: fields })
	wiredStudent;
	@wire(MessageContext) messageContext;

	@wire(getCourses, { studentId: "$studentId" })
	wired_getCourses(result) {
		console.log("StudentId" + this.studentId);
		const {data,error} = result;  // object destructuring syntax  used for apexrefresh https://developer.salesforce.com/docs/// component-library/documentation/en/lwc/reference_salesforce_modules
		if (data) {
			this.refresh_getCourses = result;
			this.courses = [];
			data.forEach((course) => {
				this.courses.push({
					value: course.Id,
					label: course.Course_Delivery__r.Course__r.Name + " " + course.Course_Delivery__r.Start_Date__c,
					instructions: course.InstructorNotes__c
				});
				console.log("Course:: " + JSON.stringify(this.courses));
			});
		} else if (error) {
			this.error = error;
		} else {
			console.log("No Data, no courses");
		}
	}
	get name() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Name);
	}

	get description() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Description);
	}

	get phone() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Phone);
	}
	get email() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Email);
	}
	get historyTabText() {
		let text;
		if (this.courses.length) {
			text = "";
		} else {
			text = "The student has not registered for any courses";
		}
		return text;
	}

	//TODO #6: Review the cardTitle getter and the _getDisplayValue function below.
	get cardTitle() {
		let title = "Please select a student";
		if (this.wiredStudent.data) {
			title = this.name;
		} else if (this.wiredStudent.error) {
			title = "Something went wrong...";
		}
		return title;
	}

	getDisplayValue(data, field) {
		return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
	}

	connectedCallback() {
		if (this.subscription) {
			return;
		}
		this.subscription = subscribe(this.messageContext, SELECTED_STUDENT_CHANNEL, (message) => {
			this.handleStudentChange(message);
		});
	}
	handleStudentChange(message) {
		this.studentId = message.studentId;
	}
	disconnectedCallback() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}

	handleOnClick() {
		this[NavigationMixin.Navigate]({
			type: "standard__recordPage",
			attributes: {
				recordId: this.studentId,
				objectApiName: "Contact", // objectApiName is optional
				actionName: "view"
			}
		});
	}
	handleNotesUpdate(event) {
		console.log('inside handeNotesUpdates');
		refreshApex(this.refresh_getCourses);
	}
}
