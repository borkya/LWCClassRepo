import { LightningElement,wire,api} from 'lwc';
import getClasses from "@salesforce/apex/StudentDetail.getClasses";

export default class StudentNoteEditor extends LightningElement {
    
    @api studentId;
    selectedClass;
    @api courses;

    onClassChange(event){
        
        this.selectedClass = event.target.value;
    }
    
}