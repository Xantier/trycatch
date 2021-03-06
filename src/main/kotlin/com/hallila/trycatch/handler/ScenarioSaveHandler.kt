package com.hallila.trycatch.handler

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.dataformat.yaml.snakeyaml.Yaml
import com.hallila.trycatch.WithLogging
import com.hallila.trycatch.model.Scenario
import org.funktionale.either.eitherTry
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import ratpack.jackson.Jackson.json
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*


class ScenarioSaveHandler : Handler, WithLogging() {
    val om = ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT)

    override fun handle(ctx: Context) {
        ctx.parse(Jackson.jsonNode()).map {
            Scenario.buildFromJson(it)
        }.map { scenario ->
            eitherTry {
                saveScenario(scenario)
            }
        }.onError {
            LOG.error("Failed to build Scenario from JSON. {}", it)
        }.then {
            if (it.isLeft()) {
                ctx.response.send("Failed to save")
            } else {
                ctx.render(json(it.right().get()))
            }
        }
    }

    @Suppress("UNCHECKED_CAST")
    @Throws(IOException::class)
    private fun saveScenario(scenario: Scenario): Scenario {
        val scenario_location = Files.newInputStream(Paths.get("conf/properties.yaml")).use({ `in` ->
            val config = Yaml().loadAs(`in`, Properties::class.java)
            val loc = config.getProperty("scenario_location")
            if (!loc.endsWith("/")) loc + "/" else loc
        })
        try {
            File(scenario_location + scenario.name + ".json").printWriter().use { out ->
                om.writeValue(out, scenario)
            }
            return scenario
        } catch (e: Exception) {
            LOG.error("Failed to save Scenario", e)
            throw e
        }
    }
}