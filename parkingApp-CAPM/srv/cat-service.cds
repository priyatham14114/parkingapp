using my.parking as my from '../db/data-model';

@path: '/ParkingSrv'
service CatalogService {
    entity assignedSlots as projection on my.assignedSlots;
    entity parkingSlots as projection on my.parkingSlots;
    entity history as projection on my.history;
    entity reservations as projection on my.reservations;
}