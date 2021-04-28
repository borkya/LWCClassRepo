import { LightningElement,wire,api} from 'lwc';
import getClasses from "@salesforce/apex/StudentDetail.getClasses";
import { getRecord,getFieldValue,updateRecord } from 'lightning/uiRecordApi';
import Utils from 'c/utils';
import INSTRUCTOR_NOTES from '@salesforce/schema/Course_Attendee__c.InstructorNotes__c';
import FIELD_ID from '@salesforce/schema/Course_Attendee__c.Id';
const fields = [INSTRUCTOR_NOTES];
export default class StudentNoteEditor extends LightningElement {
    
    @api studentId;
    selectedClass;
    @api courses;
    @api courseId;
    
    @wire(getRecord, { recordId: '$selectedClass', fields })
    course;

    get instructions() {
       return getFieldValue(this.course.data, INSTRUCTOR_NOTES);
    }
    onClassChange(event){
        this.selectedClass = event.target.value;
    }
    onSave () {
        console.log('##### Inside onSave #####')
        this.saveNotes();
        }
    saveNotes() {
            const fieldsToSave = {};
            
                //TODO #8: when doing an update, add the recordId to our fieldsToSave object
                //so that the system knows which record to update
                fieldsToSave[FIELD_ID.fieldApiName] = this.selectedClass;
                fieldsToSave[INSTRUCTOR_NOTES.fieldApiName] = this.template.querySelector("[data-field='notes']").value;
                const recordInput = { fields: fieldsToSave };
                updateRecord(recordInput)
                    .then(() => {
                        Utils.showToast(this, "Success", "Course Notes updated", "success");
                        this.returnToBrowseMode();
                    })
                    .catch((error) => {
                        let errors = reduceErrors(error);
                        let errorBody = errors.length ? errors[0] : "There was a problem updating your record.";
                        Utils.showToast(this, "Error updating record", errorBody, "error");
                    });
            
        }
  
    
}