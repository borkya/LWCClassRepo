import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue,getFieldDisplayValue } from 'lightning/uiRecordApi';
import FIELD_Description from '@salesforce/schema/Contact.Description';
import FIELD_Email from '@salesforce/schema/Contact.Email';
import FIELD_Phone from '@salesforce/schema/Contact.Phone';
import FIELD_Name from '@salesforce/schema/Contact.Name';
const fields = [FIELD_Name, FIELD_Description, FIELD_Email,FIELD_Phone];

export default class StudentDetail extends LightningElement {
	studentId = '0036300000mmddZAAQ';

	//TODO #4: use wire service to call getRecord, passing in our studentId and array of fields.
	//		   Store the result in a property named wiredStudent.
	@wire(getRecord, {recordId:'$studentId',fields:fields })
	wiredStudent;
		
	get name() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Name);
	}

	get description() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Description);
	}

    get phone() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Phone);
	}
    get email() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_Email);
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
	
	_getDisplayValue(data, field) {
		return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
	}
	
}