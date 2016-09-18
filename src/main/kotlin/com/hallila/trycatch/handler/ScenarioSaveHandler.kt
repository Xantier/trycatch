package com.hallila.trycatch.handler

import com.fasterxml.jackson.dataformat.yaml.snakeyaml.Yaml
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
        val yaml = Yaml()
        val scenario_location = Files.newInputStream(Paths.get("conf/properties.yaml")).use({ `in` ->
            val config = yaml.loadAs(`in`, Properties::class.java)
            val loc = config.getProperty("scenario_location")
            if (!loc.endsWith("/")) loc + "/" else loc
        })
        File(scenario_location + "newScenario.tcs").printWriter().use { out ->
            scenario.steps.forEach {
                out.println("${it.name}, ${it.expectation}")
            }
        }
    }
}