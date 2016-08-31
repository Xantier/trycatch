package com.hallila.trycatch.cli

import com.fasterxml.jackson.dataformat.yaml.snakeyaml.Yaml
import com.hallila.trycatch.model.Scenario
import com.hallila.trycatch.model.ScenarioBuilder
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
            println(scenarios.size)
            scenarios.forEach { println(it.toString()) }
        } catch (e: Exception) {
            log.error("", e)
            System.exit(1)
        }
    }

    @Suppress("UNCHECKED_CAST")
    @Throws(IOException::class)
    fun loadScenarios(): List<Scenario> {
        val yaml = Yaml()
        val scenario_location = Files.newInputStream(Paths.get("properties.yaml")).use({ `in` ->
            val config = yaml.loadAs(`in`, Properties::class.java)
            val loc = config.getProperty("scenario_location")
            if (!loc.endsWith("/")) loc + "/" else loc
        })
        val folder = File(scenario_location)
        return folder.walkTopDown().asIterable().filter { it.isFile }.map {
            val scenarios = yaml.loadAs(it.inputStream(), Map::class.java) as Map<String, String>
            ScenarioBuilder.build(scenarios)
        }
    }
}