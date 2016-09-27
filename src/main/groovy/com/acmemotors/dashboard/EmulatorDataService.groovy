package com.acmemotors.dashboard

import groovy.io.FileType
import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service

import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource
import org.springframework.core.io.support.PathMatchingResourcePatternResolver

import java.io.InputStreamReader
import java.io.BufferedReader
import java.io.InputStream

@Service
class EmulatorDataService {

    @Autowired
    RedisTemplate redisTemplate

    @Autowired
    private SimpMessagingTemplate template;

    String CURRENT_VINS = 'CURRENT_VINS'

    public start(String vin) {
        if (!hasDataRemaining(vin)) {
            restart(vin)
        }
        redisTemplate.opsForValue().set(getSpeedKey(vin), 1)
        redisTemplate.boundSetOps(CURRENT_VINS).add(vin)
        println "Starting Simulator for ${vin}"
    }

    public pause(String vin) {
        redisTemplate.boundSetOps(CURRENT_VINS).remove(vin)
        println "Stopping Simulator for ${vin}"
    }

    public List getCars() {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        // Within a JAR, you can't successfully use File for these things.
        Resource[] resources = resolver.getResources("classpath:/simulations/*.txt");
        List vins = []
        for (Resource r : resources)
        {
          String fileName = r.getFilename()
          vins << fileName.split('-')[0]
        }
        vins = vins.unique()
        return vins
    }

    public restart(String vin) {
        println "Restarting Simulator for ${vin}"
        redisTemplate.boundSetOps(CURRENT_VINS).remove(vin)
        redisTemplate.delete(getSimulatorDataKey(vin))
        redisTemplate.opsForValue().set(getSpeedKey(vin), 1)
        // Same issue with reading a file that is inside a JAR.
        InputStream input = getClass().getResourceAsStream("/simulations/" + vin + "-drive.txt")
        BufferedReader reader = new BufferedReader(new InputStreamReader(input))
        String line;
        while ((line = reader.readLine()) != null)
        {
          redisTemplate.boundListOps(getSimulatorDataKey(vin)).leftPush(line)
        }
        reader.close()
        input.close()
        redisTemplate.boundSetOps(CURRENT_VINS).add(vin)
        println "Restarted Simulator for ${vin}"
    }

    public Boolean isJourneyStarted(String vin) {
        return redisTemplate.boundSetOps(CURRENT_VINS).isMember(vin)
    }

    @Scheduled(fixedRate = 1000L)
    public void nextLocation() {
        redisTemplate.boundSetOps(CURRENT_VINS).members().each { vin ->
            if (!hasDataRemaining(vin)) {
                pause(vin)
                return
            }

            Integer speed = redisTemplate.opsForValue().get(getSpeedKey(vin))
            String data
            (1..speed).each {
                String tempData = redisTemplate.boundListOps(getSimulatorDataKey(vin)).rightPop()
                if (tempData) {
                    data = tempData
                }
            }
            this.template.convertAndSend("/topic/position", convertResponse(new JsonSlurper().parseText(data)));
        }
    }

    public setSpeed(String vin, String howFast) {
        Integer speed = Integer.parseInt(howFast)
        redisTemplate.opsForValue().set(getSpeedKey(vin), speed)
    }


    protected hasDataRemaining(String vin) {
        return redisTemplate.boundListOps(getSimulatorDataKey(vin)).size() != 0
    }

    protected Map convertResponse(Map json) {
        List predictions = []
        json.Predictions.ClusterPredictions.each { key, prediction ->
            predictions << [
                latitude: prediction.EndLocation[0].toString(),
                longitude: prediction.EndLocation[1].toString(),
                mpgJourney: prediction.MPG_Journey,
                probability: prediction.Probability
            ]
        }

        return [
            vin: json.vin,
            longitude: json.longitude,
            latitude: json.latitude,
            vehicleSpeed: json.vehicle_speed,
            fuelSystemStatus: json.fuel_system_status,
            engineLoad: json.engine_load,
            coolantTemp: json.coolant_temp,
            shortTermFuel: json.short_term_fuel,
            longTermFuel: json.long_term_fuel,
            intakeManifoldPressure: json.intake_manifold_pressure,
            intakeAirTemp: json.intake_air_temp,
            mafAirflow: json.maf_airflow,
            throttlePosition: json.throttle_position,
            obdStandards: json.obd_standards,
            timeSinceEngineStart: json.time_since_engine_start,
            fuelLevelInput: json.fuel_level_input,
            relativeThrottlePos: json.relative_throttle_pos,
            absoluteThrottlePosB: json.absolute_throttle_pos_b,
            acceleratorThrottlePosD: json.accelerator_throttle_pos_d,
            acceleratorThrottlePosE: json.accelerator_throttle_pos_e,
            distanceWithMilOn: json.distance_with_mil_on,
            catalystTemp: json.catalyst_temp,
            barometricPressure: json.barometric_pressure,
            controlModuleVoltage: json.control_module_voltage,
            acceleration: json.acceleration,
            bearing: json.bearing,
            rpm: json.rpm,
            journeyId: json.journey_id,
            predictions: predictions,
            remainingRange: json.Predictions.RemainingRange,
            mpgInstantaneous: json.mpg_instantaneous,
        ]
    }

    protected getSimulatorDataKey(String vin) {
        "SIMULATOR_DATA_${vin}".toString()
    }

    protected getSpeedKey(String vin) {
        "SPEED_${vin}".toString()
    }

    public getDestinations(vin) {
        InputStream input = getClass().getResourceAsStream("/simulations/${vin}-destinations.txt")
        if (input != null) {
            try {
                return new JsonSlurper().parse(input)
            } catch (Exception) {
                println "Error parsing destinations for vin ${vin}"
                return null
            }
        } else {
            println "Error accessing 'destinations' file"
            return null
        }
    }

}
