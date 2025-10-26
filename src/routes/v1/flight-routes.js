const express = require('express')

const {FlightController} = require('../../controllers')
const {FlightMiddleware} = require('../../middlewares')
const router = express.Router()

// /api/v1/airplanes POST
router.post('/', FlightMiddleware.validateCreateRequest ,FlightController.createFlight)
router.get('/' ,FlightController.getAllFlights)
router.get('/:id', FlightController.getFlight)


module.exports = router