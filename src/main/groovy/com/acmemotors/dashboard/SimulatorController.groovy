package com.acmemotors.dashboard

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

@RestController
class SimulatorController {

    @Autowired
    SimulatorDataService simulatorDataService

    @CrossOrigin(origins = "*")
    @RequestMapping(value = '/simulator/start/{vin}', method = RequestMethod.POST)
    public startSimulator(@PathVariable String vin) {
        simulatorDataService.start(vin)
        return [status: 'started']
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = '/simulator/restart/{vin}', method = RequestMethod.POST)
    public restartSimulator(@PathVariable String vin) {
        simulatorDataService.restart(vin)
        return [status: 'restarted']
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = '/simulator/pause/{vin}', method = RequestMethod.POST)
    public pauseSimulator(@PathVariable String vin) {
        simulatorDataService.pause(vin)
        return [status: 'stopped']
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = '/simulator/speed/{vin}/{howFast}', method = RequestMethod.POST)
    public fastForwardSimulator(@PathVariable String vin, @PathVariable howFast) {
        simulatorDataService.setSpeed(vin, howFast)
        return [status: 'speeding']
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = 'vins', method = RequestMethod.GET)
    public vins() {
        return simulatorDataService.getCars().collect { vin -> return vin }
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = 'journey/{vin}', method = RequestMethod.GET)
    public journey(@PathVariable String vin) {
        return simulatorDataService.getDestinations(vin)
    }
}
