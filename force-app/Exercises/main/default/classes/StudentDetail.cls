public with sharing class StudentDetail {
    @AuraEnabled(cacheable=true)
    public static List<Course_Attendee__c> getClasses(Id studentId) {
        List<Course_Attendee__c> classes   =[SELECT Id,Name, InstructorNotes__c, Course_Delivery__r.Start_Date__c, Course_Delivery__r.Course__r.Name,Course_Delivery__r.Instructor__r.Name,Student__c
        FROM Course_Attendee__c
        WHERE Student__c =: studentId //'0036300000mmdgNAAQ'
        WITH SECURITY_ENFORCED
        ORDER BY Course_Delivery__r.Course__r.Name ASC
        LIMIT 10];
        system.debug('Result' + classes);
        return  classes;
    }
}