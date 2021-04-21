import { LightningElement, wire } from 'lwc';
import getRecentDeliveries from '@salesforce/apex/CourseDeliveries.getRecentDeliveries';


export default class Challenge_recentDeliveries extends LightningElement {
    
    @wire(getRecentDeliveries)
    deliveries;
	


}