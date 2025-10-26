const { StatusCodes } = require("http-status-codes");
const {Op} = require('sequelize')
const { FlightRepository } = require("../repositories");
const flightRepository = new FlightRepository();
const AppError = require("../utils/errors/app-error");

async function createFlight(data) {
  try {
    const flight = await flightRepository.create(data);
    return flight;
  } catch (error) {
    if ((error.name = "SequelizeValidationError")) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(
        "cannot create a new Flight object",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    throw new AppError(
      "cannot create a new Flight object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllFlights(query) {
  let customFilter = {};
  let sortFilter =[]
  const endingTripTime = '23:59:00'
 if (query.trips) {
  const [departureAirportId, arrivalAirportId] = query.trips.split("-");
  customFilter.departureAirportId = departureAirportId;
  customFilter.arrivalAirportId = arrivalAirportId;
}

if(query.price){
  [minPrice, maxPrice] = query.price.split('-')
  customFilter.price = {
    [Op.between]:[minPrice, maxPrice]
  }
}
if(query.travelers){
  customFilter.totalSeats={
    [Op.gte]:query.travelers
  }
}
if (query.tripDate) {
  const startDate = new Date(query.tripDate + "T00:00:00");
  const endDate = new Date(query.tripDate + "T23:59:59");

  customFilter.departureTime = {
    [Op.between]: [startDate, endDate]
  };
}

if(query.sort){
  const params = query.sort.split(',');
  const sortFilters = params.map((param)=>param.split('_'))
  sortFilter = sortFilters
}
  try {
    const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
    return flights
  } catch (error) {
    throw new AppError(
      "Cannot fetch data of all the flights",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getFlight(id) {
  try {
        const flight = await flightRepository.getAll()
        return flight
    } catch (error) {
        throw new AppError("cannot fetch data of all the flights",StatusCodes.INTERNAL_SERVER_ERROR)

    }
}

async function updateSeats(data){
  try {
    const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats, data.dec)
    return response
  } catch (error) {
    console.log(error)
            throw new AppError("cannot update data of all the flights",StatusCodes.INTERNAL_SERVER_ERROR)

  }
}
module.exports = {
  createFlight, getAllFlights, getFlight, updateSeats
};
