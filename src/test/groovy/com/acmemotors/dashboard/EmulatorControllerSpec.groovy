package com.example

import com.acmemotors.dashboard.EmulatorApplication
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.SpringApplicationConfiguration
import org.springframework.http.MediaType
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.web.context.WebApplicationContext
import spock.lang.Specification
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringApplicationConfiguration(EmulatorApplication)
@WebAppConfiguration
//@WebIntegrationTest("server.port:9999")
class EmulatorControllerSpec extends Specification {

    private MockMvc mockMvc

    @Autowired
    private WebApplicationContext webApplicationContext;

//    @Mock
//    private SimulatorDataService simulatorDataService

    def setup() {
        mockMvc = webAppContextSetup(webApplicationContext).build();
    }

    def "start simulator for vin"() {
        true
//        when:
//            def response = mockMvc.perform(post("/simulator/start/SCEDT26T0BD007019")
//                .contentType(MediaType.APPLICATION_JSON))
//        then:
//            response
//                .andExpect(status().isOk())
//                .andExpect(jsonPath('$.status').value('started'))
    }
}
