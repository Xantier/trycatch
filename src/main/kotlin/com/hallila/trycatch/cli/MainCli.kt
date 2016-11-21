package com.hallila.trycatch.cli

import com.google.inject.Guice
import com.hallila.trycatch.config.CliContextModule
import com.hallila.trycatch.config.HikariModule
import com.hallila.trycatch.handler.loadScenarios
import com.hallila.trycatch.service.ScenarioRunner
import org.slf4j.LoggerFactory


object MainCli {

    private val log = LoggerFactory.getLogger(MainCli::class.java)

    @JvmStatic fun main(args: Array<String>) {
        try {
            val scenarios = loadScenarios()
            val injector = Guice.createInjector(CliContextModule(), HikariModule())
            val scenarioService = injector.getInstance(ScenarioRunner::class.java)
            scenarioService.handleScenarios(scenarios)
        } catch (e: Exception) {
            log.error("", e)
            System.exit(1)
        }
    }

}