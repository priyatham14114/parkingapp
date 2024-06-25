using my.parking as my from '../db/data-model';

service PaService {
    entity parkingSlots as projection on my.parkingSlots;
    entity assignedSlots as projection on my.assignedSlots;
    entity history as projection on my.history;
}
