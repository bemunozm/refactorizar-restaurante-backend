import { Router } from 'express';
import { DeliveryController } from '../controllers/DeliveryController';

class DeliveryRoute {
    private readonly deliveryController: DeliveryController;
    public readonly router: Router;

    constructor() {
        this.deliveryController = new DeliveryController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get('/incomplete', this.deliveryController.getIncompleteDeliveries.bind(this.deliveryController));
        this.router.get('/order/:orderId', this.deliveryController.getDeliveryByOrderId.bind(this.deliveryController));
        this.router.post('/create', this.deliveryController.create.bind(this.deliveryController));
        this.router.get('/get', this.deliveryController.get.bind(this.deliveryController));
        this.router.post('/assign', this.deliveryController.assign.bind(this.deliveryController));
        this.router.post('/start', this.deliveryController.start.bind(this.deliveryController));
        this.router.put('/update-status', this.deliveryController.updateStatus.bind(this.deliveryController));
        this.router.get('/user/:userId', this.deliveryController.getDeliveriesByUserId.bind(this.deliveryController));
        this.router.get('/:deliveryId', this.deliveryController.getById.bind(this.deliveryController));
        this.router.put('/complete/:deliveryId', this.deliveryController.complete.bind(this.deliveryController));
        this.router.put('/in-progress/:deliveryId', this.deliveryController.inProgress.bind(this.deliveryController));
        this.router.put('/pending/:deliveryId', this.deliveryController.pending.bind(this.deliveryController));
    }
}

export default new DeliveryRoute().router; 