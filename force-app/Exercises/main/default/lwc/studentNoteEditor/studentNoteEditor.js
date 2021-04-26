import { LightningElement,wire,api} from 'lwc';
import getClasses from "@salesforce/apex/StudentDetail.getClasses";

export default class StudentNoteEditor extends LightningElement {
    
    @api studentId;
    selectedClass;

    onClassChange(event){
        
        this.selectedClass = event.target.value;
    }
    
}