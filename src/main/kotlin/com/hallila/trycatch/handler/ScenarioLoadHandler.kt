package com.hallila.trycatch.handler

import com.fasterxml.jackson.dataformat.yaml.snakeyaml.Yaml
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.hallila.trycatch.WithLogging
import com.hallila.trycatch.model.Scenario
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*
import javax.inject.Singleton


@Singleton class ScenarioLoadHandler : Handler, WithLogging() {
    override fun handle(ctx: Context) {
        ctx.render(Jackson.json(loadScenarios()))
    }
}

@Suppress("UNCHECKED_CAST")
@Throws(IOException::class)
fun loadScenarios(): List<Scenario> {
    val yaml = Yaml()
    val scenario_location = Files.newInputStream(Paths.get("conf/properties.yaml")).use({ `in` ->
        val config = yaml.loadAs(`in`, Properties::class.java)
        val loc = config.getProperty("scenario_location")
        if (!loc.endsWith("/")) loc + "/" else loc
    })
    val folder = File(scenario_location)
    return folder.walkTopDown().asIterable().filter { it.isFile }.map {
        val scenarios = jacksonObjectMapper().readValue(it.inputStream(), Map::class.java) as Map<String, String>
        Scenario.build(scenarios)
    }
}