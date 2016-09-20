package com.hallila.trycatch.handler

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.dataformat.yaml.snakeyaml.Yaml
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.hallila.trycatch.model.Scenario
import org.funktionale.either.eitherTry
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*


class ScenarioSaveHandler : Handler {
    override fun handle(ctx: Context) {
        ctx.parse(Jackson.jsonNode()).map {
            it.get("json")
        }.map {
            Scenario.buildFromJson(it)
        }.map { scenario ->
            eitherTry {
                saveScenario(scenario)
            }
        }.onError {
            println(it)
        }.then {
            if (it.isLeft()) {
                ctx.response.send("Failed to save")
            } else {
                ctx.response.send("Saved successfully")
            }
        }
    }

    @Suppress("UNCHECKED_CAST")
    @Throws(IOException::class)
    private fun saveScenario(scenario: Scenario): Unit {
        val scenario_location = Files.newInputStream(Paths.get("conf/properties.yaml")).use({ `in` ->
            val config = Yaml().loadAs(`in`, Properties::class.java)
            val loc = config.getProperty("scenario_location")
            if (!loc.endsWith("/")) loc + "/" else loc
        })
        val om = ObjectMapper(YAMLFactory()).registerKotlinModule()
        try {
            File(scenario_location + "newScenario.tcs").printWriter().use { out ->
                om.writeValue(out, scenario.steps.reversed())
            }
        } catch (e: Exception) {
            println(e)
        }

    }
}