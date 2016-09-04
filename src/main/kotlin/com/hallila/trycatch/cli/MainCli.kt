package com.hallila.trycatch.cli

import com.fasterxml.jackson.dataformat.yaml.snakeyaml.Yaml
import com.google.inject.Guice
import com.hallila.trycatch.config.CliContextModule
import com.hallila.trycatch.config.HikariModule
import com.hallila.trycatch.model.Scenario
import com.hallila.trycatch.service.ScenarioRunner
import org.slf4j.LoggerFactory
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*


object MainCli {

    private val log = LoggerFactory.getLogger(MainCli::class.java)

    @JvmStatic fun main(args: Array<String>) {
        try {
            val scenarios = loadScenarios()
            val injector = Guice.createInjector(CliContextModule(), HikariModule())
            val scenarioService = injector.getInstance(ScenarioRunner::class.java)
            scenarioService.handleScenario(scenarios.first())
        } catch (e: Exception) {
            log.error("", e)
            System.exit(1)
        }
    }

    @Suppress("UNCHECKED_CAST")
    @Throws(IOException::class)
    private fun loadScenarios(): List<Scenario> {
        val yaml = Yaml()
        val scenario_location = Files.newInputStream(Paths.get("conf/properties.yaml")).use({ `in` ->
            val config = yaml.loadAs(`in`, Properties::class.java)
            val loc = config.getProperty("scenario_location")
            if (!loc.endsWith("/")) loc + "/" else loc
        })
        val folder = File(scenario_location)
        return folder.walkTopDown().asIterable().filter { it.isFile }.map {
            val scenarios = yaml.loadAs(it.inputStream(), Map::class.java) as Map<String, String>
            Scenario.build(scenarios)
        }
    }
}