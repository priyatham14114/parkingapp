using my.parking as my from '../db/data-model';

@path: '/ParkingSrv'
service CatalogService {
    // @restrict: [
    //     {
    //         grant: '*',
    //         to   : 'Security',
    //         where: 'entity == assignedSlots'
    //     },
    //     {
    //         grant: '*',
    //         to   : 'Security',
    //         where: 'entity == history'
    //     },
    //     {
    //         grant: '*',
    //         to   : 'Security',
    //         where: 'entity == reserved'
    //     },
    //     {
    //         grant: '*',
    //         to   : 'Supervisor'
    //     },
    //     {
    //         grant: 'CREATE',
    //         to   : 'Vendor',
    //         where: 'entity == reservations'
    //     }
    // ]

    entity assignedSlots as projection on my.assignedSlots;

    entity parkingSlots  as projection on my.parkingSlots;
    entity history       as projection on my.history;
    entity reservations  as projection on my.reservations;
    entity reserved      as projection on my.reserved;
}
