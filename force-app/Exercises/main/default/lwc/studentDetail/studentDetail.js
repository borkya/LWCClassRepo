import { LightningElement, wire,track } from 'lwc';
// import { getRecord, getFieldValue,getFieldDisplayValue } from 'lightning/uiRecordApi';
import { getRecord } from 'lightning/uiRecordApi';
import FIELD_Description from '@salesforce/schema/Contact.Description';
import FIELD_Email from '@salesforce/schema/Contact.Email';
import FIELD_Phone from '@salesforce/schema/Contact.Phone';
import FIELD_Name from '@salesforce/schema/Contact.Name';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import SELECTED_STUDENT_CHANNEL from '@salesforce/messageChannel/SelectedStudentChannel__c';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import Utils from 'c/utils';
import getClasses from "@salesforce/apex/StudentDetail.getClasses";
const fields = [FIELD_Name, FIELD_Description, FIELD_Email,FIELD_Phone];

export default class StudentDetail extends NavigationMixin(LightningElement) {
	studentId ;
	subscription;
	courses=[];
	error;
	
	@wire(getRecord, {recordId:'$studentId',fields:fields })
	wiredStudent;
	@wire(MessageContext) messageContext;	

	
    @wire(getClasses,{studentId : '$studentId'})
	wired_getClasses({ error, data }) {
        console.log('StudentId' + this.studentId);
		
         if (data) {
			this.courses =[];
			data.forEach((course) => {this.courses.push({
                value: course.Id,
                label: course.Course_Delivery__r.Course__r.Name +' '+ course.Course_Delivery__r.Start_Date__c});
				console.log('Course:: '+ (JSON.stringify(this.courses)));
			});
	
		} else if (error) {
			this.error = error;
		
		} else{
			console.log('No Data, no courses');
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
	get historyTabText(){
		let text;
		if(this.courses.length){
			text = "";
		}else{
			text= "The student has not registered for any courses";
		}
		return text;
	}

	//TODO #6: Review the cardTitle getter and the _getDisplayValue function below.
	get cardTitle() {
		let title = "Please select a student";
      	if (this.wiredStudent.data) {
			title = this.name;
		} else if (this.wiredStudent.error) {
			title = "Something went wrong..."
		}
		return title;
	}
	
	getDisplayValue(data, field) {
		return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
	}


	connectedCallback() {
		if(this.subscription){
		return;
		}
		this.subscription = subscribe(
		this.messageContext,
		SELECTED_STUDENT_CHANNEL,
		(message) => {
		this.handleStudentChange(message)
			});
		}
	handleStudentChange(message) {
		this.studentId = message.studentId;
			}
	disconnectedCallback() {
		unsubscribe(this.subscription);
		this.subscription = null;
		}

	handleOnClick(){
		this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.studentId,
                objectApiName: 'Contact', // objectApiName is optional
                actionName: 'view'
            }
        });
	}
}