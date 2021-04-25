import { LightningElement,wire,api} from 'lwc';
import getClasses from "@salesforce/apex/StudentDetail.getClasses";

export default class StudentNoteEditor extends LightningElement {
    courses =[];
    @api studentId;
    selectedClass;

    @wire(getClasses,{studentId : '$studentId'})
	wired_getClasses({ error, data }) {
        this.courses =[];
         if (data) {
            this.courses.push({value: "",label: "Select a Class"});
			data.forEach((course) => {this.courses.push({
                value: course.Id,
                label: course.Course_Delivery__r.Course__r.Name});
			});
		} else if (error) {
			this.error = error;
		}
        console.log('Data'+ data);
    }
    onClassChange(event){
        
        this.selectedClass = event.target.value;
    }
    
}